/* ===========================================================
   BFT-THEME.JS — BullFrogBuddy shared theme engine v1
   Scopes: account → app → class.  Offline cache: localStorage "bft_theme".
   NOTE: THEME_PRESETS was not found in Leader_Locator_beta.html;
         28 presets were created here (18 light + 10 dark).
         THEME_COLORS, softTint, and bestTextOn are exact copies
         from Leader_Locator_beta.html.
   =========================================================== */
(function (w) {
  'use strict';
  if (w.BFT_THEME) return;

  // THEME_COLORS — exact copy from Leader_Locator_beta.html
  const THEME_COLORS = [
    { name: 'Amber',   hex: '#F7C24B' }, { name: 'Orange',  hex: '#E8951F' }, { name: 'Red',     hex: '#C9402F' },
    { name: 'Coral',   hex: '#E2622C' }, { name: 'Gold',    hex: '#D8B215' }, { name: 'Olive',   hex: '#A8B520' },
    { name: 'Green',   hex: '#5FA02A' }, { name: 'Forest',  hex: '#2E8B5E' }, { name: 'Teal',    hex: '#12977F' },
    { name: 'Sky',     hex: '#1B8FA8' }, { name: 'Blue',    hex: '#2C6BAF' }, { name: 'Indigo',  hex: '#5B6FD8' },
    { name: 'Violet',  hex: '#9B6FD8' }, { name: 'Magenta', hex: '#C15FC0' }, { name: 'Pink',    hex: '#D85FA0' },
    { name: 'Slate',   hex: '#8A9689' }
  ];

  // THEME_PRESETS — created here (not in Leader_Locator_beta.html)
  const THEME_PRESETS = [
    // LIGHT (18)
    { id: 'frog-pond',    name: 'Frog Pond',    header: '#2E8B5E', accent: '#5FA02A', mode: 'light' },
    { id: 'deep-forest',  name: 'Deep Forest',  header: '#2E8B5E', accent: '#12977F', mode: 'light' },
    { id: 'meadow',       name: 'Meadow',       header: '#5FA02A', accent: '#A8B520', mode: 'light' },
    { id: 'tropical',     name: 'Tropical',     header: '#12977F', accent: '#5FA02A', mode: 'light' },
    { id: 'ocean',        name: 'Ocean',        header: '#12977F', accent: '#1B8FA8', mode: 'light' },
    { id: 'sky-high',     name: 'Sky High',     header: '#1B8FA8', accent: '#2C6BAF', mode: 'light' },
    { id: 'deep-blue',    name: 'Deep Blue',    header: '#2C6BAF', accent: '#5B6FD8', mode: 'light' },
    { id: 'navy',         name: 'Navy',         header: '#5B6FD8', accent: '#2C6BAF', mode: 'light' },
    { id: 'sunset',       name: 'Sunset',       header: '#E8951F', accent: '#E2622C', mode: 'light' },
    { id: 'autumn',       name: 'Autumn',       header: '#F7C24B', accent: '#D8B215', mode: 'light' },
    { id: 'fire',         name: 'Fire',         header: '#C9402F', accent: '#E8951F', mode: 'light' },
    { id: 'desert-gold',  name: 'Desert Gold',  header: '#D8B215', accent: '#F7C24B', mode: 'light' },
    { id: 'olive-branch', name: 'Olive Branch', header: '#A8B520', accent: '#2E8B5E', mode: 'light' },
    { id: 'coral-reef',   name: 'Coral Reef',   header: '#E2622C', accent: '#E8951F', mode: 'light' },
    { id: 'violet-sky',   name: 'Violet Sky',   header: '#9B6FD8', accent: '#5B6FD8', mode: 'light' },
    { id: 'magenta-wave', name: 'Magenta Wave', header: '#C15FC0', accent: '#9B6FD8', mode: 'light' },
    { id: 'rose-garden',  name: 'Rose Garden',  header: '#D85FA0', accent: '#C15FC0', mode: 'light' },
    { id: 'slate-rock',   name: 'Slate Rock',   header: '#8A9689', accent: '#2C6BAF', mode: 'light' },
    // DARK (10)
    { id: 'night-forest', name: 'Night Forest', header: '#2E8B5E', accent: '#5FA02A', mode: 'dark' },
    { id: 'deep-ocean',   name: 'Deep Ocean',   header: '#2C6BAF', accent: '#12977F', mode: 'dark' },
    { id: 'midnight',     name: 'Midnight',     header: '#5B6FD8', accent: '#9B6FD8', mode: 'dark' },
    { id: 'ember',        name: 'Ember',        header: '#C9402F', accent: '#E8951F', mode: 'dark' },
    { id: 'dark-meadow',  name: 'Dark Meadow',  header: '#5FA02A', accent: '#A8B520', mode: 'dark' },
    { id: 'night-sky',    name: 'Night Sky',    header: '#1B8FA8', accent: '#2C6BAF', mode: 'dark' },
    { id: 'dark-violet',  name: 'Dark Violet',  header: '#9B6FD8', accent: '#C15FC0', mode: 'dark' },
    { id: 'dark-slate',   name: 'Dark Slate',   header: '#8A9689', accent: '#12977F', mode: 'dark' },
    { id: 'dark-gold',    name: 'Dark Gold',    header: '#D8B215', accent: '#F7C24B', mode: 'dark' },
    { id: 'dark-coral',   name: 'Dark Coral',   header: '#E2622C', accent: '#D85FA0', mode: 'dark' }
  ];

  // softTint — exact from Leader_Locator_beta.html
  function softTint(hex) {
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    const mix = c => Math.round(c * 0.14 + 255 * 0.86);
    return 'rgb(' + mix(r) + ',' + mix(g) + ',' + mix(b) + ')';
  }

  // bestTextOn — exact from Leader_Locator_beta.html
  function bestTextOn(hex) {
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? '#17251C' : '#FFFFFF';
  }

  // DEFAULTS
  const DEFAULT = {
    preset: 'frog-pond', header: '#2E8B5E', accent: '#5FA02A',
    name: 'Frog Pond', mode: 'light', textSize: 'M', contrast: false
  };

  const LS_KEY = 'bft_theme';
  let _appId    = null;
  let _classId  = null;
  let _scopes   = { account: {}, apps: {}, classes: {} };
  let _syncTimer = null;
  let _pickerEl  = null;
  let _activeScope = 'account';

  // CACHE
  function _loadCache() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) _scopes = JSON.parse(raw);
    } catch (_) {}
    _scopes.account  = _scopes.account  || {};
    _scopes.apps     = _scopes.apps     || {};
    _scopes.classes  = _scopes.classes  || {};
  }

  function _saveCache() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(_scopes)); } catch (_) {}
  }

  // RESOLVE — class > app > account > default
  function _resolve() {
    const t = Object.assign({}, DEFAULT, _scopes.account);
    if (_appId && _scopes.apps[_appId])       Object.assign(t, _scopes.apps[_appId]);
    if (_classId && _scopes.classes[_classId]) Object.assign(t, _scopes.classes[_classId]);
    return t;
  }

  // APPLY — writes CSS vars + data attrs to <html>
  function _apply() {
    const t   = _resolve();
    const root = document.documentElement;
    const isDark = t.mode === 'dark';
    const isHC   = !!t.contrast;
    const h = t.header, a = t.accent;

    root.style.setProperty('--bft-header',  h);
    root.style.setProperty('--bft-accent',  a);
    root.style.setProperty('--bft-fg',      bestTextOn(h));
    root.style.setProperty('--bft-tint',    isHC ? 'transparent' : softTint(a));
    root.style.setProperty('--bft-bg',      isDark ? '#111827' : '#F8FAFC');
    root.style.setProperty('--bft-surface', isDark ? '#1F2937' : '#FFFFFF');
    root.style.setProperty('--bft-text',    isDark ? '#F1F5F9' : '#1E293B');
    root.style.setProperty('--bft-scale',   t.textSize === 'S' ? '0.9' : t.textSize === 'L' ? '1.2' : '1');
    root.setAttribute('data-mode',     isDark  ? 'dark'  : 'light');
    root.setAttribute('data-contrast', isHC    ? 'true'  : 'false');

    _refreshPicker();
  }

  // SAVE — merge partial into scope, persist, re-apply
  function _save(scope, partial) {
    let target;
    if (scope === 'app') {
      if (!_appId) return;
      if (!_scopes.apps[_appId]) _scopes.apps[_appId] = {};
      target = _scopes.apps[_appId];
    } else if (scope === 'class') {
      if (!_classId) return;
      if (!_scopes.classes[_classId]) _scopes.classes[_classId] = {};
      target = _scopes.classes[_classId];
    } else {
      target = _scopes.account;
    }
    Object.assign(target, partial);
    _saveCache();
    _apply();
  }

  // CLEAR — remove a scope's overrides
  function _clear(scope) {
    if (scope === 'app'   && _appId)   delete _scopes.apps[_appId];
    else if (scope === 'class' && _classId) delete _scopes.classes[_classId];
    else _scopes.account = {};
    _saveCache();
    _apply();
  }

  // SYNC FROM PROFILE (beta_profiles.theme jsonb)
  async function _syncFromProfile(sb, userId) {
    const { data } = await sb.from('beta_profiles').select('theme').eq('user_id', userId).maybeSingle();
    if (data && data.theme && typeof data.theme === 'object') {
      _scopes = Object.assign({ account: {}, apps: {}, classes: {} }, data.theme);
      _saveCache();
      _apply();
    }
  }

  // SYNC TO PROFILE — debounced 600 ms
  function _syncToProfile(sb, userId) {
    clearTimeout(_syncTimer);
    _syncTimer = setTimeout(() => {
      sb.from('beta_profiles').update({ theme: _scopes }).eq('user_id', userId);
    }, 600);
  }

  // PICKER ————————————————————————————————————————————

  function _injectPickerCSS() {
    if (document.getElementById('bft-theme-picker-css')) return;
    const s = document.createElement('style');
    s.id = 'bft-theme-picker-css';
    s.textContent = `
/* PICKER BASE */
.bft-picker{font:15px/1.5 system-ui,sans-serif;background:var(--bft-surface,#fff);
  color:var(--bft-text,#1E293B);border-radius:14px;padding:18px;width:380px;
  box-shadow:0 4px 28px rgba(0,0,0,.13);user-select:none}
.bft-picker *{box-sizing:border-box}

/* TABS */
.bft-picker-tabs{display:flex;gap:4px;margin-bottom:14px}
.bft-picker-tab{flex:1;min-height:44px;border:1.5px solid #e2e8f0;border-radius:9px;
  background:#f8fafc;cursor:pointer;font-size:13px;font-weight:600;transition:.15s}
.bft-picker-tab.active{background:var(--bft-header,#2E8B5E);
  color:var(--bft-fg,#fff);border-color:var(--bft-header,#2E8B5E)}

/* SECTIONS */
.bft-picker-section{margin-bottom:12px}
.bft-picker-label{font-size:11px;font-weight:700;text-transform:uppercase;
  letter-spacing:.07em;color:#64748b;margin-bottom:7px}

/* PRESET SWATCHES */
.bft-picker-presets{display:flex;flex-wrap:wrap;gap:5px}
.bft-preset-swatch{width:30px;height:30px;border-radius:7px;border:2.5px solid transparent;
  cursor:pointer;transition:.15s;position:relative}
.bft-preset-swatch:hover{transform:scale(1.12)}
.bft-preset-swatch.active{border-color:#1E293B;transform:scale(1.18)}
.bft-preset-swatch[data-dark]::after{content:'';position:absolute;right:3px;bottom:3px;
  width:7px;height:7px;border-radius:50%;background:rgba(0,0,0,.45)}

/* COLOR ROWS */
.bft-picker-colors{display:flex;flex-wrap:wrap;gap:5px;align-items:center}
.bft-color-swatch{width:30px;height:30px;border-radius:7px;border:2.5px solid transparent;
  cursor:pointer;transition:.15s;min-width:44px;min-height:44px;width:44px;height:44px;
  border-radius:8px}
.bft-color-swatch:hover{transform:scale(1.1)}
.bft-color-swatch.active{border-color:#1E293B;transform:scale(1.15)}
.bft-color-custom{width:44px;height:44px;padding:2px;border:1.5px solid #e2e8f0;
  border-radius:8px;cursor:pointer;background:none}

/* NAME INPUT */
.bft-picker-name{width:100%;padding:9px 12px;border:1.5px solid #e2e8f0;border-radius:9px;
  font-size:14px;outline:none;background:var(--bft-surface,#fff);color:var(--bft-text,#1E293B)}
.bft-picker-name:focus{border-color:var(--bft-header,#2E8B5E)}

/* TOGGLES + SIZE */
.bft-picker-row{display:flex;align-items:center;gap:12px;margin-bottom:10px;flex-wrap:wrap}
.bft-picker-row label{display:flex;align-items:center;gap:6px;font-size:14px;cursor:pointer;
  min-height:44px}
.bft-picker-row input[type=checkbox]{width:18px;height:18px;cursor:pointer}
.bft-size-btn{min-height:44px;padding:0 16px;border:1.5px solid #e2e8f0;border-radius:9px;
  background:#f8fafc;cursor:pointer;font-weight:700;font-size:14px;transition:.15s}
.bft-size-btn.active{background:var(--bft-header,#2E8B5E);
  color:var(--bft-fg,#fff);border-color:var(--bft-header,#2E8B5E)}

/* PREVIEW */
.bft-picker-preview{border-radius:9px;overflow:hidden;margin-bottom:12px;border:1.5px solid #e2e8f0}
.bft-preview-header{padding:11px 14px;font-weight:700;font-size:15px}
.bft-preview-body{padding:10px 14px;font-size:13px}

/* RESET */
.bft-picker-reset{width:100%;min-height:44px;border:1.5px solid #e2e8f0;border-radius:9px;
  background:#f8fafc;cursor:pointer;font-size:13px;color:#64748b;transition:.15s}
.bft-picker-reset:hover{background:#fee2e2;border-color:#fca5a5;color:#dc2626}

/* HIGH-CONTRAST overrides */
[data-contrast=true] .bft-picker-tab.active,
[data-contrast=true] .bft-size-btn.active{border-width:3px}
[data-contrast=true] .bft-color-custom,[data-contrast=true] .bft-picker-name{border-width:3px}
`;
    document.head.appendChild(s);
  }

  function _buildPicker(el) {
    if (!el) return;
    const t     = _resolve();
    const scope = _activeScope;

    el.innerHTML = `
<div class="bft-picker">

  <!-- SCOPE TABS -->
  <div class="bft-picker-tabs">
    <button class="bft-picker-tab${scope==='account'?' active':''}" data-s="account">All Apps</button>
    <button class="bft-picker-tab${scope==='app'?' active':''}" data-s="app">This App</button>
    <button class="bft-picker-tab${scope==='class'?' active':''}" data-s="class">This Class</button>
  </div>

  <!-- PRESETS -->
  <div class="bft-picker-section">
    <div class="bft-picker-label">Presets (${THEME_PRESETS.length})</div>
    <div class="bft-picker-presets">
      ${THEME_PRESETS.map(p => `<button
        class="bft-preset-swatch${t.preset===p.id?' active':''}"
        data-p="${p.id}"
        style="background:${p.header}"
        ${p.mode==='dark'?'data-dark=""':''}
        title="${p.name}"></button>`).join('')}
    </div>
  </div>

  <!-- HEADER COLOR -->
  <div class="bft-picker-section">
    <div class="bft-picker-label">Header Color</div>
    <div class="bft-picker-colors" id="bft-hrow">
      ${THEME_COLORS.map(c => `<button
        class="bft-color-swatch${t.header===c.hex?' active':''}"
        data-target="header" data-hex="${c.hex}"
        style="background:${c.hex}"
        title="${c.name}"></button>`).join('')}
      <input type="color" class="bft-color-custom" data-target="header" value="${t.header}" title="Custom">
    </div>
  </div>

  <!-- ACCENT COLOR -->
  <div class="bft-picker-section">
    <div class="bft-picker-label">Accent Color</div>
    <div class="bft-picker-colors" id="bft-arow">
      ${THEME_COLORS.map(c => `<button
        class="bft-color-swatch${t.accent===c.hex?' active':''}"
        data-target="accent" data-hex="${c.hex}"
        style="background:${c.hex}"
        title="${c.name}"></button>`).join('')}
      <input type="color" class="bft-color-custom" data-target="accent" value="${t.accent}" title="Custom">
    </div>
  </div>

  <!-- THEME NAME -->
  <div class="bft-picker-section">
    <div class="bft-picker-label">Theme Name</div>
    <input class="bft-picker-name" placeholder="My Theme" value="${(t.name||'').replace(/"/g,'&quot;')}">
  </div>

  <!-- TOGGLES -->
  <div class="bft-picker-row">
    <label><input type="checkbox" class="bft-toggle-dark"${t.mode==='dark'?' checked':''}> Dark mode</label>
    <label><input type="checkbox" class="bft-toggle-contrast"${t.contrast?' checked':''}> High contrast</label>
  </div>

  <!-- TEXT SIZE -->
  <div class="bft-picker-row">
    <span style="font-size:13px;color:#64748b">Text:</span>
    <button class="bft-size-btn${t.textSize==='S'?' active':''}" data-size="S">S</button>
    <button class="bft-size-btn${t.textSize==='M'?' active':''}" data-size="M">M</button>
    <button class="bft-size-btn${t.textSize==='L'?' active':''}" data-size="L">L</button>
  </div>

  <!-- LIVE PREVIEW -->
  <div class="bft-picker-preview">
    <div class="bft-preview-header"
      style="background:${t.header};color:${bestTextOn(t.header)}">${t.name||'Preview'}</div>
    <div class="bft-preview-body"
      style="background:${softTint(t.accent)};color:#1E293B">Accent tint · sample text at scale ${t.textSize}</div>
  </div>

  <!-- RESET -->
  <button class="bft-picker-reset">↺ Reset this scope to default</button>

</div>`;

    // Wire events
    const picker = el.querySelector('.bft-picker');

    // SCOPE TABS
    picker.querySelectorAll('.bft-picker-tab').forEach(btn =>
      btn.addEventListener('click', () => { _activeScope = btn.dataset.s; _buildPicker(el); })
    );

    // PRESETS
    picker.querySelectorAll('.bft-preset-swatch').forEach(btn =>
      btn.addEventListener('click', () => {
        const p = THEME_PRESETS.find(x => x.id === btn.dataset.p);
        if (p) _save(scope, { preset: p.id, header: p.header, accent: p.accent, mode: p.mode, name: p.name });
      })
    );

    // COLOR SWATCHES
    picker.querySelectorAll('.bft-color-swatch').forEach(btn =>
      btn.addEventListener('click', () => _save(scope, { [btn.dataset.target]: btn.dataset.hex, preset: 'custom' }))
    );

    // CUSTOM COLOR INPUTS
    picker.querySelectorAll('.bft-color-custom').forEach(inp =>
      inp.addEventListener('input', () => _save(scope, { [inp.dataset.target]: inp.value, preset: 'custom' }))
    );

    // NAME INPUT
    const nameEl = picker.querySelector('.bft-picker-name');
    let nameTimer;
    nameEl.addEventListener('input', () => {
      clearTimeout(nameTimer);
      nameTimer = setTimeout(() => _save(scope, { name: nameEl.value }), 400);
    });

    // DARK TOGGLE
    picker.querySelector('.bft-toggle-dark').addEventListener('change', e =>
      _save(scope, { mode: e.target.checked ? 'dark' : 'light' })
    );

    // CONTRAST TOGGLE
    picker.querySelector('.bft-toggle-contrast').addEventListener('change', e =>
      _save(scope, { contrast: e.target.checked })
    );

    // SIZE BUTTONS
    picker.querySelectorAll('.bft-size-btn').forEach(btn =>
      btn.addEventListener('click', () => _save(scope, { textSize: btn.dataset.size }))
    );

    // RESET
    picker.querySelector('.bft-picker-reset').addEventListener('click', () => _clear(scope));
  }

  function _refreshPicker() {
    if (_pickerEl) _buildPicker(_pickerEl);
  }

  function _renderPicker(el) {
    _injectPickerCSS();
    _pickerEl = el;
    _buildPicker(el);
  }

  // BOOT
  _loadCache();

  w.BFT_THEME = {
    THEME_COLORS,
    THEME_PRESETS,
    softTint,
    bestTextOn,
    init(appId)      { _appId = appId; _apply(); },
    setClass(classId){ _classId = classId; _apply(); },
    resolve:         _resolve,
    apply:           _apply,
    save:            _save,
    clear:           _clear,
    syncFromProfile: _syncFromProfile,
    syncToProfile:   _syncToProfile,
    renderPicker:    _renderPicker
  };
})(window);
