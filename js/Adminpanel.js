import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

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

const checkAuth = () => {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
};
(async () => {
    const user = await checkAuth();

    const path = window.location.pathname.toLowerCase();
    const protectedPages = ["/adminpanel.html"];
    const isProtected = protectedPages.some(p => path.endsWith(p));

    if (!user && isProtected) {
        window.location.href = "../html/../html/403.html";
        return;
    }
    const name = auth.currentUser.email
    if (name !== "duck.sssop0356@gmail.com") {
        window.location.href = "../html/../html/403_2.html"
    }
})();