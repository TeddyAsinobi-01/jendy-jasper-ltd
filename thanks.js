
    const SECONDS = 5;
    const circumference = 2 * Math.PI * 22; // 138.2
    const ring = document.getElementById('ringProgress');
    const num  = document.getElementById('countdownNum');
    let remaining = SECONDS;

    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = 0;

    const timer = setInterval(() => {
      remaining--;
      num.textContent = remaining;
      const offset = circumference * (1 - remaining / SECONDS);
      ring.style.strokeDashoffset = offset;

      if (remaining <= 0) {
        clearInterval(timer);
        window.location.href = 'index.html';
      }
    }, 1000);

    // Stop timer if user clicks the button
    document.getElementById('homeBtn').addEventListener('click', () => clearInterval(timer));

    // Floating gold particles
    function spawnParticle() {
      const p = document.createElement('div');
      p.className = 'particle';
      const x = Math.random() * window.innerWidth;
      const dx = (Math.random() - 0.5) * 80 + 'px';
      p.style.cssText = `left:${x}px; bottom:${Math.random()*30+10}%; --dx:${dx};
        animation: float ${2 + Math.random()*2}s ease-out forwards;
        width:${2+Math.random()*4}px; height:${2+Math.random()*4}px;`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 4000);
    }

    setTimeout(() => {
      for (let i = 0; i < 12; i++) setTimeout(spawnParticle, i * 120);
    }, 1400);
  