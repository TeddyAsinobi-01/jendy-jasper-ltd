import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ─── MOBILE NAV TOGGLE
const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.nav-links');

if (menu && menuLinks) {
    menu.addEventListener('click', function () {
        menu.classList.toggle('is-active');
        menuLinks.classList.toggle('active');
    }); 
}

// ─── REVEAL ON SCROLL
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ─── FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCkb6pQIXVyvkPN4YlX1jZBwi4w2-a1Rc4",
  authDomain: "my-website-limit.firebaseapp.com",
  projectId: "my-website-limit",
  storageBucket: "my-website-limit.firebasestorage.app",
  messagingSenderId: "658939585890",
  appId: "1:658939585890:web:e6e737e578409754f6383b",
  measurementId: "G-D87JCHQD59"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("✅ [STAGE 1] Firebase initialized successfully");

const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

if (!contactForm) console.error("❌ [STAGE 1] contactForm element not found in DOM");
if (!submitBtn)  console.error("❌ [STAGE 1] submitBtn element not found in DOM");

// ─── IP FETCH HELPER
async function fetchIP() {
    console.log("🌐 [STAGE 2] Fetching IP from api.ipify.org...");
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        console.log("✅ [STAGE 2] IP fetched successfully:", data.ip);
        return data.ip || 'unknown';
    } catch (err) {
        console.error("❌ [STAGE 2] Failed to fetch IP:", err);
        return 'unknown';
    }
}

// ─── FORM HANDLER
if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        console.log("🚀 [STAGE 3] Form submit triggered — default prevented");

        // 1. Check hCaptcha safely to insulate from browser extensions
        let hcaptchaResponse = null;
        try {
            if (typeof hcaptcha !== 'undefined') {
                hcaptchaResponse = hcaptcha.getResponse();
            }
        } catch (captchaErr) {
            console.warn("Non-critical captcha listener warning caught safely.");
        }

        if (!hcaptchaResponse) {
            alert("Please complete the captcha");
            return;
        }

        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Checking...';
        submitBtn.disabled = true;

        // 2. Fetch IP & Setup Firestore references
        const ip = await fetchIP();
        const safeIP = ip.replace(/\./g, '_').trim();
        const docRef = doc(db, "submissions", safeIP);

        const now = Date.now();
        const oneHour = 60 * 60 * 1000;
        
        try {
            console.log("📖 Checking Firestore rate limit...");
            const docSnap = await getDoc(docRef);
            let data = docSnap.exists() ? docSnap.data() : null;
        
            let count = data?.count || 0;
            let lastUpdated = data?.lastUpdated || 0;
        
            // Reset window if more than 1 hour passed
            if (now - lastUpdated >= oneHour) {
                count = 0;
                lastUpdated = now;
            }
        
            console.log("Current count:", count);
        
            // 🚫 LIMIT = 6 PER HOUR
            if (count >= 6) {
                const minsLeft = Math.ceil((oneHour - (now - lastUpdated)) / 60000);
                alert(`Limit reached. Try again in ${minsLeft} minutes.`);
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return; 
            }
        
            // Update Firestore log
            await setDoc(docRef, {
                count: count + 1,
                lastUpdated: now
            });
        
            console.log("✅ Rate limit check passed — sending form data...");
            submitBtn.textContent = 'Sending...';

            // 3. Fire the Web3Forms AJAX Request (Fixed 'form' reference to 'contactForm')
            const formData = new FormData(contactForm);
            
            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData,
                    keepalive: true // Protect connection stability
                });

                const resData = await response.json();

                if (response.ok) {
                    alert("Success! Your message has been sent.");
                    contactForm.reset();
                    if (typeof hcaptcha !== 'undefined') hcaptcha.reset(); // Reset captcha visually
                } else {
                    alert("Error: " + (resData.message || "Submission failed."));
                }

            } catch (error) {
                console.error("Web3Forms Fetch Error:", error);
                alert("Something went wrong with the email server. Please try again.");
            }

        } catch (firestoreError) {
            console.error("Firestore database error:", firestoreError);
            alert("Database connection failed. Please try again.");
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}