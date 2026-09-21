/* ===========================================================
   BFT-ASSETS.JS - BullFrogBuddy mascot + pond asset pack
   The Pond design system. No config or keys live here;
   load bft-config.js separately for those.


   USE IT:  <script src="bft-assets.js"></script>
            <svg class="bft bft-idle"><use href="#buddy-happy"/></svg>
   =========================================================== */
(function (w, d) {
  'use strict';


  /* GUARD DOUBLE INJECT */
  if (w.BFT && w.BFT.ready) { return; }


  /* STYLES BLOCK */
  var CSS = `/* THE POND TOKENS */
:root{
  --bft-green:#2d5f2e; --bft-dark:#1a3d1b; --bft-accent:#a4d65e;
  --bft-ink:#1a3d1b;  --bft-white:#ffffff; --bft-mist:#f0f9f0;
  --bft-blue:#3b82f6; --bft-red:#ef4444;
  --bft-bronze:#b87333; --bft-bronze-dark:#8c5523;
  --bft-silver:#c0c6cc; --bft-silver-dark:#8d959c;
  --bft-gold:#e3b23c;   --bft-gold-dark:#b08726;
}
/* DARK BACKGROUND FLIP */
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --bft-green:#a4d65e; --bft-dark:#7cb342; --bft-accent:#f0f9f0;
    --bft-ink:#1a3d1b;  --bft-mist:#1a3d1b;
  }
}
:root[data-theme="dark"], .bft-on-dark{
  --bft-green:#a4d65e; --bft-dark:#7cb342; --bft-accent:#f0f9f0;
  --bft-ink:#1a3d1b;  --bft-mist:#1a3d1b;
}
/* BASE SIZING */
.bft{width:96px;height:96px;display:inline-block;vertical-align:middle;overflow:visible}
.bft-sm{width:48px;height:48px}
.bft-lg{width:160px;height:160px}
.bft-xl{width:240px;height:240px}
/* TAP TARGET */
.bft-tap{min-width:44px;min-height:44px;background:none;border:0;padding:8px;
  cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
.bft-tap:focus-visible{outline:3px solid var(--bft-blue);outline-offset:3px;border-radius:12px}
/* MOTION CLASSES */
.bft-idle{animation:bft-bounce 2.6s ease-in-out infinite}
.bft-jump{animation:bft-jump .7s cubic-bezier(.3,1.4,.5,1)}
.bft-wobble,.bft-tap:active .bft{animation:bft-wobble .5s ease-in-out}
.bft-float-slow{animation:bft-drift 6s ease-in-out infinite}
/* KEYFRAMES */
@keyframes bft-bounce{0%,100%{transform:translateY(0) scaleY(1)}
  45%{transform:translateY(-7px) scaleY(1.03)}
  70%{transform:translateY(0) scaleY(.97)}}
@keyframes bft-jump{0%{transform:translateY(0) scaleY(.88)}
  30%{transform:translateY(-38px) scaleY(1.1)}
  60%{transform:translateY(0) scaleY(.9)}
  100%{transform:translateY(0) scaleY(1)}}
@keyframes bft-wobble{0%,100%{transform:rotate(0)}
  20%{transform:rotate(-9deg)}55%{transform:rotate(7deg)}80%{transform:rotate(-3deg)}}
@keyframes bft-blink{0%,92%,100%{transform:scaleY(0)}95%,97%{transform:scaleY(1)}}
@keyframes bft-tongue{0%,84%,100%{transform:scaleY(0)}88%,93%{transform:scaleY(1)}}
@keyframes bft-wave{0%,100%{transform:rotate(0)}25%{transform:rotate(-22deg)}
  60%{transform:rotate(14deg)}}
@keyframes bft-zzz{0%{opacity:0;transform:translateY(6px)}
  35%{opacity:1}100%{opacity:0;transform:translateY(-10px)}}
@keyframes bft-confetti{0%{opacity:0;transform:translateY(14px) rotate(0)}
  25%{opacity:1}100%{opacity:0;transform:translateY(-16px) rotate(160deg)}}
@keyframes bft-ripple{0%{transform:scale(.3);opacity:1}100%{transform:scale(2.6);opacity:0}}
@keyframes bft-float{0%{transform:translateY(0);opacity:0}
  15%{opacity:.9}100%{transform:translateY(-92px);opacity:0}}
@keyframes bft-flutter{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.35)}}
@keyframes bft-drift{0%,100%{transform:translate(0,0)}
  50%{transform:translate(8px,-10px)}}
/* REDUCED MOTION */
@media (prefers-reduced-motion: reduce){
  .bft,.bft *,.bft-idle,.bft-jump,.bft-wobble{animation:none !important}
}`;


  /* SPRITE MARKUP */
  var SPRITE = `<svg id="bft-sprite" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden;">


<!-- BUDDY HAPPY -->
<symbol id="buddy-happy" viewBox="0 0 120 120"><ellipse cx="24" cy="97" rx="17" ry="8" fill="var(--bft-dark,#1a3d1b)"/><ellipse cx="96" cy="97" rx="17" ry="8" fill="var(--bft-dark,#1a3d1b)"/><g transform="rotate(18 20 72)"><ellipse cx="20" cy="72" rx="8.5" ry="15" fill="var(--bft-green,#2d5f2e)"/><circle cx="20" cy="86" r="7" fill="var(--bft-accent,#a4d65e)"/></g><g transform="rotate(-18 100 72)"><ellipse cx="100" cy="72" rx="8.5" ry="15" fill="var(--bft-green,#2d5f2e)"/><circle cx="100" cy="86" r="7" fill="var(--bft-accent,#a4d65e)"/></g><ellipse cx="60" cy="68" rx="40" ry="34" fill="var(--bft-green,#2d5f2e)"/><ellipse cx="60" cy="79" rx="26" ry="21" fill="var(--bft-accent,#a4d65e)"/><circle cx="38" cy="33" r="18" fill="var(--bft-green,#2d5f2e)"/><circle cx="82" cy="33" r="18" fill="var(--bft-green,#2d5f2e)"/><circle cx="38" cy="31" r="11.5" fill="var(--bft-white,#ffffff)"/><circle cx="82" cy="31" r="11.5" fill="var(--bft-white,#ffffff)"/><circle cx="38" cy="33" r="5.8" fill="var(--bft-ink,#1a3d1b)"/><circle cx="82" cy="33" r="5.8" fill="var(--bft-ink,#1a3d1b)"/><circle cx="35.5" cy="30" r="2" fill="var(--bft-white,#ffffff)"/><circle cx="79.5" cy="30" r="2" fill="var(--bft-white,#ffffff)"/><circle cx="38" cy="31" r="12" fill="var(--bft-green,#2d5f2e)" style="transform-box:fill-box;transform-origin:50% 0;animation:bft-blink 5.4s 0s infinite;"/><circle cx="82" cy="31" r="12" fill="var(--bft-green,#2d5f2e)" style="transform-box:fill-box;transform-origin:50% 0;animation:bft-blink 5.4s 0s infinite;"/><ellipse cx="26" cy="56" rx="7" ry="5" fill="var(--bft-accent,#a4d65e)" opacity=".55"/><ellipse cx="94" cy="56" rx="7" ry="5" fill="var(--bft-accent,#a4d65e)" opacity=".55"/><path d="M42 60 q18 16 36 0" fill="none" stroke="var(--bft-ink,#1a3d1b)" stroke-width="4" stroke-linecap="round"/><g style="transform-box:fill-box;transform-origin:50% 0;animation:bft-tongue 6.5s infinite;"><path d="M55 64 h10 v20 a5 5 0 0 1 -10 0 z" fill="var(--bft-red,#ef4444)"/><path d="M58 64 h4 v18" fill="none" stroke="var(--bft-dark,#1a3d1b)" stroke-width="1.5" opacity=".3"/></g></symbol>


<!-- BUDDY CHEERING -->
<symbol id="buddy-cheering" viewBox="0 0 120 120"><ellipse cx="24" cy="97" rx="17" ry="8" fill="var(--bft-dark,#1a3d1b)"/><ellipse cx="96" cy="97" rx="17" ry="8" fill="var(--bft-dark,#1a3d1b)"/><g transform="rotate(40 16 52)"><ellipse cx="16" cy="52" rx="8.5" ry="15" fill="var(--bft-green,#2d5f2e)"/><circle cx="16" cy="66" r="7" fill="var(--bft-accent,#a4d65e)"/></g><g transform="rotate(-40 104 52)"><ellipse cx="104" cy="52" rx="8.5" ry="15" fill="var(--bft-green,#2d5f2e)"/><circle cx="104" cy="66" r="7" fill="var(--bft-accent,#a4d65e)"/></g><ellipse cx="60" cy="68" rx="40" ry="34" fill="var(--bft-green,#2d5f2e)"/><ellipse cx="60" cy="79" rx="26" ry="21" fill="var(--bft-accent,#a4d65e)"/><circle cx="38" cy="33" r="18" fill="var(--bft-green,#2d5f2e)"/><circle cx="82" cy="33" r="18" fill="var(--bft-green,#2d5f2e)"/><circle cx="38" cy="31" r="11.5" fill="var(--bft-white,#ffffff)"/><circle cx="82" cy="31" r="11.5" fill="var(--bft-white,#ffffff)"/><circle cx="38" cy="32" r="5.8" fill="var(--bft-ink,#1a3d1b)"/><circle cx="82" cy="32" r="5.8" fill="var(--bft-ink,#1a3d1b)"/><circle cx="35.5" cy="29" r="2" fill="var(--bft-white,#ffffff)"/><circle cx="79.5" cy="29" r="2" fill="var(--bft-white,#ffffff)"/><circle cx="38" cy="31" r="12" fill="var(--bft-green,#2d5f2e)" style="transform-box:fill-box;transform-origin:50% 0;animation:bft-blink 5.4s 0s infinite;"/><circle cx="82" cy="31" r="12" fill="var(--bft-green,#2d5f2e)" style="transform-box:fill-box;transform-origin:50% 0;animation:bft-blink 5.4s 0s infinite;"/><ellipse cx="26" cy="56" rx="7" ry="5" fill="var(--bft-accent,#a4d65e)" opacity=".55"/><ellipse cx="94" cy="56" rx="7" ry="5" fill="var(--bft-accent,#a4d65e)" opacity=".55"/><path d="M40 58 q20 26 40 0 q-20 6 -40 0 z" fill="var(--bft-ink,#1a3d1b)"/><path d="M54 69 q6 9 12 0 q-6 -3 -12 0 z" fill="var(--bft-red,#ef4444)"/><path d="M12 22 l4 8 8 4 -8 4 -4 8 -4 -8 -8 -4 8 -4 z" fill="var(--bft-accent,#a4d65e)"/><path d="M108 22 l4 8 8 4 -8 4 -4 8 -4 -8 -8 -4 8 -4 z" fill="var(--bft-accent,#a4d65e)"/></symbol>


<!-- BUDDY THINKING -->
<symbol id="buddy-thinking" viewBox="0 0 120 120"><ellipse cx="24" cy="97" rx="17" ry="8" fill="var(--bft-dark,#1a3d1b)"/><ellipse cx="96" cy="97" rx="17" ry="8" fill="var(--bft-dark,#1a3d1b)"/><g transform="rotate(14 18 74)"><ellipse cx="18" cy="74" rx="8.5" ry="15" fill="var(--bft-green,#2d5f2e)"/><circle cx="18" cy="88" r="7" fill="var(--bft-accent,#a4d65e)"/></g><ellipse cx="60" cy="68" rx="40" ry="34" fill="var(--bft-green,#2d5f2e)"/><ellipse cx="60" cy="79" rx="26" ry="21" fill="var(--bft-accent,#a4d65e)"/><circle cx="38" cy="33" r="18" fill="var(--bft-green,#2d5f2e)"/><circle cx="82" cy="33" r="18" fill="var(--bft-green,#2d5f2e)"/><circle cx="38" cy="31" r="11.5" fill="var(--bft-white,#ffffff)"/><circle cx="82" cy="31" r="11.5" fill="var(--bft-white,#ffffff)"/><circle cx="35" cy="29" r="5.8" fill="var(--bft-ink,#1a3d1b)"/><circle cx="79" cy="29" r="5.8" fill="var(--bft-ink,#1a3d1b)"/><circle cx="32.5" cy="26" r="2" fill="var(--bft-white,#ffffff)"/><circle cx="76.5" cy="26" r="2" fill="var(--bft-white,#ffffff)"/><circle cx="38" cy="31" r="12" fill="var(--bft-green,#2d5f2e)" style="transform-box:fill-box;transform-origin:50% 0;animation:bft-blink 5.4s 0s infinite;"/><circle cx="82" cy="31" r="12" fill="var(--bft-green,#2d5f2e)" style="transform-box:fill-box;transform-origin:50% 0;animation:bft-blink 5.4s 0s infinite;"/><path d="M48 64 q12 3 24 -2" fill="none" stroke="var(--bft-ink,#1a3d1b)" stroke-width="4" stroke-linecap="round"/><ellipse cx="86" cy="76" rx="8.5" ry="15" transform="rotate(-58 86 76)" fill="var(--bft-green,#2d5f2e)"/><circle cx="73" cy="66" r="7.5" fill="var(--bft-accent,#a4d65e)"/><circle cx="100" cy="20" r="4" fill="var(--bft-mist,#f0f9f0)" stroke="var(--bft-green,#2d5f2e)" stroke-width="1.5"/><circle cx="108" cy="11" r="6" fill="var(--bft-mist,#f0f9f0)" stroke="var(--bft-green,#2d5f2e)" stroke-width="1.5"/></symbol>


<!-- BUDDY SLEEPING -->
<symbol id="buddy-sleeping" viewBox="0 0 120 120"><ellipse cx="24" cy="99" rx="17" ry="8" fill="var(--bft-dark,#1a3d1b)"/><ellipse cx="96" cy="99" rx="17" ry="8" fill="var(--bft-dark,#1a3d1b)"/><g transform="rotate(22 20 78)"><ellipse cx="20" cy="78" rx="8.5" ry="15" fill="var(--bft-green,#2d5f2e)"/><circle cx="20" cy="92" r="7" fill="var(--bft-accent,#a4d65e)"/></g><g transform="rotate(-22 100 78)"><ellipse cx="100" cy="78" rx="8.5" ry="15" fill="var(--bft-green,#2d5f2e)"/><circle cx="100" cy="92" r="7" fill="var(--bft-accent,#a4d65e)"/></g><ellipse cx="60" cy="68" rx="40" ry="34" fill="var(--bft-green,#2d5f2e)"/><ellipse cx="60" cy="79" rx="26" ry="21" fill="var(--bft-accent,#a4d65e)"/><circle cx="38" cy="33" r="18" fill="var(--bft-green,#2d5f2e)"/><circle cx="82" cy="33" r="18" fill="var(--bft-green,#2d5f2e)"/><path d="M29 33 q9 8 18 0" fill="none" stroke="var(--bft-ink,#1a3d1b)" stroke-width="3.5" stroke-linecap="round"/><path d="M73 33 q9 8 18 0" fill="none" stroke="var(--bft-ink,#1a3d1b)" stroke-width="3.5" stroke-linecap="round"/><ellipse cx="60" cy="64" rx="7" ry="8" fill="var(--bft-ink,#1a3d1b)"/><path d="M96 30 h14 l-14 14 h14" fill="none" stroke="var(--bft-green,#2d5f2e)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="animation:bft-zzz 3s infinite;"/><path d="M100 8 h9 l-9 9 h9" fill="none" stroke="var(--bft-accent,#a4d65e)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation:bft-zzz 3s .6s infinite;"/></symbol>


<!-- BUDDY CELEBRATING -->
<symbol id="buddy-celebrating" viewBox="0 0 120 120"><rect x="10" y="14" width="7" height="10" rx="2" fill="var(--bft-blue,#3b82f6)" transform="rotate(-20 13 19)" style="animation:bft-confetti 2.4s 0.00s infinite;"/><rect x="30" y="6" width="7" height="10" rx="2" fill="var(--bft-accent,#a4d65e)" transform="rotate(35 33 11)" style="animation:bft-confetti 2.4s 0.22s infinite;"/><rect x="58" y="4" width="7" height="10" rx="2" fill="var(--bft-red,#ef4444)" transform="rotate(10 61 9)" style="animation:bft-confetti 2.4s 0.44s infinite;"/><rect x="88" y="8" width="7" height="10" rx="2" fill="var(--bft-blue,#3b82f6)" transform="rotate(-45 91 13)" style="animation:bft-confetti 2.4s 0.66s infinite;"/><rect x="110" y="16" width="7" height="10" rx="2" fill="var(--bft-accent,#a4d65e)" transform="rotate(25 113 21)" style="animation:bft-confetti 2.4s 0.88s infinite;"/><rect x="6" y="40" width="7" height="10" rx="2" fill="var(--bft-red,#ef4444)" transform="rotate(60 9 45)" style="animation:bft-confetti 2.4s 1.10s infinite;"/><rect x="114" y="42" width="7" height="10" rx="2" fill="var(--bft-accent,#a4d65e)" transform="rotate(-30 117 47)" style="animation:bft-confetti 2.4s 1.32s infinite;"/><ellipse cx="24" cy="97" rx="17" ry="8" fill="var(--bft-dark,#1a3d1b)"/><ellipse cx="96" cy="97" rx="17" ry="8" fill="var(--bft-dark,#1a3d1b)"/><g transform="rotate(48 14 48)"><ellipse cx="14" cy="48" rx="8.5" ry="15" fill="var(--bft-green,#2d5f2e)"/><circle cx="14" cy="62" r="7" fill="var(--bft-accent,#a4d65e)"/></g><g transform="rotate(-48 106 48)"><ellipse cx="106" cy="48" rx="8.5" ry="15" fill="var(--bft-green,#2d5f2e)"/><circle cx="106" cy="62" r="7" fill="var(--bft-accent,#a4d65e)"/></g><ellipse cx="60" cy="68" rx="40" ry="34" fill="var(--bft-green,#2d5f2e)"/><ellipse cx="60" cy="79" rx="26" ry="21" fill="var(--bft-accent,#a4d65e)"/><circle cx="38" cy="33" r="18" fill="var(--bft-green,#2d5f2e)"/><circle cx="82" cy="33" r="18" fill="var(--bft-green,#2d5f2e)"/><circle cx="38" cy="31" r="11.5" fill="var(--bft-white,#ffffff)"/><circle cx="82" cy="31" r="11.5" fill="var(--bft-white,#ffffff)"/><circle cx="38" cy="32" r="5.8" fill="var(--bft-ink,#1a3d1b)"/><circle cx="82" cy="32" r="5.8" fill="var(--bft-ink,#1a3d1b)"/><circle cx="35.5" cy="29" r="2" fill="var(--bft-white,#ffffff)"/><circle cx="79.5" cy="29" r="2" fill="var(--bft-white,#ffffff)"/><circle cx="38" cy="31" r="12" fill="var(--bft-green,#2d5f2e)" style="transform-box:fill-box;transform-origin:50% 0;animation:bft-blink 5.4s 0s infinite;"/><circle cx="82" cy="31" r="12" fill="var(--bft-green,#2d5f2e)" style="transform-box:fill-box;transform-origin:50% 0;animation:bft-blink 5.4s 0s infinite;"/><ellipse cx="26" cy="56" rx="7" ry="5" fill="var(--bft-accent,#a4d65e)" opacity=".55"/><ellipse cx="94" cy="56" rx="7" ry="5" fill="var(--bft-accent,#a4d65e)" opacity=".55"/><path d="M40 58 q20 26 40 0 q-20 6 -40 0 z" fill="var(--bft-ink,#1a3d1b)"/><path d="M54 69 q6 9 12 0 q-6 -3 -12 0 z" fill="var(--bft-red,#ef4444)"/></symbol>


<!-- BUDDY POINTING -->
<symbol id="buddy-pointing" viewBox="0 0 120 120"><ellipse cx="24" cy="97" rx="17" ry="8" fill="var(--bft-dark,#1a3d1b)"/><ellipse cx="96" cy="97" rx="17" ry="8" fill="var(--bft-dark,#1a3d1b)"/><g transform="rotate(16 20 74)"><ellipse cx="20" cy="74" rx="8.5" ry="15" fill="var(--bft-green,#2d5f2e)"/><circle cx="20" cy="88" r="7" fill="var(--bft-accent,#a4d65e)"/></g><ellipse cx="60" cy="68" rx="40" ry="34" fill="var(--bft-green,#2d5f2e)"/><ellipse cx="60" cy="79" rx="26" ry="21" fill="var(--bft-accent,#a4d65e)"/><circle cx="38" cy="33" r="18" fill="var(--bft-green,#2d5f2e)"/><circle cx="82" cy="33" r="18" fill="var(--bft-green,#2d5f2e)"/><circle cx="38" cy="31" r="11.5" fill="var(--bft-white,#ffffff)"/><circle cx="82" cy="31" r="11.5" fill="var(--bft-white,#ffffff)"/><circle cx="42" cy="33" r="5.8" fill="var(--bft-ink,#1a3d1b)"/><circle cx="86" cy="33" r="5.8" fill="var(--bft-ink,#1a3d1b)"/><circle cx="39.5" cy="30" r="2" fill="var(--bft-white,#ffffff)"/><circle cx="83.5" cy="30" r="2" fill="var(--bft-white,#ffffff)"/><circle cx="38" cy="31" r="12" fill="var(--bft-green,#2d5f2e)" style="transform-box:fill-box;transform-origin:50% 0;animation:bft-blink 5.4s 0s infinite;"/><circle cx="82" cy="31" r="12" fill="var(--bft-green,#2d5f2e)" style="transform-box:fill-box;transform-origin:50% 0;animation:bft-blink 5.4s 0s infinite;"/><ellipse cx="26" cy="56" rx="7" ry="5" fill="var(--bft-accent,#a4d65e)" opacity=".55"/><ellipse cx="94" cy="56" rx="7" ry="5" fill="var(--bft-accent,#a4d65e)" opacity=".55"/><path d="M50 62 q10 8 20 0" fill="none" stroke="var(--bft-ink,#1a3d1b)" stroke-width="4" stroke-linecap="round"/><g transform="rotate(-78 100 68)"><ellipse cx="100" cy="68" rx="8.5" ry="16" fill="var(--bft-green,#2d5f2e)"/><circle cx="100" cy="83" r="7" fill="var(--bft-accent,#a4d65e)"/><rect x="97" y="86" width="6" height="12" rx="3" fill="var(--bft-accent,#a4d65e)"/></g></symbol>


<!-- BUDDY WAVING -->
<symbol id="buddy-waving" viewBox="0 0 120 120"><ellipse cx="24" cy="97" rx="17" ry="8" fill="var(--bft-dark,#1a3d1b)"/><ellipse cx="96" cy="97" rx="17" ry="8" fill="var(--bft-dark,#1a3d1b)"/><g transform="rotate(16 20 74)"><ellipse cx="20" cy="74" rx="8.5" ry="15" fill="var(--bft-green,#2d5f2e)"/><circle cx="20" cy="88" r="7" fill="var(--bft-accent,#a4d65e)"/></g><ellipse cx="60" cy="68" rx="40" ry="34" fill="var(--bft-green,#2d5f2e)"/><ellipse cx="60" cy="79" rx="26" ry="21" fill="var(--bft-accent,#a4d65e)"/><circle cx="38" cy="33" r="18" fill="var(--bft-green,#2d5f2e)"/><circle cx="82" cy="33" r="18" fill="var(--bft-green,#2d5f2e)"/><circle cx="38" cy="31" r="11.5" fill="var(--bft-white,#ffffff)"/><circle cx="82" cy="31" r="11.5" fill="var(--bft-white,#ffffff)"/><circle cx="38" cy="33" r="5.8" fill="var(--bft-ink,#1a3d1b)"/><circle cx="82" cy="33" r="5.8" fill="var(--bft-ink,#1a3d1b)"/><circle cx="35.5" cy="30" r="2" fill="var(--bft-white,#ffffff)"/><circle cx="79.5" cy="30" r="2" fill="var(--bft-white,#ffffff)"/><circle cx="38" cy="31" r="12" fill="var(--bft-green,#2d5f2e)" style="transform-box:fill-box;transform-origin:50% 0;animation:bft-blink 5.4s 0s infinite;"/><circle cx="82" cy="31" r="12" fill="var(--bft-green,#2d5f2e)" style="transform-box:fill-box;transform-origin:50% 0;animation:bft-blink 5.4s 0s infinite;"/><ellipse cx="26" cy="56" rx="7" ry="5" fill="var(--bft-accent,#a4d65e)" opacity=".55"/><ellipse cx="94" cy="56" rx="7" ry="5" fill="var(--bft-accent,#a4d65e)" opacity=".55"/><path d="M42 60 q18 16 36 0" fill="none" stroke="var(--bft-ink,#1a3d1b)" stroke-width="4" stroke-linecap="round"/><g style="transform-box:fill-box;transform-origin:50% 92%;animation:bft-wave 1.8s ease-in-out infinite;"><g transform="rotate(-34 104 50)"><ellipse cx="104" cy="50" rx="8.5" ry="15" fill="var(--bft-green,#2d5f2e)"/><circle cx="104" cy="64" r="7" fill="var(--bft-accent,#a4d65e)"/></g></g></symbol>


<!-- LILY PAD -->
<symbol id="bft-lilypad" viewBox="0 0 120 90"><path d="M60 48 L78 18 A34 34 0 1 0 42 18 Z" transform="translate(0 4)" fill="var(--bft-green,#2d5f2e)"/><path d="M60 48 L78 18 A34 34 0 1 0 42 18 Z" fill="var(--bft-accent,#a4d65e)"/><path d="M60 48 L22 30" stroke="var(--bft-green,#2d5f2e)" stroke-width="2.5" stroke-linecap="round" opacity=".55"/><path d="M60 48 L98 30" stroke="var(--bft-green,#2d5f2e)" stroke-width="2.5" stroke-linecap="round" opacity=".55"/><path d="M60 48 L26 68" stroke="var(--bft-green,#2d5f2e)" stroke-width="2.5" stroke-linecap="round" opacity=".55"/><path d="M60 48 L94 68" stroke="var(--bft-green,#2d5f2e)" stroke-width="2.5" stroke-linecap="round" opacity=".55"/><path d="M60 48 L60 82" stroke="var(--bft-green,#2d5f2e)" stroke-width="2.5" stroke-linecap="round" opacity=".55"/></symbol>


<!-- POND RIPPLE -->
<symbol id="bft-ripple" viewBox="0 0 120 60"><ellipse cx="60" cy="30" rx="16" ry="7" fill="none" stroke="var(--bft-blue,#3b82f6)" stroke-width="3" style="transform-box:fill-box;transform-origin:50% 50%;animation:bft-ripple 2.7s 0s infinite;"/><ellipse cx="60" cy="30" rx="16" ry="7" fill="none" stroke="var(--bft-blue,#3b82f6)" stroke-width="3" style="transform-box:fill-box;transform-origin:50% 50%;animation:bft-ripple 2.7s 0.9s infinite;"/><ellipse cx="60" cy="30" rx="16" ry="7" fill="none" stroke="var(--bft-blue,#3b82f6)" stroke-width="3" style="transform-box:fill-box;transform-origin:50% 50%;animation:bft-ripple 2.7s 1.8s infinite;"/></symbol>


<!-- WATER WAVES -->
<symbol id="bft-waves" viewBox="0 0 240 40" preserveAspectRatio="none"><path d="M0 26 q30 -16 60 0 t60 0 t60 0 t60 0 v14 H0 z" fill="var(--bft-blue,#3b82f6)" opacity=".35"/><path d="M0 30 q30 -16 60 0 t60 0 t60 0 t60 0 v10 H0 z" fill="var(--bft-blue,#3b82f6)" opacity=".6"/><path d="M0 34 q30 -14 60 0 t60 0 t60 0 t60 0 v6 H0 z" fill="var(--bft-green,#2d5f2e)"/></symbol>


<!-- FLOATING BUBBLES -->
<symbol id="bft-bubbles" viewBox="0 0 60 120"><circle cx="18" cy="100" r="7" fill="none" stroke="var(--bft-blue,#3b82f6)" stroke-width="2" style="animation:bft-float 4.4s 0s infinite;"/><circle cx="36" cy="104" r="5" fill="none" stroke="var(--bft-blue,#3b82f6)" stroke-width="2" style="animation:bft-float 4.4s 0.7s infinite;"/><circle cx="26" cy="96" r="9" fill="none" stroke="var(--bft-blue,#3b82f6)" stroke-width="2" style="animation:bft-float 4.4s 1.4s infinite;"/><circle cx="42" cy="98" r="4" fill="none" stroke="var(--bft-blue,#3b82f6)" stroke-width="2" style="animation:bft-float 4.4s 2.1s infinite;"/><circle cx="14" cy="102" r="5" fill="none" stroke="var(--bft-blue,#3b82f6)" stroke-width="2" style="animation:bft-float 4.4s 2.8s infinite;"/></symbol>


<!-- DRAGONFLY -->
<symbol id="bft-dragonfly" viewBox="0 0 120 80"><g style="animation:bft-drift 5.5s ease-in-out infinite;"><g transform="rotate(-18 38 24)"><ellipse cx="38" cy="24" rx="22" ry="7.5" fill="var(--bft-blue,#3b82f6)" opacity=".55" style="transform-box:fill-box;transform-origin:100% 50%;animation:bft-flutter .36s 0s ease-in-out infinite;"/></g><g transform="rotate(18 82 24)"><ellipse cx="82" cy="24" rx="22" ry="7.5" fill="var(--bft-blue,#3b82f6)" opacity=".55" style="transform-box:fill-box;transform-origin:0% 50%;animation:bft-flutter .36s .04s ease-in-out infinite;"/></g><g transform="rotate(16 42 40)"><ellipse cx="42" cy="40" rx="18" ry="6" fill="var(--bft-accent,#a4d65e)" opacity=".6" style="transform-box:fill-box;transform-origin:100% 50%;animation:bft-flutter .36s .08s ease-in-out infinite;"/></g><g transform="rotate(-16 78 40)"><ellipse cx="78" cy="40" rx="18" ry="6" fill="var(--bft-accent,#a4d65e)" opacity=".6" style="transform-box:fill-box;transform-origin:0% 50%;animation:bft-flutter .36s .02s ease-in-out infinite;"/></g><rect x="56" y="24" width="8" height="46" rx="4" fill="var(--bft-green,#2d5f2e)"/><rect x="56" y="52" width="8" height="4" fill="var(--bft-dark,#1a3d1b)" opacity=".35"/><rect x="56" y="62" width="8" height="4" fill="var(--bft-dark,#1a3d1b)" opacity=".35"/><circle cx="60" cy="22" r="10" fill="var(--bft-dark,#1a3d1b)"/><circle cx="56" cy="20" r="3.2" fill="var(--bft-white,#ffffff)"/><circle cx="64" cy="20" r="3.2" fill="var(--bft-white,#ffffff)"/></g></symbol>


<!-- BADGE BRONZE -->
<symbol id="bft-badge-bronze" viewBox="0 0 120 120"><path d="M40 8 L52 56 L34 62 z" fill="var(--bft-green,#2d5f2e)"/><path d="M80 8 L68 56 L86 62 z" fill="var(--bft-accent,#a4d65e)"/><circle cx="60" cy="76" r="34" fill="var(--bft-bronze-dark,#8c5523)"/><circle cx="60" cy="73" r="34" fill="var(--bft-bronze,#b87333)"/><circle cx="60" cy="73" r="26" fill="none" stroke="var(--bft-bronze-dark,#8c5523)" stroke-width="3" opacity=".7"/><path d="M60 56 l5.5 11.5 12.5 1.8 -9 8.9 2.1 12.6 -11.1 -6 -11.1 6 2.1 -12.6 -9 -8.9 12.5 -1.8 z" fill="var(--bft-dark,#1a3d1b)" opacity=".85"/><text x="60" y="104" text-anchor="middle" font-family="Bricolage Grotesque, sans-serif" font-size="15" font-weight="700" fill="var(--bft-bronze-dark,#8c5523)">3</text></symbol>


<!-- BADGE SILVER -->
<symbol id="bft-badge-silver" viewBox="0 0 120 120"><path d="M40 8 L52 56 L34 62 z" fill="var(--bft-green,#2d5f2e)"/><path d="M80 8 L68 56 L86 62 z" fill="var(--bft-accent,#a4d65e)"/><circle cx="60" cy="76" r="34" fill="var(--bft-silver-dark,#8d959c)"/><circle cx="60" cy="73" r="34" fill="var(--bft-silver,#c0c6cc)"/><circle cx="60" cy="73" r="26" fill="none" stroke="var(--bft-silver-dark,#8d959c)" stroke-width="3" opacity=".7"/><path d="M60 56 l5.5 11.5 12.5 1.8 -9 8.9 2.1 12.6 -11.1 -6 -11.1 6 2.1 -12.6 -9 -8.9 12.5 -1.8 z" fill="var(--bft-dark,#1a3d1b)" opacity=".85"/><text x="60" y="104" text-anchor="middle" font-family="Bricolage Grotesque, sans-serif" font-size="15" font-weight="700" fill="var(--bft-silver-dark,#8d959c)">2</text></symbol>


<!-- BADGE GOLD -->
<symbol id="bft-badge-gold" viewBox="0 0 120 120"><path d="M40 8 L52 56 L34 62 z" fill="var(--bft-green,#2d5f2e)"/><path d="M80 8 L68 56 L86 62 z" fill="var(--bft-accent,#a4d65e)"/><circle cx="60" cy="76" r="34" fill="var(--bft-gold-dark,#b08726)"/><circle cx="60" cy="73" r="34" fill="var(--bft-gold,#e3b23c)"/><circle cx="60" cy="73" r="26" fill="none" stroke="var(--bft-gold-dark,#b08726)" stroke-width="3" opacity=".7"/><path d="M60 56 l5.5 11.5 12.5 1.8 -9 8.9 2.1 12.6 -11.1 -6 -11.1 6 2.1 -12.6 -9 -8.9 12.5 -1.8 z" fill="var(--bft-dark,#1a3d1b)" opacity=".85"/><text x="60" y="104" text-anchor="middle" font-family="Bricolage Grotesque, sans-serif" font-size="15" font-weight="700" fill="var(--bft-gold-dark,#b08726)">1</text></symbol>


</svg>`;


  /* INJECT INTO PAGE */
  function inject() {
    if (d.getElementById('bft-sprite')) { return; }
    var style = d.createElement('style');
    style.id = 'bft-style';
    style.textContent = CSS;
    d.head.appendChild(style);


    var holder = d.createElement('div');
    holder.innerHTML = SPRITE;
    d.body.insertBefore(holder.firstElementChild, d.body.firstChild);
    w.BFT.ready = true;
    d.dispatchEvent(new CustomEvent('bft:ready'));
  }


  /* PUBLIC HELPERS */
  w.BFT = {
    ready: false,


    /* NAMES LIST */
    names: ['buddy-happy', 'buddy-cheering', 'buddy-thinking', 'buddy-sleeping', 'buddy-celebrating', 'buddy-pointing', 'buddy-waving', 'bft-lilypad', 'bft-ripple', 'bft-waves', 'bft-bubbles', 'bft-dragonfly', 'bft-badge-bronze', 'bft-badge-silver', 'bft-badge-gold'],


    /* BUILD MARKUP STRING */
    svg: function (name, opts) {
      opts = opts || {};
      var cls = 'bft' + (opts.size ? ' bft-' + opts.size : '') +
                (opts.animate ? ' bft-' + opts.animate : '') +
                (opts.className ? ' ' + opts.className : '');
      var label = opts.label
        ? ' role="img" aria-label="' + String(opts.label).replace(/"/g, '&quot;') + '"'
        : ' aria-hidden="true"';
      return '<svg class="' + cls + '"' + label +
             '><use href="#' + name + '"/></svg>';
    },


    /* PLACE INTO ELEMENT */
    into: function (target, name, opts) {
      var el = typeof target === 'string' ? d.querySelector(target) : target;
      if (el) { el.innerHTML = w.BFT.svg(name, opts); }
      return el;
    },


    /* PLAY ONE-SHOT MOTION */
    play: function (target, motion) {
      var el = typeof target === 'string' ? d.querySelector(target) : target;
      if (!el) { return; }
      var cls = 'bft-' + (motion || 'jump');
      el.classList.remove(cls);
      void el.offsetWidth;
      el.classList.add(cls);
      el.addEventListener('animationend', function handler() {
        el.classList.remove(cls);
        el.removeEventListener('animationend', handler);
      });
    },


    /* WOBBLE ON TAP */
    wobble: function (target) { w.BFT.play(target, 'wobble'); }
  };


    /* BOOT */
  if (d.readyState === 'loading') {
    d.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

  /* RE-INJECT WATCH */
  setInterval(function () {
    if (d.body && !d.getElementById('bft-sprite')) { inject(); }
  }, 500);
})(window, document);
