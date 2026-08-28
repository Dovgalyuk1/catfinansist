// =========================================================
// CATFINANSIST — $CATFIN
// Fill CONFIG in when the token is minted — everything else
// (CA display/copy, buy/chart/social links, live stats) wires
// itself up automatically.
// =========================================================

const CONFIG = {
  CA: '', // e.g. '0x...' or a Solana mint address — leave empty until minted
  CHAIN: 'solana', // 'solana' | 'ethereum' | 'base' | etc — used for DexScreener lookups
  CHART_URL: '#',
  BUY_URL: '#',
  X_URL: '#',
  TELEGRAM_URL: '#',
};

// ---------- CA pills (nav / hero / mobile / footer) ----------
const caValueEls = [
  document.getElementById('caValueNav'),
  document.getElementById('caValueHero'),
  document.getElementById('caValueMobile'),
  document.getElementById('caValueFooter'),
].filter(Boolean);

const caPillEls = [
  document.getElementById('caPillNav'),
  document.getElementById('caPillHero'),
  document.getElementById('caPillMobile'),
  document.getElementById('caPillFooter'),
].filter(Boolean);

function shortenCA(ca) {
  if (ca.length <= 14) return ca;
  return ca.slice(0, 6) + '…' + ca.slice(-5);
}

if (CONFIG.CA) {
  caValueEls.forEach((el, i) => {
    // hero pill can show the full address, the rest show a shortened one
    el.textContent = el.id === 'caValueHero' ? CONFIG.CA : shortenCA(CONFIG.CA);
  });
}

caPillEls.forEach((pill) => {
  pill.addEventListener('click', () => {
    if (!CONFIG.CA) {
      showToast('Not minted yet — check back soon 🐾');
      return;
    }
    navigator.clipboard.writeText(CONFIG.CA).then(() => {
      showToast('Contract address copied ✓');
    }).catch(() => {
      showToast(CONFIG.CA);
    });
  });
});

// ---------- link buttons ----------
function wireLink(id, url) {
  const el = document.getElementById(id);
  if (!el) return;
  if (url && url !== '#') {
    el.href = url;
  } else {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Link coming soon 🐾');
    });
  }
}

wireLink('buyBtnNav', CONFIG.BUY_URL);
wireLink('buyBtnHero', CONFIG.BUY_URL);
wireLink('buyBtnMobile', CONFIG.BUY_URL);
wireLink('chartBtnHero', CONFIG.CHART_URL);
wireLink('chartBtnFooter', CONFIG.CHART_URL);
wireLink('xBtnHero', CONFIG.X_URL);
wireLink('xBtnFooter', CONFIG.X_URL);
wireLink('telegramBtnFooter', CONFIG.TELEGRAM_URL);

// ---------- toast ----------
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

// ---------- mobile nav ----------
const burgerBtn = document.getElementById('burgerBtn');
const navMobile = document.getElementById('navMobile');
if (burgerBtn && navMobile) {
  burgerBtn.addEventListener('click', () => {
    navMobile.classList.toggle('open');
  });
  navMobile.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => navMobile.classList.remove('open'));
  });
}

// ---------- falling bills ambient layer ----------
(function billRain() {
  const layer = document.getElementById('billLayer');
  if (!layer) return;
  const isMobile = window.innerWidth < 640;
  const count = isMobile ? 10 : 18;
  const symbols = ['$', '$CATFIN', '$'];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'bill';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = 12 + Math.random() * 16 + 'px';
    const duration = 14 + Math.random() * 16;
    el.style.animationDuration = duration + 's';
    el.style.animationDelay = -(Math.random() * duration) + 's';
    layer.appendChild(el);
  }
})();

// ---------- cosmetic office stat counters ----------
function animateCounter(id, target, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
animateCounter('statNaps', 7, 1400);
animateCounter('statPours', 4, 1400);
animateCounter('statDips', 23, 1600);

// ---------- live stats from DexScreener (only once CA is set) ----------
async function loadLiveStats() {
  const note = document.getElementById('liveStatsNote');
  if (!CONFIG.CA) return; // leave placeholders + note as-is

  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${CONFIG.CA}`);
    const data = await res.json();
    const pair = data && data.pairs && data.pairs[0];
    if (!pair) return;

    const priceEl = document.getElementById('livePrice');
    const mcapEl = document.getElementById('liveMcap');
    const volEl = document.getElementById('liveVol');
    const changeEl = document.getElementById('liveChange');

    if (priceEl && pair.priceUsd) priceEl.textContent = '$' + Number(pair.priceUsd).toFixed(8).replace(/0+$/, '').replace(/\.$/, '');
    if (mcapEl && pair.fdv) mcapEl.textContent = '$' + Number(pair.fdv).toLocaleString();
    if (volEl && pair.volume && pair.volume.h24 != null) volEl.textContent = '$' + Number(pair.volume.h24).toLocaleString();
    if (changeEl && pair.priceChange && pair.priceChange.h24 != null) {
      const change = Number(pair.priceChange.h24);
      changeEl.textContent = (change >= 0 ? '+' : '') + change.toFixed(2) + '%';
      changeEl.style.color = change >= 0 ? '#7dd88a' : '#e8746f';
    }
    if (note) note.style.display = 'none';
  } catch (err) {
    // silently keep placeholders — no network / API hiccup
  }
}
loadLiveStats();

// ---------- footer year ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
