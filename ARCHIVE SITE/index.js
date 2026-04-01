
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // ── Scroll Animation Observer ──
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Optional: stop observing after shown (better perf)
          // observer.unobserve(entry.target);
        }
        // Optional: remove class when out of view (for repeat animation)
        // else {
        //   entry.target.classList.remove('visible');
        // }
      });
    }, {
      threshold: 0.12,          // trigger when \~12% visible
      rootMargin: "0px 0px -80px 0px"  // slight earlier trigger
    });

    // Observe all animated sections
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwcUSh8Uw8Nsw2rE99Mo5Fc2yk11GS7Ihcm578tIzDVdMbJFVdN8h-v0XBs05gxt0Gt/exec'
const form = document.forms['submit-to-google-sheet']
const msg = document.getElementById("msg")
form.addEventListener('submit', e => {
    e.preventDefault()
    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(response => {
            msg.innerHTML = "Message Submitted ✌🤙"
            setTimeout(function () {
                msg.innerHTML = ""
            }, 5000)
            form.reset()
        })
        .catch(error => console.error('Error!', error.message))
})