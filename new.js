import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// ─── MOBILE NAV TOGGLE
const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.nav-links');

menu.addEventListener('click', function () {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
}); 

// ─── REVEAL ON SCROLL
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ─── FIREBASE & FORM HANDLER (The Gatekeeper)
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

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        console.log("🚀 [STAGE 3] Form submit triggered");

        // ─────────────────────────────
        // hCaptcha Validation
        // ─────────────────────────────
        const hcaptchaResponse = hcaptcha.getResponse();

        if (!hcaptchaResponse) {
            alert("Please complete the captcha");
            return;
        }

        // ─────────────────────────────
        // Button Loading State
        // ─────────────────────────────
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Checking...';
        submitBtn.disabled = true;

        try {

            // ─────────────────────────────
            // FETCH USER IP
            // ─────────────────────────────
            const ip = await fetchIP();
            const safeIP = ip.replace(/\./g, '_');

            console.log("🌐 User IP:", ip);

            const docRef = doc(db, "submissions", safeIP);

            // ─────────────────────────────
            // FIRESTORE RATE LIMIT CHECK
            // ─────────────────────────────
            const docSnap = await getDoc(docRef);

            const now = Date.now();
            const oneHour = 60 * 60 * 1000;

            let count = 0;
            let lastUpdated = now;

            if (docSnap.exists()) {
                const data = docSnap.data();

                count = data.count || 0;
                lastUpdated = data.lastUpdated || now;

                console.log("📖 Existing Count:", count);

                // Reset count after 1 hour
                if (now - lastUpdated >= oneHour) {
                    count = 0;
                    lastUpdated = now;
                }
            }

            // ─────────────────────────────
            // RATE LIMIT BLOCK
            // ─────────────────────────────
            if (count >= 5) {
                const minsLeft = Math.ceil(
                    (oneHour - (now - lastUpdated)) / 60000
                );

                alert(`Limit reached. Try again in ${minsLeft} minutes.`);

                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                return;
            }

            // ─────────────────────────────
            // UPDATE FIRESTORE ONLY ONCE
            // ─────────────────────────────
            await setDoc(docRef, {
                count: count + 1,
                lastUpdated: now
            });

            console.log("✅ Rate limit passed");

            // ─────────────────────────────
            // SEND FORM TO FORMSUBMIT
            // ─────────────────────────────
            submitBtn.textContent = 'Sending...';

            const formData = new FormData(contactForm);

            formData.append(
                "h-captcha-response",
                hcaptcha.getResponse()
            );

            const response = await fetch(
                "https://formsubmit.co/ajax/ibonisaledu@gmail.com",
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            const resData = await response.json();

            // ─────────────────────────────
            // SUCCESS
            // ─────────────────────────────
            if (response.ok) {

                console.log("✅ FormSubmit Success:", resData);

                window.location.href = "/jendy-jasper-ltd/thanks.html";

                contactForm.reset();

                if (typeof hcaptcha !== 'undefined') {
                    hcaptcha.reset();
                }

            } else {

                console.error("❌ FormSubmit Error:", resData);

                alert(
                    "Error: " +
                    (resData.message || "Submission failed.")
                );
            }

        } catch (error) {

            console.error("❌ Runtime Error:", error);

            alert("Error sending form. Please try again later.");

        } finally {

            // ─────────────────────────────
            // RESTORE BUTTON
            // ─────────────────────────────
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}