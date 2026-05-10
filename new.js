import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


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
        const form = e.target;

        const hcaptchaResponse = hcaptcha.getResponse();
    
        if (!hcaptchaResponse) {
            alert("Please complete the captcha");
            return;
        }
    
        const formData = new FormData(form);
    
        try {
    
            const response = await fetch("https://formsubmit.co/ajax/ibonisaledu@gmail.com", {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json"
                }
            });
    
            if (response.ok) {
                alert("Message sent successfully");
                form.reset();
                hcaptcha.reset();
            } else {
                alert("Something went wrong");
            }
    
        } catch (error) {
            alert("Error sending form");
        }//hcaptcha end
    
        console.log("🚀 [STAGE 3] Form submit triggered — default prevented");

        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Checking...';
        submitBtn.disabled = true;

        // ─── FETCH IP
        const ip = await fetchIP();
        const safeIP = ip.replace(/\./g, '_');
        console.log("🔑 [STAGE 3] Safe Firestore document ID:", safeIP);

        const docRef = doc(db, "submissions", safeIP);

        try {
            // ─── STAGE 4: Initial write
            console.log("📡 [STAGE 4] Writing initial increment to Firestore...");
            await setDoc(docRef, { 
                count: increment(1), 
                lastUpdated: Date.now() 
            }, { merge: true });
            console.log("✅ [STAGE 4] Firestore write successful");

            // ─── STAGE 5: Read back the document
            console.log("📖 [STAGE 5] Reading document back from Firestore...");
            const docSnap = await getDoc(docRef);
            const now = Date.now();
            const oneHour = 60 * 60 * 1000;

            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log("✅ [STAGE 5] Document found — count:", data.count, "| lastUpdated:", new Date(data.lastUpdated).toLocaleTimeString());

                // ─── STAGE 6: Rate limit check
                console.log("🔍 [STAGE 6] Checking rate limit...");
                if (data.count >= 5 && (now - data.lastUpdated < oneHour)) {
                    const minsLeft = Math.ceil((oneHour - (now - data.lastUpdated)) / 60000);
                    console.warn("🚫 [STAGE 6] Rate limit hit — blocking submission. Minutes left:", minsLeft);
                    alert(`Limit reached. Please try again in ${minsLeft} minutes.`);
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    return;
                }
                console.log("✅ [STAGE 6] Rate limit not hit — proceeding");
            } else {
                console.log("ℹ️ [STAGE 5] No existing document found — first submission from this IP");
            }

            // ─── STAGE 7: Update Firestore with correct count
            console.log("📝 [STAGE 7] Updating Firestore with final count...");
            if (!docSnap.exists() || (now - docSnap.data().lastUpdated >= oneHour)) {
                console.log("🔄 [STAGE 7] Resetting count to 1 (new or expired window)");
                await setDoc(docRef, { count: 1, lastUpdated: now });
            } else {
                console.log("➕ [STAGE 7] Incrementing count within existing window");
                await updateDoc(docRef, { count: increment(1), lastUpdated: now });
            }
            console.log("✅ [STAGE 7] Firestore update complete");

            // ─── STAGE 8: Hand off to FormSubmit
            console.log("📨 [STAGE 8] All checks passed — submitting form to FormSubmit...");
            submitBtn.textContent = 'Sending...';
            contactForm.submit();

        } catch (error) {
            console.error("❌ [CATCH] Firebase error at runtime:", error);
            console.warn("⚠️ [CATCH] Bypassing rate limiter and submitting anyway to avoid losing the lead");
            contactForm.submit();
        }

    });
}