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

// ─── CONTACT FORM
// document.getElementById('send-btn').addEventListener('click', () => {
//   const btn = document.getElementById('send-btn');
//   btn.textContent = 'Message Sent ✓';
//   btn.style.background = '#2A7F62';
//   btn.style.color = '#fff';
//   setTimeout(() => {
//     btn.textContent = 'Send Message';
//     btn.style.background = '';
//     btn.style.color = '';
//   }, 3000);
// });

//Rate limiter
// enquiryRateLimiter.js  (or put it directly in your form script)

class FormRateLimiter {
  constructor(maxAttempts = 5, windowMs = 60 * 60 * 1000) { // 5 per hour
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.key = 'enquiry_form_submissions'; // Change if you have multiple forms
  }

  canSubmit() {
    const now = Date.now();
    let submissions = JSON.parse(localStorage.getItem(this.key) || '[]');

    // Remove old submissions outside the time window
    submissions = submissions.filter(time => now - time < this.windowMs);

    if (submissions.length >= this.maxAttempts) {
      const oldest = submissions[0];
      const timeLeft = Math.ceil((oldest + this.windowMs - now) / 1000 / 60); // minutes
      return {
        allowed: false,
        message: `You have reached the maximum of ${this.maxAttempts} enquiries per hour. Please try again in about ${timeLeft} minute(s).`
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

<<<<<<< HEAD
// ====================== CONTACT FORM HANDLER ======================
// ====================== CONTACT FORM HANDLER ======================
const rateLimiter = new FormRateLimiter(5, 60 * 60 * 1000);

const contactForm = document.getElementById('contact-form');
=======
// Usage in your form submit handler
const rateLimiter = new FormRateLimiter(5, 60 * 60 * 1000);

async function handleFormSubmit(e) {
  e.preventDefault();
>>>>>>> 67489fcc39d4cadd89278d785b38bc0f2b5a855e

  const check = rateLimiter.canSubmit();
  if (!check.allowed) {
    alert(check.message);   // or show a nice UI message
    return;
  }

<<<<<<< HEAD
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
=======
  // Optional: disable submit button while submitting
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;

  try {
    const formData = new FormData(e.target);
    const response = await fetch('/api/submit-enquiry', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (response.status === 429) {
      alert(result.message || "Too many enquiries. Please try again later.");
      return;
    }

    if (result.success) {
      rateLimiter.recordSubmission();   // Only count successful submissions
      alert("Enquiry submitted successfully!");
      e.target.reset();
>>>>>>> 67489fcc39d4cadd89278d785b38bc0f2b5a855e
    }
  } catch (err) {
    console.error(err);
  } finally {
    submitBtn.disabled = false;
  }
}



const form = document.getElementsByTagName('form');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.querySelector('[name="email"]').value;

    //  Check rate limit first
    if (!checkRateLimit(email)) {
      alert(' You have reached the maximum of 5 submissions per hour. Please try again later.');
      return;
    }

    const formData = new FormData(form);
    formData.append("access_key", "a581fc14-460b-4a42-83dc-9dae7bf467b9");

    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
<<<<<<< HEAD
      const formData = new FormData(this);
      formData.append("access_key", "a581fc14-460b-4a42-83dc-9dae7bf467b9");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
=======
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
>>>>>>> 67489fcc39d4cadd89278d785b38bc0f2b5a855e

        if (response.ok) {
            alert("Success! Your message has been sent.");
            form.reset();
        } else {
            alert("Error: " + data.message);
        }

<<<<<<< HEAD
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
=======
    } catch (error) {
        alert("Something went wrong. Please try again.");
    } finally {
>>>>>>> 67489fcc39d4cadd89278d785b38bc0f2b5a855e
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
<<<<<<< HEAD
  });
}
// ====================== MOBILE NAV TOGGLE ======================
=======
});
//Auto-Redirect After 60 Seconds

if (json.success) {
  result.innerHTML = 'Message sent! Redirecting to home in <span id="countdown">60</span>s...';
  form.reset();

  let seconds = 60;
  const countdown = setInterval(() =>{
    seconds--;
    document.getElementById('countdown').textContent = seconds;
    if (seconds <= 0) {
      clearInterval(countdown);
      window.location.href = 'https://teddyasinobi-01.github.io/jendy-jasper-ltd/'
    }
  }, 1000);
}
//Refresh The site after submission

window.addEventListener("load", function () {

  // Check if Formspree submission was successful
  if (window.location.search.includes("/thanks")) {

    // Wait 5 seconds
    setTimeout(function () {

      // Redirect to homepage
      window.location.href = "index.html";

    }, 5000);

  }

});

//Captcha cont.

const signupCaptcha = document.getElementById('signupCaptcha');

    signupCaptcha.addEventListener('verified', (e) => {
        console.log('verified event', {token: e.token});
    });
    signupCaptcha.addEventListener('error', (e) => {
        console.log('error event', {error: e.error});
    });


    
// ─── MOBILE NAV TOGGLE
>>>>>>> 67489fcc39d4cadd89278d785b38bc0f2b5a855e
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
<<<<<<< HEAD

// ====================== CLEANUP OLD CODE ======================
// All old conflicting form handlers, auto-redirects, and unused code have been removed for cleanliness.
// You can re-add specific redirect logic if needed.
=======
// CAPTCHA CONT.
const newform = document.getElementById('contact-form');

newform.addEventListener('submit', function(e) {

    const hCaptcha = newform.querySelector('textarea[name=h-captcha-response]').value;

    if (!hCaptcha) {
        e.preventDefault();
        alert("Please fill out captcha field")
        return
    }
});
//redirect
const forms = document.getElementById('contactForm');

forms.addEventListener('submit', async function(e) {
    e.preventDefault();
    const data = new FormData(forms);

    const response = await fetch(forms.action, {
      method: 'POST',
      body: data,
      headers: {'Accept':'application/json'}
    });
    if (response.ok) {
      forms.reset();
      window.location.href = 'thankyou.html'
    }else{
      alert('Something went TERRIBLY wrong, Please try again');
    }
});
>>>>>>> 67489fcc39d4cadd89278d785b38bc0f2b5a855e
