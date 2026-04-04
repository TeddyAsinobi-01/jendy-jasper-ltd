
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
const form = document.getElementsByTagName('form');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    formData.append("access_key", "a581fc14-460b-4a42-83dc-9dae7bf467b9");

    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            alert("Success! Your message has been sent.");
            form.reset();
        } else {
            alert("Error: " + data.message);
        }

    } catch (error) {
        alert("Something went wrong. Please try again.");
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
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
//Captcha cont.

const signupCaptcha = document.getElementById('signupCaptcha');

    signupCaptcha.addEventListener('verified', (e) => {
        console.log('verified event', {token: e.token});
    });
    signupCaptcha.addEventListener('error', (e) => {
        console.log('error event', {error: e.error});
    });

// ─── MOBILE NAV TOGGLE
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