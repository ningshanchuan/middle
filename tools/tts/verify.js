/* Verification helper (run with shot.ps1 -Js): finds a read-aloud text on the page that has a recording, plays it through
   the page's own 🔊 button, and shows the result in a box on the screenshot. Returns a short status string. */
(() => {
  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:99999;background:#111;color:#0f0;font:14px monospace;padding:8px 10px;border-radius:8px;max-width:90vw;white-space:pre-wrap';
  document.body.appendChild(box);
  window.__vlog = [];
  const log = s => { box.textContent += s + '\n'; window.__vlog.push(s); };
  if (!window.Lab || !Lab.speak) { log('no Lab'); return 'no Lab'; }
  const r = Lab.recordings(Lab.lang);
  if (!r || r.state !== 'ready') { log('manifest not ready: ' + (r && r.state)); return 'manifest ' + (r && r.state); }
  const orig = Lab.speak; let last = null;
  Lab.speak = (t, o) => { const out = orig(t, o); last = { t, out, key: Lab.speechKey(String(t).replace(/<[^>]+>/g, ''), (o && o.lang) || Lab.lang) }; return out; };
  const speakers = () => [...document.querySelectorAll('.speak,[data-a=speak],#speakBtn,#specSpeak,#sciSpeak')].filter(b => b.getClientRects().length && !b.closest('#lab-nav,.lab-nav'));
  const cands = [...document.querySelectorAll('.chip,[data-k],[data-id],[data-key],[data-i],[data-b],.nav button')].filter(b => b.getClientRects().length && !b.closest('#lab-nav,.lab-nav,a[href]'));
  let found = null, tried = 0;
  const tryNow = () => { for (const s of speakers()){ tried++; s.click(); if (last && r.keys.has(last.key)) return last; } return null; };
  found = tryNow();
  for (let i = 0; !found && i < cands.length && i < 300; i++){ try { cands[i].click(); } catch(e){} found = tryNow(); }
  Lab.speak = orig;
  if (!found){ log('no recorded text reached (' + tried + ' speak presses); last key ' + (last && last.key) + ' -> fallback ' + (last && last.out && last.out.constructor.name)); return 'fallback-only ' + (last && last.out && last.out.constructor.name); }
  const a = found.out;
  const isAudio = a instanceof HTMLAudioElement; window.__va = a;
  log('recorded key ' + found.key + ' -> ' + (isAudio ? 'HTMLAudioElement' : String(a)) + ' rate=' + (isAudio ? a.playbackRate.toFixed(2) : '-') + ' src=' + (isAudio ? a.src.split('/').slice(-3).join('/') : '-'));
  if (isAudio){
    a.addEventListener('playing', () => log('event: playing, duration ' + (a.duration || 0).toFixed(1) + ' s'));
    a.addEventListener('timeupdate', function once(){ if (a.currentTime > 0.5){ log('event: timeupdate ' + a.currentTime.toFixed(1) + ' s (audio is advancing)'); a.removeEventListener('timeupdate', once); } });
    a.addEventListener('error', () => log('event: error ' + (a.error && a.error.code)));
  }
  return 'recorded ' + found.key + ' audio=' + isAudio + ' paused=' + (isAudio ? a.paused : '-') + ' rate=' + (isAudio ? a.playbackRate : '-');
})()
