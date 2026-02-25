'use strict';

// CURSOR GLOW
document.addEventListener('mousemove', e => {
  const glow = document.getElementById('cursorGlow');
  if (glow) { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; }
});

// PARTICLE SYSTEM
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.2 + 0.3;
      this.opacity = Math.random() * 0.4 + 0.05;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232,168,72,${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 90; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(232,168,72,${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }
  loop();
})();

// DATA
const TAG_CLASS = {
  mathematics: 'ctag-math', calculus: 'ctag-math', algebra: 'ctag-math', 'differential-equations': 'ctag-math',
  physics: 'ctag-physics', 'special-relativity': 'ctag-physics', mechanics: 'ctag-physics',
  'computer-science': 'ctag-cs', algorithms: 'ctag-cs', complexity: 'ctag-cs', python: 'ctag-cs',
  chemistry: 'ctag-chemistry', 'organic-chemistry': 'ctag-chemistry',
  biology: 'ctag-biology', genetics: 'ctag-biology', 'molecular-biology': 'ctag-biology',
  english: 'ctag-english', literature: 'ctag-english', shakespeare: 'ctag-english',
};
function getTagClass(t) { return TAG_CLASS[t.toLowerCase().trim()] || 'ctag-default'; }

let questions = [
  {
    id: 1, title: "How do I solve for the general solution of a second-order linear ODE with constant coefficients?",
    body: "I'm stuck on solving equations of the form **ay'' + by' + cy = 0**. I understand the characteristic equation approach but I'm confused when the discriminant is zero.\n\n> What happens in the case of a repeated root?\n\nFor example:\n```\ny'' - 4y' + 4y = 0\n```\nMy characteristic equation gives r² - 4r + 4 = 0, so (r-2)² = 0 meaning r = 2 (repeated). The textbook says the general solution is y = (C₁ + C₂x)e²ˣ but I don't understand why we multiply by x.",
    tags: ['mathematics', 'calculus', 'differential-equations'],
    votes: 42, views: 234,
    answers: [
      { id: 101, body: "When you get a **repeated root r**, the two solutions eʳˣ and xeʳˣ are linearly independent (Wronskian ≠ 0).\n\nThe intuition: **reduction of order** — assume y₂ = v(x)y₁ and substitute back. You'll always get v'' = 0 → v = C₁ + C₂x.\n\nSo for your example:\n```\ny = (C₁ + C₂x)e^(2x)\n```", author: "Prof. Maya R.", rep: 3840, accepted: true, votes: 28, time: "2h ago" },
      { id: 102, body: "You can verify linear independence using the **Wronskian**:\n\nW(e²ˣ, xe²ˣ) = e⁴ˣ ≠ 0\n\nThis confirms the two functions form a fundamental set of solutions.", author: "Kiran M.", rep: 912, accepted: false, votes: 11, time: "3h ago" }
    ],
    author: "Alex Chen", authorRep: 156, time: "5h ago", answered: true
  },
  {
    id: 2, title: "Why does time dilation occur in special relativity? Intuitive explanation?",
    body: "I understand the math (Lorentz factor γ = 1/√(1-v²/c²)) but I can't build an intuition for *why* time slows down for moving objects.\n\n> Can someone explain in plain English why motion affects the passage of time?",
    tags: ['physics', 'special-relativity'],
    votes: 38, views: 891,
    answers: [
      { id: 103, body: "Think of it this way: **light always travels at c**, regardless of your frame.\n\nIn a light clock moving relative to you, the light travels a longer diagonal path. Since distance = c × time, more distance means more time.\n\n> Moving through space means moving less through time. The total 4D speed through spacetime is always c.", author: "Dr. Lena K.", rep: 5621, accepted: true, votes: 45, time: "1d ago" }
    ],
    author: "Jamie W.", authorRep: 89, time: "1d ago", answered: true
  },
  {
    id: 3, title: "Understanding Big-O complexity of nested loops — is it always O(n²)?",
    body: "If I have two nested for loops over an array of size n, is the time complexity always O(n²)?\n\n```python\nfor i in range(n):\n    for j in range(i, n):\n        do_something()\n```\n\nThe inner loop doesn't always run n times so I thought maybe it's less than O(n²)?",
    tags: ['computer-science', 'algorithms', 'complexity'],
    votes: 19, views: 445,
    answers: [
      { id: 104, body: "Total operations = Σᵢ(n-i) from i=0 to n-1 = **n(n+1)/2**.\n\nIn Big-O we drop constants: **O(n²/2) = O(n²)**.\n\nTighter bound than naive n² but asymptotically identical. This is the pattern in bubble sort and insertion sort.", author: "Sam T.", rep: 1247, accepted: true, votes: 22, time: "3d ago" }
    ],
    author: "Priya S.", authorRep: 234, time: "3d ago", answered: true
  },
  {
    id: 4, title: "What is the mechanism of nucleophilic substitution (SN1 vs SN2)?",
    body: "I keep confusing SN1 and SN2 mechanisms. Can someone explain:\n1. What determines which pathway is followed?\n2. Does stereochemistry differ?\n3. How does solvent affect the reaction?",
    tags: ['chemistry', 'organic-chemistry'],
    votes: 27, views: 178, answers: [],
    author: "Bella T.", authorRep: 67, time: "6h ago", answered: false
  },
  {
    id: 5, title: "How does CRISPR-Cas9 actually cut DNA? Explain the molecular mechanism.",
    body: "I want to understand *how* the Cas9 protein actually cuts the double helix at the molecular level.\n\nWhat makes Cas9 specific to its target? What happens with a mismatch?",
    tags: ['biology', 'genetics', 'molecular-biology'],
    votes: 31, views: 672,
    answers: [
      { id: 105, body: "Step by step:\n\n1. **Guide RNA** forms a complex with Cas9 and scans DNA\n2. gRNA hybridizes via complementary base pairing\n3. A **PAM sequence** (NGG) is required for binding\n4. **HNH domain** cuts complementary strand, **RuvC** cuts the other\n5. Creates a **blunt-ended double-strand break**\n\nMismatches in the seed region abolish cutting.", author: "Dr. Park J.", rep: 4102, accepted: true, votes: 38, time: "2d ago" }
    ],
    author: "Ronen G.", authorRep: 342, time: "2d ago", answered: true
  },
  {
    id: 6, title: "Shakespeare's use of iambic pentameter — when and why does he break it?",
    body: "I'm analyzing *Hamlet* and my professor mentioned Shakespeare deliberately breaks iambic pentameter at emotional turning points. Can someone give concrete examples and explain the literary effect?",
    tags: ['english', 'literature', 'shakespeare'],
    votes: 14, views: 89, answers: [],
    author: "Sophie L.", authorRep: 45, time: "12h ago", answered: false
  }
];

const LEADERBOARD = [
  { name: "Dr. Lena K.",   rep: 5621, initials: "LK" },
  { name: "Dr. Park J.",   rep: 4102, initials: "PJ" },
  { name: "Prof. Maya R.", rep: 3840, initials: "MR" },
  { name: "Sam T.",        rep: 1247, initials: "ST" },
  { name: "Kiran M.",      rep: 912,  initials: "KM" },
];

const TRENDING = [
  { tag: "mathematics",     count: 142, cls: "stag math" },
  { tag: "computer-science",count: 118, cls: "stag cs" },
  { tag: "physics",         count: 95,  cls: "stag physics" },
  { tag: "chemistry",       count: 74,  cls: "stag chem" },
  { tag: "biology",         count: 61,  cls: "stag bio" },
];

const ACTIVITY = [
  { text: "<span class='af-accent'>Prof. Maya R.</span> answered: ODE repeated roots", time: "2 min ago" },
  { text: "New question posted in <span class='af-accent'>Physics</span>", time: "8 min ago" },
  { text: "<span class='af-accent'>Sam T.</span> earned the Expert badge", time: "15 min ago" },
  { text: "<span class='af-accent'>Alex Chen</span> upvoted 3 answers", time: "1h ago" },
];

// STATE
let currentFilter = 'all';
let currentSort   = 'newest';
let searchQuery   = '';
let votedQ = new Set();
let votedA = new Set();

// INIT
window.addEventListener('DOMContentLoaded', () => {
  renderQuestions();
  renderLeaderboard();
  renderTrending();
  renderActivity();
  updateStats();
  initKeyboard();
  animateStaggered();
});

function animateStaggered() {
  document.querySelectorAll('.q-card').forEach((el, i) => { el.style.animationDelay = `${i * 0.07}s`; });
}

// RENDER QUESTIONS
function renderQuestions() {
  let list = [...questions];
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(item => item.title.toLowerCase().includes(q) || item.body.toLowerCase().includes(q) || item.tags.some(t => t.includes(q)));
  }
  if (currentFilter === 'unanswered') list = list.filter(q => !q.answered);
  if (currentFilter === 'answered')   list = list.filter(q => q.answered);
  if (currentFilter === 'hot')        list = list.sort((a, b) => score(b) - score(a));
  if (currentSort === 'votes')        list = [...list].sort((a, b) => b.votes - a.votes);
  if (currentSort === 'answers')      list = [...list].sort((a, b) => b.answers.length - a.answers.length);

  const container = document.getElementById('questionList');
  const countEl   = document.getElementById('questionCount');
  const uBadge    = document.getElementById('unansweredCount');
  const uCount    = questions.filter(q => !q.answered).length;
  if (uBadge) uBadge.textContent = uCount;
  countEl.textContent = `${list.length} question${list.length !== 1 ? 's' : ''}`;

  if (!list.length) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><h3>No questions found</h3><p>Try adjusting your search or filters.</p></div>`;
    return;
  }

  container.innerHTML = list.map((q, idx) => {
    const tagsHtml = q.tags.map(t => `<span class="ctag ${getTagClass(t)}" onclick="event.stopPropagation();filterByTag('${t}')">${t}</span>`).join('');
    const excerpt  = q.body.replace(/[*_`#>~\[\]]/g, '').trim().substring(0, 115) + '…';
    const hasAccepted = q.answers.some(a => a.accepted);
    return `
      <div class="q-card ${q.answered ? 'answered' : ''}" onclick="openQuestion(${q.id})" style="animation-delay:${idx * 0.07}s">
        <div class="card-accent"></div>
        <div class="vote-block">
          <div class="vc-votes">${q.votes}</div>
          <div class="vc-lbl">votes</div>
          <div class="vc-ans ${hasAccepted ? 'accepted' : ''}" style="margin-top:0.4rem">
            <div class="vc-votes">${q.answers.length}</div>
            <div class="vc-lbl">${hasAccepted ? '✓ ans' : 'ans'}</div>
          </div>
        </div>
        <div class="card-body">
          <div class="card-title">${q.title}</div>
          <div class="card-excerpt">${excerpt}</div>
          <div class="card-footer">
            <div class="card-tags">${tagsHtml}</div>
            <div class="card-meta">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              ${q.views}
              <span class="meta-dot">·</span>
              <span class="meta-name">${q.author}</span>
              <span class="meta-rep">${q.authorRep}</span>
              <span class="meta-dot">·</span>
              ${q.time}
            </div>
          </div>
        </div>
      </div>`;
  }).join('');
}

function score(q) { return q.votes * 3 + q.answers.length * 5 + q.views * 0.1; }

// OPEN QUESTION DETAIL
function openQuestion(id) {
  const q = questions.find(x => x.id === id);
  if (!q) return;
  q.views++;

  const tagsHtml = q.tags.map(t => `<span class="ctag ${getTagClass(t)}" style="cursor:default">${t}</span>`).join('');
  const answersHtml = q.answers.length
    ? q.answers.map(a => `
        <div class="answer-card ${a.accepted ? 'accepted' : ''}">
          ${a.accepted ? '<div class="accepted-badge">✓ Accepted Answer</div>' : ''}
          <div class="vote-row">
            <button class="v-btn ${votedA.has(a.id) ? 'voted' : ''}" onclick="voteAnswer(${q.id},${a.id},this,1)">▲</button>
            <span class="v-num" id="avote-${a.id}">${a.votes}</span>
            <button class="v-btn" onclick="voteAnswer(${q.id},${a.id},this,-1)">▼</button>
          </div>
          <div class="md-content">${renderMD(a.body)}</div>
          <div class="answer-footer">
            <span>Answered by <span class="meta-name">${a.author}</span> <span class="meta-rep">${a.rep} rep</span></span>
            <span>${a.time}</span>
          </div>
        </div>`).join('')
    : '<p style="color:var(--text3);font-size:0.875rem;padding:0.5rem 0">No answers yet — be the first!</p>';

  document.getElementById('detailContent').innerHTML = `
    <div class="q-detail-title">${q.title}</div>
    <div class="q-detail-meta">
      <span><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${q.time}</span>
      <span><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>${q.views} views</span>
      <span>By <span class="meta-name">${q.author}</span> <span class="meta-rep">${q.authorRep}</span></span>
    </div>
    <div class="card-tags" style="margin-bottom:1rem">${tagsHtml}</div>
    <div class="vote-row">
      <button class="v-btn ${votedQ.has(id) ? 'voted' : ''}" onclick="voteQuestion(${id},this,1)">▲</button>
      <span class="v-num" id="qvote-${id}">${q.votes}</span>
      <button class="v-btn" onclick="voteQuestion(${id},this,-1)">▼</button>
    </div>
    <div style="border-top:1px solid var(--border);padding-top:1rem;margin-bottom:1.25rem">
      <div class="md-content">${renderMD(q.body)}</div>
    </div>
    <div class="answers-section">
      <h3>${q.answers.length} Answer${q.answers.length !== 1 ? 's' : ''}</h3>
      ${answersHtml}
    </div>
    <div style="margin-top:1.5rem;border-top:1px solid var(--border);padding-top:1.25rem">
      <h3 style="font-family:var(--font-display);font-size:1rem;font-weight:700;margin-bottom:0.875rem;color:var(--text)">Your Answer</h3>
      <div class="editor-wrap" style="margin-bottom:0.75rem">
        <div class="editor-toolbar">
          <button class="tb-btn" onclick="insertMd('answerBody','**','**')"><b>B</b></button>
          <button class="tb-btn" onclick="insertMd('answerBody','*','*')"><i>I</i></button>
          <button class="tb-btn" onclick="insertMd('answerBody','\`','\`')">&lt;/&gt;</button>
          <div class="tb-sep"></div>
          <button class="tb-btn" onclick="insertMd('answerBody','\n\`\`\`\n','\n\`\`\`\n')">⊞</button>
          <button class="tb-btn" onclick="insertMd('answerBody','> ','')">❝</button>
          <div class="tb-sep"></div>
          <button class="tb-btn tb-preview" onclick="togglePreview('answerBody','answerPreview','answerPreviewBtn')" id="answerPreviewBtn">Preview</button>
        </div>
        <textarea class="form-textarea" id="answerBody" rows="7" placeholder="Write your answer here. Markdown is supported."></textarea>
        <div id="answerPreview" class="md-preview hidden"></div>
      </div>
      <div style="display:flex;justify-content:flex-end">
        <button class="btn-submit" onclick="submitAnswer(${id})">
          <span>Post Answer</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>
    </div>`;

  showModal('detailModal');
  setTimeout(() => {
    if (window.hljs) document.querySelectorAll('#detailContent pre code').forEach(b => hljs.highlightElement(b));
  }, 100);
}

// VOTE
function voteQuestion(id, btn, dir) {
  if (votedQ.has(id)) { toast('Already voted on this question'); return; }
  const q = questions.find(x => x.id === id);
  if (!q) return;
  q.votes += dir;
  votedQ.add(id);
  const el = document.getElementById(`qvote-${id}`);
  if (el) el.textContent = q.votes;
  btn.classList.add('voted');
  toast(dir > 0 ? '▲ Upvoted!' : '▼ Downvoted');
  renderQuestions();
}

function voteAnswer(qid, aid, btn, dir) {
  if (votedA.has(aid)) { toast('Already voted on this answer'); return; }
  const q = questions.find(x => x.id === qid);
  const a = q && q.answers.find(x => x.id === aid);
  if (!a) return;
  a.votes += dir;
  votedA.add(aid);
  const el = document.getElementById(`avote-${aid}`);
  if (el) el.textContent = a.votes;
  btn.classList.add('voted');
  toast(dir > 0 ? '▲ Answer upvoted!' : '▼ Downvoted');
}

// SUBMIT QUESTION
function submitQuestion() {
  const title   = document.getElementById('qTitle').value.trim();
  const body    = document.getElementById('askBody').value.trim();
  const tagsRaw = document.getElementById('qTags').value.trim();
  if (!title)           { toast('⚠ Please enter a title'); return; }
  if (body.length < 20) { toast('⚠ Body needs at least 20 characters'); return; }
  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean).slice(0, 5) : ['general'];
  questions.unshift({ id: Date.now(), title, body, tags, votes: 0, views: 1, answers: [], author: 'You', authorRep: 1, time: 'just now', answered: false });
  document.getElementById('qTitle').value  = '';
  document.getElementById('askBody').value = '';
  document.getElementById('qTags').value   = '';
  closeModal('askModal');
  renderQuestions();
  updateStats();
  animateStaggered();
  toast('✦ Question posted!');
}

// SUBMIT ANSWER
function submitAnswer(qid) {
  const body = document.getElementById('answerBody').value.trim();
  if (body.length < 10) { toast('⚠ Answer is too short'); return; }
  const q = questions.find(x => x.id === qid);
  if (!q) return;
  q.answers.push({ id: Date.now(), body, author: 'You', rep: 1, accepted: false, votes: 0, time: 'just now' });
  q.answered = true;
  closeModal('detailModal');
  renderQuestions();
  updateStats();
  toast('✦ Answer posted!');
  setTimeout(() => openQuestion(qid), 350);
}

// FILTER & SORT
function setFilter(type, el) {
  currentFilter = type;
  document.querySelectorAll('.sb-link').forEach(l => l.classList.remove('active'));
  if (el) el.classList.add('active');
  const titles = { all: 'All Questions', unanswered: 'Unanswered Questions', answered: 'Solved Questions', hot: 'Trending 🔥' };
  document.getElementById('pageTitle').textContent = titles[type] || 'Questions';
  renderQuestions();
}

function setSortFilter(type, el) {
  currentSort = type;
  document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  renderQuestions();
}

function filterByTag(tag) {
  searchQuery = tag;
  currentFilter = 'all';
  document.querySelectorAll('.sb-link').forEach(l => l.classList.remove('active'));
  const allLink = document.querySelector('.sb-link[onclick*="all"]');
  if (allLink) allLink.classList.add('active');
  const input = document.getElementById('globalSearch');
  if (input) input.value = tag;
  document.getElementById('pageTitle').textContent = `Tag: ${tag}`;
  renderQuestions();
  hideSearchDropdown();
}

// SEARCH
function handleSearch(val) {
  searchQuery = val.trim();
  if (!searchQuery) {
    document.getElementById('pageTitle').textContent = 'All Questions';
    hideSearchDropdown();
  } else {
    document.getElementById('pageTitle').textContent = `Results for "${searchQuery}"`;
    showSearchDropdown(searchQuery);
  }
  renderQuestions();
}

function showSearchDropdown(val) {
  const dd = document.getElementById('searchDropdown');
  const results = questions.filter(q => q.title.toLowerCase().includes(val.toLowerCase()) || q.tags.some(t => t.includes(val.toLowerCase()))).slice(0, 5);
  if (!results.length) { hideSearchDropdown(); return; }
  dd.innerHTML = results.map(q => `
    <div class="sd-item" onclick="openQuestion(${q.id});hideSearchDropdown()">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text3);flex-shrink:0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${q.title}</span>
      <span class="sd-tag">${q.tags[0]}</span>
    </div>`).join('');
  dd.classList.add('open');
}

function hideSearchDropdown() { document.getElementById('searchDropdown').classList.remove('open'); }

document.addEventListener('click', e => { if (!e.target.closest('.nav-search-wrap')) hideSearchDropdown(); });

// MARKDOWN
function renderMD(text) {
  if (typeof marked !== 'undefined') { try { return marked.parse(text); } catch (e) {} }
  return text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/`(.*?)`/g, '<code>$1</code>');
}

// EDITOR
function insertMd(id, before, after) {
  const ta = document.getElementById(id);
  if (!ta) return;
  const s = ta.selectionStart, e = ta.selectionEnd;
  const sel = ta.value.substring(s, e);
  ta.value = ta.value.substring(0, s) + before + sel + after + ta.value.substring(e);
  ta.focus();
  ta.setSelectionRange(s + before.length, s + before.length + sel.length);
}

function togglePreview(taId, pvId, btnId) {
  const ta = document.getElementById(taId);
  const pv = document.getElementById(pvId);
  const btn = document.getElementById(btnId);
  if (!ta || !pv) return;
  if (pv.classList.contains('hidden')) {
    pv.innerHTML = renderMD(ta.value || '*Nothing to preview yet.*');
    pv.classList.remove('hidden');
    ta.classList.add('hidden');
    if (btn) { btn.textContent = 'Edit'; btn.style.color = 'var(--teal)'; }
    if (window.hljs) pv.querySelectorAll('pre code').forEach(b => hljs.highlightElement(b));
  } else {
    pv.classList.add('hidden');
    ta.classList.remove('hidden');
    if (btn) { btn.textContent = 'Preview'; btn.style.color = ''; }
  }
}

// MODALS
function showModal(id) { const m = document.getElementById(id); if (!m) return; m.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal(id) { const m = document.getElementById(id); if (!m) return; m.classList.remove('open'); document.body.style.overflow = ''; }
document.querySelectorAll('.modal-overlay').forEach(m => { m.addEventListener('click', e => { if (e.target === m) closeModal(m.id); }); });

// AUTH
function switchAuthTab(tab, el) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('authTitle').textContent = tab === 'login' ? 'Welcome Back' : 'Join Scholara';
  document.getElementById('loginForm').classList.toggle('hidden',  tab !== 'login');
  document.getElementById('signupForm').classList.toggle('hidden', tab !== 'signup');
}

function fakeLogin() { closeModal('loginModal'); toast('✦ Welcome to Scholara!'); }

// TOAST
let toastTimer = null;
function toast(msg) {
  const el = document.getElementById('toast');
  const txt = document.getElementById('toastMsg');
  if (!el || !txt) return;
  txt.innerHTML = msg;
  el.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}

// STATS
function updateStats() {
  const totalA = questions.reduce((s, q) => s + q.answers.length, 0);
  const hQ = document.getElementById('hstatQ');
  const hA = document.getElementById('hstatA');
  if (hQ) hQ.textContent = questions.length;
  if (hA) hA.textContent = totalA;
}

// LEADERBOARD
function renderLeaderboard() {
  const rankClasses = ['gold-rank', 'silver-rank', 'bronze-rank'];
  document.getElementById('leaderboard').innerHTML = LEADERBOARD.map((u, i) => `
    <div class="lb-item">
      <span class="lb-rank ${rankClasses[i] || ''}">${i + 1}</span>
      <div class="lb-avatar">${u.initials}</div>
      <span class="lb-name">${u.name}</span>
      <span class="lb-rep">${u.rep.toLocaleString()}</span>
    </div>`).join('');
}

// TRENDING
function renderTrending() {
  const max = Math.max(...TRENDING.map(t => t.count));
  document.getElementById('trendingTags').innerHTML = TRENDING.map(t => `
    <div class="tt-item" onclick="filterByTag('${t.tag}')">
      <span class="${t.cls}" style="font-size:0.75rem;padding:0.2rem 0.5rem">${t.tag}</span>
      <div class="tt-bar-wrap"><div class="tt-bar-bg"><div class="tt-bar" style="width:${(t.count/max*100).toFixed(0)}%"></div></div></div>
      <span class="tt-count">${t.count}</span>
    </div>`).join('');
}

// ACTIVITY
function renderActivity() {
  document.getElementById('recentActivity').innerHTML = ACTIVITY.map(a => `
    <div class="af-item">${a.text}<span class="af-time">${a.time}</span></div>`).join('');
}

// KEYBOARD
function initKeyboard() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id)); hideSearchDropdown(); }
    if (e.key === '/' && !e.target.closest('input, textarea')) { e.preventDefault(); document.getElementById('globalSearch').focus(); }
  });
}

// SCROLL
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.style.borderBottomColor = window.scrollY > 20 ? 'var(--border2)' : 'var(--border)';
});