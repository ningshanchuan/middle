/* Playback check for pages that do not load lab.js (own REC/recKey/speak copy, e.g. biology/cell-organelles):
   select the first organelle, click the page's own speak button, report which recording the <audio> element plays. */
(() => {
  window.__vlog = [];
  const log = s => window.__vlog.push(s);
  const op = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    const a = this; log('audio.play src=' + a.src.replace(/^.*\/audio\//, 'audio/'));
    a.addEventListener('playing', () => log('event: playing, duration ' + (a.duration || 0).toFixed(1) + ' s'), { once: true });
    setTimeout(() => log('t=' + a.currentTime.toFixed(1) + ' s paused=' + a.paused + (a.currentTime > 0.3 ? ' (audio is advancing)' : '')), 5000);
    return op.apply(this, arguments);
  };
  const ss = window.speechSynthesis; if (ss) { const s0 = ss.speak.bind(ss); ss.speak = u => { log('BROWSER VOICE used: ' + String(u.text).slice(0, 40)); s0(u); }; }
  if (typeof REC === 'undefined') return 'no REC';
  const L = App.lang === 'zh' ? 'zh' : 'en';
  if (!REC[L]) return 'manifest not loaded for ' + L;
  App.select('membrane');
  const b = document.querySelector('#speakBtn'); if (!b) return 'no speak button';
  b.click();
  const m = (window.__vlog.find(s => s.startsWith('audio.play')) || '').match(/audio\/(\w+)\/(\w{8})\.mp3/);
  return m ? 'recorded ' + m[2] + ' audio=true lang=' + m[1] : 'no recording played: ' + window.__vlog.join(' | ');
})()
