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
const rateLimiter = new FormRateLimiter(5, 60 * 60 * 1000); // 5 per hour

const contactForm = document.getElementById('contact-form');   // Make sure your form has id="contact-form"

if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // === RATE LIMIT CHECK ===
    const rateCheck = rateLimiter.canSubmit();
    if (!rateCheck.allowed) {
      alert(rateCheck.message);
      return;
    }

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : 'Send Message';

    // Disable button and show loading state
    if (submitBtn) {
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
    }

    try {
      const formData = new FormData(this);

      const response = await fetch(this.action, {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Record successful submission for rate limiting
        rateLimiter.recordSubmission();

        alert("Success! Your message has been sent.");

        this.reset();   // Clear the form

        // Optional: Auto redirect after success (you can adjust or remove)
        // setTimeout(() => {
        //   window.location.href = 'https://teddyasinobi-01.github.io/jendy-jasper-ltd/';
        // }, 2000);

      } else {
        const text = await response.text();
        alert("submission failed"+ (text || "Error submitting form. Please try again."));
      }
    }
    // catch (error) {
    //   console.error("Submission error:", error);
    //   alert("Network error. Please check your connection and try again.");
    // }
    finally {
      // Restore button
      if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    }
  });
}

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