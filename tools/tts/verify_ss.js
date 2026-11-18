/* Verification for pages that call speechSynthesis.speak themselves (yuwen readers): presses the page's read buttons
   and reports which recordings <audio>.play() was asked to play (vs. utterances that fell back to the browser voice). */
(() => {
  window.__vlog = [];
  const played = [], native = [];
  const p0 = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function(){ played.push(this.src.split('/').slice(-2).join('/') + ' @' + this.playbackRate.toFixed(2)); return p0.apply(this, arguments); };
  const btns = [...document.querySelectorAll('button')].filter(b => b.getClientRects().length && !b.closest('#lab-nav,.lab-nav') && /🔊|朗读|读/.test(b.textContent));
  for (const b of btns.slice(0, 6)) { try { b.click(); } catch(e){} }
  window.__vlog.push('pressed ' + Math.min(6, btns.length) + ' read buttons; recordings started: ' + played.length);
  played.slice(0, 4).forEach(s => window.__vlog.push('  ' + s));
  return window.__vlog.join(' | ');
})()
