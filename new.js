// ─── NAV SCROLL
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('solid', window.scrollY > 60);
});

// ─── REVEAL ON SCROLL
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ─── RATE LIMITER CLASS (Improved)
class FormRateLimiter {
  constructor(maxAttempts = 5, windowMs = 60 * 60 * 1000) { // 5 per hour
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.key = 'enquiry_form_submissions';
  }

  canSubmit() {
    const now = Date.now();
    let submissions = JSON.parse(localStorage.getItem(this.key) || '[]');

    // Remove expired submissions
    submissions = submissions.filter(time => now - time < this.windowMs);

    if (submissions.length >= this.maxAttempts) {
      const oldest = submissions[0];
      const timeLeftMs = oldest + this.windowMs - now;
      const timeLeftMin = Math.ceil(timeLeftMs / 1000 / 60);

      return {
        allowed: false,
        message: `You have reached the maximum of ${this.maxAttempts} enquiries per hour. Please try again in about ${timeLeftMin} minute(s).`
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

// Initialize rate limiter
const rateLimiter = new FormRateLimiter(5, 60 * 60 * 1000); // ← Change numbers here if needed

// ─── CONTACT FORM with Rate Limiter
const contactForm = document.getElementById('contact-form') || document.getElementById('contactForm');

if (contactForm) {
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Rate limit check
    const check = rateLimiter.canSubmit();
    if (!check.allowed) {
      showFormMessage(check.message, 'error');
      return;
    }

    if (!submitBtn) return;

    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
      const formData = new FormData(contactForm);
      formData.append("access_key", "a581fc14-460b-4a42-83dc-9dae7bf467b9");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Only record successful submission
        rateLimiter.recordSubmission();

        showFormMessage("Success! Your message has been sent.", 'success');

        contactForm.reset();

        // Optional: Auto redirect after success (uncomment if you want)
        // setTimeout(() => {
        //   window.location.href = 'https://teddyasinobi-01.github.io/jendy-jasper-ltd/';
        // }, 3000);

      } else {
        showFormMessage(data.message || "Error sending message. Please try again.", 'error');
      }
    } catch (error) {
      console.error(error);
      showFormMessage("Something went wrong. Please try again later.", 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// Helper to show nice message below the form
function showFormMessage(message, type = 'error') {
  let msgDiv = document.getElementById('form-message');

  if (!msgDiv) {
    msgDiv = document.createElement('div');
    msgDiv.id = 'form-message';
    msgDiv.style.marginTop = '15px';
    msgDiv.style.padding = '12px';
    msgDiv.style.borderRadius = '6px';
    msgDiv.style.textAlign = 'center';
    msgDiv.style.fontSize = '15px';

    const form = document.getElementById('contact-form') || document.getElementById('contactForm');
    if (form) form.appendChild(msgDiv);
  }

  msgDiv.textContent = message;
  msgDiv.style.background = type === 'success' ? '#2A7F62' : '#ff4d4d';
  msgDiv.style.color = '#fff';
  msgDiv.style.display = 'block';

  // Auto hide success message after 6 seconds
  if (type === 'success') {
    setTimeout(() => {
      if (msgDiv) msgDiv.style.display = 'none';
    }, 6000);
  }
}

// ─── Keep your other existing code below (mobile nav, captcha, etc.)

// MOBILE NAV TOGGLE
document.getElementById('ham')?.addEventListener('click', () => {
  const links = document.querySelector('.nav-links');
  if (links) {
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
  }
});

// CAPTCHA (your existing code)
// const newform = document.getElementById('contact-form');
// if (newform) {
//   newform.addEventListener('submit', function(e) {
//     const hCaptcha = newform.querySelector('textarea[name="h-captcha-response"]')?.value;
//     if (!hCaptcha) {
//       e.preventDefault();
//       alert("Please complete the captcha");
//       return;
//     }
//   });
// }

// You can keep or remove the other form listeners (redirect, Formspree, etc.) 
// as they seem to be from previous experiments. The main one above should now handle it.

console.log('✅ Rate limiter + contact form handler loaded');