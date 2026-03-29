
/* ══════════════════════════════════════════════════
   CURSOR
══════════════════════════════════════════════════ */
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cur.style.left = mx + 'px'; cur.style.top = my + 'px'; });
document.querySelectorAll('a, button, .skill-tag, .project-card, .stat-card-about, .cert-card, .quiz-opt, .footer-egg').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-grow'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-grow'));
});
(function loop() { rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(loop); })();

/* ══════════════════════════════════════════════════
   CLICK RIPPLE
══════════════════════════════════════════════════ */
document.addEventListener('click', e => {
  const r = document.createElement('div');
  r.className = 'ripple-burst';
  r.style.left = e.clientX + 'px';
  r.style.top = e.clientY + 'px';
  document.body.appendChild(r);
  r.addEventListener('animationend', () => r.remove());
});

/* ══════════════════════════════════════════════════
   SCROLL PROGRESS
══════════════════════════════════════════════════ */
const bar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  bar.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
});

/* ══════════════════════════════════════════════════
   PHOTO PARALLAX
══════════════════════════════════════════════════ */
const photoWrap = document.querySelector('.hero-photo-wrap');
if (photoWrap) {
  photoWrap.addEventListener('mousemove', e => {
    const r = photoWrap.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    photoWrap.querySelector('.photo-frame').style.transform = `perspective(800px) rotateY(${x*8}deg) rotateX(${-y*6}deg)`;
  });
  photoWrap.addEventListener('mouseleave', () => {
    photoWrap.querySelector('.photo-frame').style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
  });
}

/* ══════════════════════════════════════════════════
   PARTICLES
══════════════════════════════════════════════════ */
const wipeCanvas = document.getElementById('photo-wipe-layer');
const wipeHint = document.getElementById('photo-wipe-hint');
const fallbackIcon = document.getElementById('fallback-icon');
if (wipeCanvas && wipeHint && fallbackIcon && getComputedStyle(fallbackIcon).display === 'none') {
  const wipeCtx = wipeCanvas.getContext('2d');
  let wiping = false;
  let wipePoints = 0;
  let wipeDone = false;

  function paintFog() {
    const rect = wipeCanvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const ratio = window.devicePixelRatio || 1;
    wipeCanvas.width = Math.max(1, Math.floor(width * ratio));
    wipeCanvas.height = Math.max(1, Math.floor(height * ratio));
    wipeCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
    wipeCtx.clearRect(0, 0, width, height);

    const fog = wipeCtx.createLinearGradient(0, 0, width, height);
    fog.addColorStop(0, 'rgba(255,255,255,0.98)');
    fog.addColorStop(0.35, 'rgba(238,238,238,0.92)');
    fog.addColorStop(0.7, 'rgba(178,178,178,0.8)');
    fog.addColorStop(1, 'rgba(92,92,92,0.74)');
    wipeCtx.fillStyle = fog;
    wipeCtx.fillRect(0, 0, width, height);

    for (let i = 0; i < 28; i++) {
      const x = (i * 71 + (i % 3) * 23) % Math.max(width, 1);
      const y = (i * 53 + (i % 4) * 19) % Math.max(height, 1);
      const puff = wipeCtx.createRadialGradient(x, y, 10, x, y, 110);
      puff.addColorStop(0, 'rgba(255,255,255,0.22)');
      puff.addColorStop(1, 'rgba(255,255,255,0)');
      wipeCtx.fillStyle = puff;
      wipeCtx.beginPath();
      wipeCtx.arc(x, y, 110, 0, Math.PI * 2);
      wipeCtx.fill();
    }

    wipeCtx.fillStyle = 'rgba(255,255,255,0.16)';
    wipeCtx.fillRect(0, height * 0.65, width, height * 0.35);
    wipeCtx.fillStyle = 'rgba(255,255,255,0.1)';
    wipeCtx.fillRect(0, 0, width, height * 0.18);
  }

  function revealAt(clientX, clientY) {
    if (wipeDone) return;
    const rect = wipeCanvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    wipeCtx.globalCompositeOperation = 'destination-out';
    const wipeGlow = wipeCtx.createRadialGradient(x, y, 10, x, y, 52);
    wipeGlow.addColorStop(0, 'rgba(0,0,0,0.96)');
    wipeGlow.addColorStop(0.55, 'rgba(0,0,0,0.68)');
    wipeGlow.addColorStop(1, 'rgba(0,0,0,0)');
    wipeCtx.fillStyle = wipeGlow;
    wipeCtx.beginPath();
    wipeCtx.arc(x, y, 52, 0, Math.PI * 2);
    wipeCtx.fill();

    wipePoints++;
    if (wipePoints > 8) wipeHint.classList.add('fade');
    if (wipePoints > 46) {
      wipeDone = true;
      wipeCanvas.classList.add('done');
      wipeHint.classList.add('fade');
    }
  }

  paintFog();
  window.addEventListener('resize', paintFog);
  wipeCanvas.addEventListener('pointerdown', e => {
    wiping = true;
    if (wipeCanvas.setPointerCapture) wipeCanvas.setPointerCapture(e.pointerId);
    revealAt(e.clientX, e.clientY);
  });
  wipeCanvas.addEventListener('pointermove', e => {
    if (wiping) revealAt(e.clientX, e.clientY);
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(evt => {
    wipeCanvas.addEventListener(evt, () => { wiping = false; });
  });
}

const canvas = document.getElementById('particles'), ctx = canvas.getContext('2d');
let W, H, pts = [];
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize(); window.addEventListener('resize', resize);
class P {
  constructor() { this.x=Math.random()*W; this.y=Math.random()*H; this.r=Math.random()*2+.5; this.vx=(Math.random()-.5)*.4; this.vy=(Math.random()-.5)*.4; this.a=Math.random()*.5+.2; }
  step() { this.x+=this.vx; this.y+=this.vy; if(this.x<0||this.x>W)this.vx*=-1; if(this.y<0||this.y>H)this.vy*=-1; }
  draw() { ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fillStyle=`rgba(40,40,40,${this.a})`; ctx.fill(); }
}
for (let i = 0; i < 85; i++) pts.push(new P());
(function loop() {
  ctx.clearRect(0,0,W,H);
  pts.forEach(p => { p.step(); p.draw(); });
  for (let i=0;i<pts.length;i++) for (let j=i+1;j<pts.length;j++) {
    const d = Math.hypot(pts[i].x-pts[j].x, pts[i].y-pts[j].y);
    if (d < 140) { ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.strokeStyle=`rgba(40,40,40,${.12*(1-d/140)})`; ctx.lineWidth=.8; ctx.stroke(); }
  }
  requestAnimationFrame(loop);
})();

/* ══════════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════════ */
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => ro.observe(el));

/* ══════════════════════════════════════════════════
   COUNTERS
══════════════════════════════════════════════════ */
const co = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.done) {
      e.target.dataset.done = '1';
      const t = +e.target.dataset.target, d = 1600, s = performance.now();
      (function step(n) { const p = Math.min((n-s)/d,1), ease = 1-Math.pow(1-p,3); e.target.textContent = Math.round(ease*t); if (p<1) requestAnimationFrame(step); })(s);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(c => co.observe(c));

/* ══════════════════════════════════════════════════
   SKILL BARS
══════════════════════════════════════════════════ */
const bo = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) setTimeout(() => e.target.classList.add('anim'), 200); });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-bar-fill').forEach(b => bo.observe(b));

/* ══════════════════════════════════════════════════
   TYPING EFFECT
══════════════════════════════════════════════════ */
const roles = ['ML Engineer', 'Data Scientist', 'Problem Solver', 'Deep Learning Explorer'];
let ri = 0, ci = 0, del = false, tEl = document.getElementById('typed-text');
function typeLoop() {
  const w = roles[ri];
  if (!del) { tEl.textContent = w.slice(0,++ci); if(ci===w.length){del=true;setTimeout(typeLoop,1500);return;} }
  else { tEl.textContent = w.slice(0,--ci); if(ci===0){del=false;ri=(ri+1)%roles.length;} }
  setTimeout(typeLoop, del ? 55 : 100);
}
setTimeout(typeLoop, 1300);

/* ══════════════════════════════════════════════════
   PROJECT CARD TILT
══════════════════════════════════════════════════ */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    card.style.transform = `translateY(-10px) scale(1.02) rotateY(${x*10}deg) rotateX(${-y*8}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transition='transform 0.5s ease,box-shadow 0.35s'; card.style.transform=''; setTimeout(()=>card.style.transition='',500); });
  card.addEventListener('mouseenter', () => { card.style.transition='box-shadow 0.35s'; });
});

/* ══════════════════════════════════════════════════
   SKILL TAG TOOLTIPS
══════════════════════════════════════════════════ */
const tip = document.getElementById('fun-tip');
document.querySelectorAll('[data-tip]').forEach(el => {
  el.addEventListener('mouseenter', e => {
    tip.textContent = el.dataset.tip;
    tip.classList.add('show');
  });
  el.addEventListener('mousemove', e => {
    tip.style.left = (e.clientX - tip.offsetWidth/2) + 'px';
    tip.style.top  = (e.clientY - tip.offsetHeight - 16) + 'px';
  });
  el.addEventListener('mouseleave', () => tip.classList.remove('show'));
});

/* ══════════════════════════════════════════════════
   GLITCH NAME ON CLICK + CONFETTI
══════════════════════════════════════════════════ */
const heroName = document.getElementById('hero-name');
const msgs = ['👋 Hey there!', '🤖 Beep boop!', '🧠 ML time!', '✨ Thanks!', '🚀 To the moon!'];
let msgIdx = 0;
heroName.addEventListener('click', () => {
  heroName.classList.remove('glitch');
  void heroName.offsetWidth;
  heroName.classList.add('glitch');
  heroName.addEventListener('animationend', () => heroName.classList.remove('glitch'), { once: true });
  spawnConfetti(heroName.getBoundingClientRect());
});

function spawnConfetti(rect) {
  const colors = ['#111111','#3c3c3c','#707070','#a6a6a6','#d0d0d0','#f2f2f2'];
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  for (let i = 0; i < 22; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    c.style.cssText = `
      left:${cx + (Math.random()-0.5)*rect.width}px;
      top:${cy}px;
      background:${colors[i % colors.length]};
      transform:rotate(${Math.random()*360}deg);
      animation-delay:${Math.random()*0.3}s;
      animation-duration:${0.9+Math.random()*0.6}s;
    `;
    document.body.appendChild(c);
    c.addEventListener('animationend', () => c.remove());
  }
}

/* ══════════════════════════════════════════════════
   FOOTER EGG
══════════════════════════════════════════════════ */
document.getElementById('footer-egg').addEventListener('click', () => {
  spawnConfetti({ left: window.innerWidth/2 - 100, top: window.innerHeight/2, width: 200, height: 0 });
});

/* ══════════════════════════════════════════════════
   ML QUIZ
══════════════════════════════════════════════════ */
const quizData = [
  {
    q: "What does 'gradient descent' do in machine learning?",
    opts: ["Increases the loss function", "Minimizes the loss function by updating weights", "Shuffles training data randomly", "Removes outliers from the dataset"],
    ans: 1,
    exp: "Gradient descent iteratively adjusts model weights in the direction that minimizes the loss — like rolling downhill to find the valley! 🏔️"
  },
  {
    q: "Which of these is an example of supervised learning?",
    opts: ["K-Means Clustering", "PCA Dimensionality Reduction", "Email spam classification", "Autoencoders"],
    ans: 2,
    exp: "Spam classification uses labelled data (spam / not spam) to train a model — that's the hallmark of supervised learning! ✉️"
  },
  {
    q: "What problem does 'overfitting' describe?",
    opts: ["The model is too simple to learn the data", "The model learns training data too well and fails on new data", "The training data is insufficient", "The learning rate is too low"],
    ans: 1,
    exp: "An overfit model memorizes training data instead of learning general patterns — great scores in training, poor scores in the real world. 🎓"
  },
  {
    q: "In a neural network, what is the role of an 'activation function'?",
    opts: ["Initializes random weights", "Adds non-linearity so the network can learn complex patterns", "Reduces the size of the model", "Normalizes the input data"],
    ans: 1,
    exp: "Without activation functions, stacking layers would just be matrix multiplication — activation functions let networks model non-linear relationships! ⚡"
  },
  {
    q: "What does 'backpropagation' compute?",
    opts: ["The forward pass predictions", "Gradients of the loss with respect to each weight", "The number of layers needed", "Optimal batch size for training"],
    ans: 1,
    exp: "Backprop uses the chain rule to calculate how much each weight contributed to the error, so gradient descent knows which way to adjust. 🔄"
  },
  {
    q: "Which Python library is most commonly used for numerical computing in ML?",
    opts: ["Flask", "Django", "NumPy", "SQLAlchemy"],
    ans: 2,
    exp: "NumPy is the backbone of scientific Python — fast n-dimensional arrays and math operations that most ML libraries (including PyTorch & TF) build on. 🔢"
  },
  {
    q: "What does the 'learning rate' hyperparameter control?",
    opts: ["How many layers a neural network has", "The size of weight updates during training", "The number of training epochs", "How much data is used per batch"],
    ans: 1,
    exp: "Too high and you overshoot the minimum; too low and training takes forever. Getting the learning rate right is half the battle! 🎯"
  }
];

let qIdx = 0, score = 0, answered = false;

function loadQuestion() {
  const q = quizData[qIdx];
  document.getElementById('q-num').textContent = qIdx + 1;
  document.getElementById('q-total').textContent = quizData.length;
  document.getElementById('q-prog').style.width = ((qIdx+1)/quizData.length*100) + '%';
  document.getElementById('q-question').textContent = q.q;
  document.getElementById('q-feedback').className = 'quiz-feedback';
  document.getElementById('q-feedback').textContent = '';
  document.getElementById('quiz-next').classList.remove('ready');
  answered = false;

  const opts = document.getElementById('q-options');
  opts.innerHTML = '';
  q.opts.forEach((o, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt';
    btn.textContent = o;
    btn.addEventListener('click', () => handleAnswer(i, btn));
    opts.appendChild(btn);
  });
}

function handleAnswer(chosen, btn) {
  if (answered) return;
  answered = true;
  const q = quizData[qIdx];
  const allBtns = document.querySelectorAll('.quiz-opt');
  allBtns.forEach(b => b.disabled = true);

  const fb = document.getElementById('q-feedback');
  if (chosen === q.ans) {
    score++;
    document.getElementById('q-score').textContent = score;
    btn.classList.add('correct');
    fb.textContent = '🎉 ' + q.exp;
    fb.className = 'quiz-feedback good show';
  } else {
    btn.classList.add('wrong');
    allBtns[q.ans].classList.add('correct');
    fb.textContent = '💡 ' + q.exp;
    fb.className = 'quiz-feedback bad show';
  }
  document.getElementById('quiz-next').classList.add('ready');
}

document.getElementById('quiz-next').addEventListener('click', () => {
  qIdx++;
  if (qIdx < quizData.length) {
    loadQuestion();
  } else {
    // Final result
    const pct = Math.round(score / quizData.length * 100);
    const msgs = ['Keep learning! Every expert was once a beginner. 🌱', 'Not bad! You\'re on the right track. 🚀', 'Great job! You clearly know your ML! 🔥', 'Perfect score! You\'re basically Andrew Ng. 🏆'];
    const tier = pct < 40 ? 0 : pct < 70 ? 1 : pct < 100 ? 2 : 3;
    document.querySelector('.quiz-box').innerHTML = `
      <div style="text-align:center;padding:20px 0;">
        <div style="font-size:4rem;margin-bottom:16px;">${pct===100?'🏆':pct>=70?'🔥':pct>=40?'🚀':'📚'}</div>
        <h3 style="font-family:'Playfair Display',serif;font-size:1.8rem;margin-bottom:10px;">Quiz Complete!</h3>
        <p style="font-size:2.5rem;font-weight:700;color:var(--blue);margin-bottom:10px;">${score}/${quizData.length}</p>
        <p style="color:var(--muted);margin-bottom:28px;font-size:0.92rem;">${msgs[tier]}</p>
        <button class="btn btn-primary" style="cursor:none;" onclick="qIdx=0;score=0;document.getElementById('q-score')&&(document.getElementById('q-score').textContent='0');document.querySelector('.quiz-box').innerHTML='';loadQuestion();location.reload();">Try Again 🔄</button>
      </div>`;
  }
});

loadQuestion();
