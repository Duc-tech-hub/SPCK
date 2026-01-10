import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getDoc, doc, getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCIHNJ6L76q7gFLP5czgX3noz--Wp23JNE",
    authDomain: "sofasdemostudu.firebaseapp.com",
    projectId: "sofasdemostudu",
    storageBucket: "sofasdemostudu.firebasestorage.app",
    messagingSenderId: "59504721413",
    appId: "1:59504721413:web:4444e1502f63775e1a666c",
    measurementId: "G-LVFN05YB7R"
};
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
let isLoggingIn = false;

const checkSecurity = () => {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            unsubscribe();
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists() && userDoc.data().is_disabled === true) {
                        alert("Your account has been locked!");
                        await signOut(auth);
                        window.location.replace("../html/403.html");
                        return resolve(null);
                    }
                } catch (error) {
                    console.error("Security Check Error:", error);
                }
            }
            resolve(user);
        });
    });
};

(async () => {
    const user = await checkSecurity();
    const path = window.location.pathname.toLowerCase();
    const protectedFiles = ["product1.html", "product2.html", "product3.html", "product4.html", "product5.html", "product6.html", "product7.html", "product8.html", "product9.html", "product10.html", "product11.html", "product12.html"];
    const isProtected = protectedFiles.some(file => path.includes(file));
    const isLoginPage = path.endsWith("index.html") || path.endsWith("/") || path === "";
    if (isProtected && !user) {
        window.location.replace("../html/403.html");
        return;
    }

    if (user && isLoginPage) {
        if (!isLoggingIn) {
            window.location.replace("home.html");
            return;
        }
    }
    const nameElement = document.querySelector("#inputinfo_username");
    if (user && nameElement) nameElement.textContent = user.email;
})();

document.addEventListener("DOMContentLoaded", () => {

    const address = document.querySelector("#address");
    const suggestions = document.querySelector("#address-suggestions");

    address.addEventListener("input", async () => {
        const query = address.value.trim();
        if (query.length < 3) {
            suggestions.innerHTML = "";
            return;
        }
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=vn`);
        const results = await response.json();
        suggestions.innerHTML = "";
        results.forEach(result => {
            const div = document.createElement("div");
            div.textContent = result.display_name;
            div.style.cursor = "pointer";
            div.addEventListener("click", () => {
                address.value = result.display_name;
                suggestions.innerHTML = "";
            });
            suggestions.appendChild(div);
        });
    });
});