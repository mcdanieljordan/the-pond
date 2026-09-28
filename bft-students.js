/* ===========================================================
   BFT-STUDENTS.JS — BullFrogBuddy roster + points library v1
   Single source of truth for classes, students, photos, XP.

   USAGE:
     // After Google sign-in and passphrase unlock:
     BFT_STUDENTS.init(sb, user, cryptoKey);
     // Then call any method.

   ENCRYPTION: identical scheme to index.html — PBKDF2 → AES-GCM,
   { iv, data } jsonb for text fields.  Photo bytes use IV-prepended
   binary (12 bytes IV | encrypted WebP).
   =========================================================== */
(function (w) {
  'use strict';
  if (w.BFT_STUDENTS) return;

  let _sb        = null;
  let _user      = null;
  let _cryptoKey = null;
  let _photoCache = {};   // studentId → blob URL
  let _rtChannel  = null;

  const QUEUE_KEY = 'bft_xp_queue';

  // ── CRYPTO — exact scheme from index.html ────────────────

  function toB64(buf) {
    return btoa(String.fromCharCode(...new Uint8Array(buf)));
  }
  function fromB64(str) {
    return Uint8Array.from(atob(str), ch => ch.charCodeAt(0));
  }

  async function deriveKeyFromPassphrase(passphrase, salt) {
    const material = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(passphrase), 'PBKDF2', false, ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
      material,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async function encryptWith(text, key) {
    const iv   = crypto.getRandomValues(new Uint8Array(12));
    const data = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv }, key, new TextEncoder().encode(text)
    );
    return { iv: toB64(iv), data: toB64(data) };
  }

  async function decryptWith(payload, key) {
    const plain = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: fromB64(payload.iv) }, key, fromB64(payload.data)
    );
    return new TextDecoder().decode(plain);
  }

  async function encryptField(text) {
    return encryptWith(text, _cryptoKey);
  }

  async function decryptField(payload) {
    if (!payload) return '';
    // Plain-text fallback: legacy rows may store a real string, not {iv,data}
    if (typeof payload === 'string') return payload;
    if (!payload.iv || !payload.data) return '';
    try { return await decryptWith(payload, _cryptoKey); }
    catch { return ''; }
  }

  // Photo encryption: 12-byte IV prepended to raw AES-GCM output
  async function _encryptBuffer(arrayBuffer) {
    const iv  = crypto.getRandomValues(new Uint8Array(12));
    const enc = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, _cryptoKey, arrayBuffer);
    const out = new Uint8Array(12 + enc.byteLength);
    out.set(iv, 0);
    out.set(new Uint8Array(enc), 12);
    return out.buffer;
  }

  async function _decryptBuffer(arrayBuffer) {
    const iv   = new Uint8Array(arrayBuffer, 0, 12);
    const data = new Uint8Array(arrayBuffer, 12);
    return crypto.subtle.decrypt({ name: 'AES-GCM', iv }, _cryptoKey, data);
  }

  // ── INIT ─────────────────────────────────────────────────

  function _init(sb, user, cryptoKey) {
    _sb        = sb;
    _user      = user;
    _cryptoKey = cryptoKey;
    _photoCache = {};
    _flushQueue();
  }

  function _ready() {
    return !!(_sb && _user && _cryptoKey);
  }

  function _assert() {
    if (!_ready()) throw new Error('BFT_STUDENTS: call init(sb, user, cryptoKey) first.');
  }

  // ── CLASSES ───────────────────────────────────────────────

  async function _listClasses() {
    _assert();
    const { data, error } = await _sb
      .from('classes')
      .select('*')
      .eq('user_id', _user.id)
      .or('archived.is.null,archived.eq.false')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return Promise.all(data.map(async c => {
      const enc = await decryptField(c.name_encrypted);
      // Fall back to plain name column (index.html stores '[encrypted]' as placeholder,
      // but legacy rows may have the real name there)
      const name = (enc && enc !== '[encrypted]') ? enc : (c.name || '');
      return { ...c, name };
    }));
  }

  // ── STUDENTS ──────────────────────────────────────────────

  async function _listStudents(classId) {
    _assert();
    const { data, error } = await _sb
      .from('beta_students')
      .select('*')
      .eq('class_id', classId)
      .or('archived.is.null,archived.eq.false')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return Promise.all(data.map(async s => {
      const enc = await decryptField(s.name_encrypted);
      // Assemble fallback from first/last if full name decrypt failed
      const first = enc ? '' : await decryptField(s.first_name_encrypted);
      const last  = enc ? '' : await decryptField(s.last_name_encrypted);
      const name  = enc || [first, last].filter(Boolean).join(' ') || '[unnamed]';
      return { ...s, name };
    }));
  }

  async function _saveStudent(student) {
    _assert();
    const row = { ...student };

    // Encrypt first_name + last_name if provided, build name_encrypted from full name
    const first = student.first_name !== undefined ? String(student.first_name).trim() : null;
    const last  = student.last_name  !== undefined ? String(student.last_name).trim()  : null;
    if (first !== null || last !== null) {
      const full = [first, last].filter(Boolean).join(' ');
      if (full) row.name_encrypted = await encryptField(full);
      if (first) row.first_name_encrypted = await encryptField(first);
      if (last)  row.last_name_encrypted  = await encryptField(last);
      delete row.first_name;
      delete row.last_name;
    }

    // Plain name field override (index.html stores '[encrypted]' as NOT NULL placeholder)
    if (student.name !== undefined) {
      row.name_encrypted = await encryptField(String(student.name));
      delete row.name;
    }
    if (!row.name) row.name = '[encrypted]';

    const { error } = await _sb
      .from('beta_students')
      .upsert(row, { onConflict: 'id' });
    if (error) throw error;
  }

  // ── PHOTOS ────────────────────────────────────────────────

  async function _uploadPhoto(studentId, file) {
    _assert();
    // Resize to 256×256 WebP (or JPEG fallback)
    const bitmap = await createImageBitmap(file);
    const SIZE   = 256;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = SIZE;
    const ctx    = canvas.getContext('2d');
    const scale  = Math.min(SIZE / bitmap.width, SIZE / bitmap.height);
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    ctx.drawImage(bitmap, (SIZE - w) / 2, (SIZE - h) / 2, w, h);
    bitmap.close();

    // Prefer WebP; fall back to JPEG
    const mime = canvas.toDataURL('image/webp').startsWith('data:image/webp')
      ? 'image/webp' : 'image/jpeg';
    const blob   = await new Promise(res => canvas.toBlob(res, mime, 0.85));
    const buffer = await blob.arrayBuffer();

    const encrypted = await _encryptBuffer(buffer);
    const path = `${_user.id}/${studentId}.bin`;

    const { error: upErr } = await _sb.storage
      .from('student-photos')
      .upload(path, new Blob([encrypted], { type: 'application/octet-stream' }), { upsert: true });
    if (upErr) throw upErr;

    const { error: dbErr } = await _sb
      .from('beta_students')
      .update({ photo_path: path })
      .eq('id', studentId);
    if (dbErr) throw dbErr;

    // Bust cache
    if (_photoCache[studentId]) {
      URL.revokeObjectURL(_photoCache[studentId]);
      delete _photoCache[studentId];
    }

    return path;
  }

  async function _getPhotoURL(student) {
    if (!student || !student.photo_path) return null;
    if (_photoCache[student.id]) return _photoCache[student.id];

    const { data, error } = await _sb.storage
      .from('student-photos')
      .download(student.photo_path);
    if (error) throw error;

    const buffer    = await data.arrayBuffer();
    const decrypted = await _decryptBuffer(buffer);

    const url = URL.createObjectURL(new Blob([decrypted], { type: 'image/webp' }));
    _photoCache[student.id] = url;
    return url;
  }

  // ── XP EVENTS ─────────────────────────────────────────────

  async function _award(studentIds, delta, { appSource, classId, reason } = {}) {
    _assert();
    if (!appSource) throw new Error('award() requires appSource');

    const batchId = crypto.randomUUID();
    const rows = studentIds.map(sid => ({
      user_id:    _user.id,
      student_id: sid,
      class_id:   classId || null,
      app_source: appSource,
      delta,
      reason:     reason || null,
      batch_id:   batchId
    }));

    if (!navigator.onLine) {
      _enqueueAward({ rows });
      return batchId;
    }

    const { error } = await _sb.from('xp_events').insert(rows);
    if (error) throw error;
    return batchId;
  }

  async function _undo(batchId) {
    _assert();
    const { error } = await _sb
      .from('xp_events')
      .delete()
      .eq('batch_id', batchId)
      .eq('user_id', _user.id);
    if (error) throw error;
  }

  async function _totals(studentIds) {
    _assert();
    if (!studentIds.length) return [];
    const { data, error } = await _sb
      .from('student_xp_totals')
      .select('student_id,total_xp')
      .in('student_id', studentIds);
    if (error) throw error;
    return data;
  }

  async function _byApp(studentIds) {
    _assert();
    if (!studentIds.length) return [];
    const { data, error } = await _sb
      .from('student_xp_by_app')
      .select('student_id,app_source,xp')
      .in('student_id', studentIds);
    if (error) throw error;
    return data;
  }

  async function _history(studentId) {
    _assert();
    const { data, error } = await _sb
      .from('xp_events')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return data;
  }

  // ── REALTIME ──────────────────────────────────────────────

  function _onChange(callback) {
    _assert();
    if (_rtChannel) _sb.removeChannel(_rtChannel);

    _rtChannel = _sb
      .channel('bft-students-live-' + Date.now())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'beta_students' },
          () => callback('students'))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'xp_events' },
          () => callback('xp_events'))
      .subscribe();

    return () => {
      if (_rtChannel) { _sb.removeChannel(_rtChannel); _rtChannel = null; }
    };
  }

  // ── OFFLINE QUEUE ─────────────────────────────────────────

  function _enqueueAward(item) {
    let q = [];
    try { q = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); } catch (_) {}
    q.push(item);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
  }

  async function _flushQueue() {
    let q = [];
    try { q = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); } catch (_) { return; }
    if (!q.length) return;

    const failed = [];
    for (const item of q) {
      try {
        const { error } = await _sb.from('xp_events').insert(item.rows);
        if (error) failed.push(item);
      } catch { failed.push(item); }
    }
    localStorage.setItem(QUEUE_KEY, JSON.stringify(failed));
  }

  window.addEventListener('online', () => { if (_ready()) _flushQueue(); });

  // ── PUBLIC API ────────────────────────────────────────────

  w.BFT_STUDENTS = {
    // Expose crypto helpers so the host page can derive & pass the key
    toB64,
    fromB64,
    deriveKeyFromPassphrase,

    init:       _init,
    ready:      _ready,

    listClasses:  _listClasses,
    listStudents: _listStudents,
    saveStudent:  _saveStudent,
    uploadPhoto:  _uploadPhoto,
    getPhotoURL:  _getPhotoURL,

    award:   _award,
    undo:    _undo,
    totals:  _totals,
    byApp:   _byApp,
    history: _history,

    onChange: _onChange
  };
})(window);
