// import {  } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { initializeApp } from "[https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js](https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js)";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// ─── FIREBASE & FORM HANDLER (The Gatekeeper)
// Note: Ensure your Firebase Script Type="Module" is initialized before this or wrap this in the module
// 1. Correct Imports (Adding Firestore functions)

const firebaseConfig = {
  apiKey: "AIzaSyCkb6pQIXVyvkPN4YlX1jZBwi4w2-a1Rc4",
  authDomain: "my-website-limit.firebaseapp.com",
  projectId: "my-website-limit",
  storageBucket: "my-website-limit.firebasestorage.app",
  messagingSenderId: "658939585890",
  appId: "1:658939585890:web:e6e737e578409754f6383b",
  measurementId: "G-D87JCHQD59"
};

// 2. Initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("✅ Firebase Initialized Successfully");

const contactForm = document.getElementById('contactForm'); // Match your HTML ID
const emailInput = document.getElementById('email'); 
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // 1. STOP the form immediately
        console.log("🚀 Form Submit Triggered");
        // // 2. CAPTCHA CHECK
        // const hCaptcha = this.querySelector('textarea[name="h-captcha-response"]');
        // if (hCaptcha && !hCaptcha.value) {
        //     alert("Please complete the captcha verification");
        //     return;
        // }

        const email = emailInput.value.toLowerCase().trim();
        const docRef = doc(db, "submissions", email);
        const originalText = submitBtn.textContent;

        try {
            console.log("📡 Attempting to write to Firebase...");

            submitBtn.textContent = 'Checking...';
            submitBtn.disabled = true;

            await setDoc(docRef, { 
                count: increment(1), 
                lastUpdated: Date.now() 
              }, { merge: true });
      
              console.log("✨ Firebase Updated! Now sending email...");

            // 3. FIREBASE RATE LIMIT CHECK
            const docSnap = await getDoc(docRef);
            const now = Date.now();
            const oneHour = 60 * 60 * 1000;

            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.count >= 5 && (now - data.lastUpdated < oneHour)) {
                    const minsLeft = Math.ceil((oneHour - (now - data.lastUpdated)) / 60000);
                    alert(`Limit reached. Please try again in ${minsLeft} minutes.`);
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    return; // EXIT - DO NOT SEND
                }
            }

            // 4. IF ALLOWED, UPDATE FIREBASE
            if (!docSnap.exists() || (now - docSnap.data().lastUpdated >= oneHour)) {
                await setDoc(docRef, { count: 1, lastUpdated: now });
            } else {
                await updateDoc(docRef, { count: increment(1), lastUpdated: now });
            }

            // 5. FINALLY, SEND TO FORMSUBMIT
            submitBtn.textContent = 'Sending...';
            contactForm.submit(); // This sends the form to formsubmit.co

        } catch (error) {
            console.error("Firebase Error:", error);
            // If database fails, we let it send anyway so you don't lose customers
            contactForm.submit();
        }
        
    });
} 

// ─── MOBILE NAV TOGGLE
document.getElementById('ham').addEventListener('click', () => {
    const links = document.querySelector('.nav-links');
    links.classList.toggle('active'); // Better to use a CSS class for this!
});