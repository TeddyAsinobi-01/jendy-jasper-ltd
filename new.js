// ─── NAV SCROLL
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('solid', window.scrollY > 60);
});

// ─── REVEAL ON SCROLL
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ====================== CONTACT FORM ======================





          // ─── Rate Limiter ───────────────────────────────────────────────
            // Stores timestamps of submissions in localStorage.
            // Allows max 6 submissions per rolling 60-minute window.
          //──────────────────────────────────────────────────────────────── */
          const RATE_KEY   = 'cf_submissions';
          const MAX_TRIES  = 6;
          const WINDOW_MS  = 60 * 60 * 1000; // 1 hour
        
          function getTimestamps() {
            try {
              return JSON.parse(localStorage.getItem(RATE_KEY) || '[]');
            } catch { return []; }
          }
        
          function saveTimestamps(arr) {
            localStorage.setItem(RATE_KEY, JSON.stringify(arr));
          }
        
          function getPruned() {
            const now = Date.now();
            return getTimestamps().filter(t => now - t < WINDOW_MS);
          }
        
          function isRateLimited() {
            return getPruned().length >= MAX_TRIES;
          }
        
          function recordSubmission() {
            const pruned = getPruned();
            pruned.push(Date.now());
            saveTimestamps(pruned);
          }
        
          /* ─── On page load: disable button if already rate-limited ───── */
          const form      = document.getElementById('contactForm');
          const submitBtn = document.getElementById('submitBtn');
          const rateMsg   = document.getElementById('rate-msg');
        
          function checkRateOnLoad() {
            if (isRateLimited()) {
              submitBtn.disabled = true;
              rateMsg.style.display = 'block';
            }
          }
          checkRateOnLoad();
        
          /* ─── Intercept submit ──────────────────────────────────────────
             1. Check rate limit before letting FormSubmit see it.
             2. Record the attempt.
             3. Allow native form POST → FormSubmit handles captcha,
                then redirects to _next (thankyou.html).
          ──────────────────────────────────────────────────────────────── */
          form.addEventListener('submit', function (e) {
        
            if (isRateLimited()) {
              e.preventDefault();
              submitBtn.disabled = true;
              rateMsg.style.display = 'block';
              return;
            }
        
            // Record this submission BEFORE the page navigates away
            recordSubmission();
        
            // Let the form POST naturally → FormSubmit captcha → thankyou.html
            // (no e.preventDefault() here)
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending…';
          });



// ====================== hCAPTCHA CHECK ======================
const newform = document.getElementById('contact-form');
if (newform) {
  newform.addEventListener('submit', function (e) {
    const hCaptcha = newform.querySelector('textarea[name="h-captcha-response"]');
    if (hCaptcha && !hCaptcha.value) {
      e.preventDefault();
      alert("Please complete the captcha verification");
      return false;
    }
  });
}

// ====================== MOBILE NAV TOGGLE ======================
document.getElementById('ham').addEventListener('click', () => {
  const links = document.querySelector('.nav-links');
  if (links.style.display === 'flex') {
    links.style.display = 'none';
  } else {
    links.style.display = 'flex';
    links.style.flexDirection = 'column';
    links.style.position = 'fixed';
    links.style.top = '0';
    links.style.left = '0';
    links.style.right = '0';
    links.style.bottom = '0';
    links.style.background = 'rgba(13,30,51,0.98)';
    links.style.justifyContent = 'center';
    links.style.alignItems = 'center';
    links.style.gap = '36px';
    links.style.zIndex = '300';
    links.style.fontSize = '18px';
  }
});

