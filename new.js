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
          const WINDOW_MS  = 60 * 60 * 1000;
          
          const form      = document.getElementById('contactForm');
          const submitBtn = document.getElementById('submitBtn');
          const rateMsg   = document.getElementById('rate-msg');
          
          // Helper functions for Rate Limiting
          function getPruned() {
              const now = Date.now();
              try {
                  const timestamps = JSON.parse(localStorage.getItem(RATE_KEY) || '[]');
                  return timestamps.filter(t => now - t < WINDOW_MS);
              } catch { return []; }
          }
          
          function isRateLimited() {
              return getPruned().length >= MAX_TRIES;
          }
          
          function recordSubmission() {
              const pruned = getPruned();
              pruned.push(Date.now());
              localStorage.setItem(RATE_KEY, JSON.stringify(pruned));
          }
          
          // Initial check
          if (isRateLimited()) {
              submitBtn.disabled = true;
              rateMsg.style.display = 'block';
          }
          
          form.addEventListener('submit', async function (e) {
              e.preventDefault(); // REQUIRED: We are handling the submit via Fetch
          
              if (isRateLimited()) {
                  alert("You have reached the submission limit. Please try again later.");
                  return;
              }
          
              // Capture hCaptcha only if you actually have it in your HTML
              const hCaptcha = form.querySelector('textarea[name=h-captcha-response]')?.value;
              // Uncomment the lines below ONLY if you are using hCaptcha
              
              // if (!hCaptcha) {
              //     alert('Please complete the captcha.');
              //     return;
              // }
              
          
              const originalText = submitBtn.textContent;
              submitBtn.textContent = "Sending...";
              submitBtn.disabled = true;
          
              const formData = new FormData(form);
          
              try {
                  const response = await fetch("https://api.web3forms.com/submit", {
                      method: "POST",
                      body: formData
                  });
          
                  const data = await response.json();
          
                  if (response.ok) {
                      recordSubmission();
                      alert("Success! Your message has been sent.");
                      form.reset();
                      // Redirect to your thank you page
                      window.location.href = "https://teddyasinobi-01.github.io/jendy-jasper-ltd/thankyou.html";
                  } else {
                      alert("Error: " + (data.message || "Something went wrong"));
                      submitBtn.disabled = false;
                      submitBtn.textContent = originalText;
                  }
          
              } catch (error) {
                  alert("Network error. Please check your connection and try again.");
                  submitBtn.disabled = false;
                  submitBtn.textContent = originalText;
              }
          });





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

