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

// ====================== FORM RATE LIMITER ======================
class FormRateLimiter {
  constructor(maxAttempts = 5, windowMs = 60 * 60 * 1000) {
    this.maxAttempts = maxAttempts;   // 5 enquiries per hour
    this.windowMs = windowMs;
    this.key = 'enquiry_form_submissions';
  }

  canSubmit() {
    const now = Date.now();
    let submissions = JSON.parse(localStorage.getItem(this.key) || '[]');

    // Remove old submissions outside the 1-hour window
    submissions = submissions.filter(time => now - time < this.windowMs);

    if (submissions.length >= this.maxAttempts) {
      const oldest = submissions[0];
      const timeLeftMs = oldest + this.windowMs - now;
      const timeLeftMinutes = Math.ceil(timeLeftMs / 1000 / 60);
      const minuteText = timeLeftMinutes === 1 ? 'minute' : 'minutes';

      return {
        allowed: false,
        message: `You have reached the maximum of ${this.maxAttempts} enquiries per hour. ` +
                 `Please try again in about ${timeLeftMinutes} ${minuteText}.`
      };
    }

    return { allowed: true };
  }

  recordSubmission() {
    const now = Date.now();
    let submissions = JSON.parse(localStorage.getItem(this.key) || '[]');
    submissions = submissions.filter(time => now - time < this.windowMs);
    submissions.push(now);
    localStorage.setItem(this.key, JSON.stringify(submissions));
  }
}

// ====================== CONTACT FORM HANDLER ======================
// ====================== CONTACT FORM HANDLER ======================
const rateLimiter = new FormRateLimiter(5, 60 * 60 * 1000);

const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // === 1. CAPTCHA CHECK ===
    const hCaptcha = this.querySelector('textarea[name="h-captcha-response"]');
    if (hCaptcha && !hCaptcha.value) {
      alert("Please complete the captcha verification.");
      return;
    }

    // === 2. RATE LIMIT CHECK ===
    const check = rateLimiter.canSubmit();
    if (!check.allowed) {
      alert(check.message);
      return;
    }

    // === 3. SUBMIT ===
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : 'Send Message';

    if (submitBtn) {
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
    }

    try {
      const formData = new FormData(this);
      formData.append("access_key", "a581fc14-460b-4a42-83dc-9dae7bf467b9");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        rateLimiter.recordSubmission();
        this.reset();
        window.location.href = 'thankyou.html';
      } else {
        alert(data.message || "Error submitting form. Please try again.");
      }

    } catch (error) {
      console.error("Submission error:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
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

// ====================== CLEANUP OLD CODE ======================
// All old conflicting form handlers, auto-redirects, and unused code have been removed for cleanliness.
// You can re-add specific redirect logic if needed.