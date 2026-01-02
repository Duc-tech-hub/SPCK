import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
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
    const protectedFiles = ["cart.html"];
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
    const redirectb = document.querySelector("#redirect");
    redirectb.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "../html/../html/pay-form.html"
    })
});