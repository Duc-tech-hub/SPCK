import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { 
    getFirestore, getDoc, doc, setDoc, collection, addDoc, deleteDoc, onSnapshot 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { 
    getAuth, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

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
let isLoggingin = false; 
let globalUser = null;
const STORAGE_KEY = 'sofa_cart_history';
const checkSecurity = () => {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            unsubscribe();
            if (user) {
                globalUser = user;
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists() && userDoc.data().is_disabled === true) {
                        alert("Your account has been locked!");
                        await signOut(auth);
                        window.location.replace("../html/403.html");
                        return resolve(null);
                    }
                } catch (error) { console.error(error); }
            }
            resolve(user);
        });
    });
};
const startListeningAdmin = (email) => {
    const adminDocRef = doc(db, "history", email, "admin_verify", "status");
    const confirmBtn = document.getElementById("confirmed-sent");
    const note = document.getElementById("note");

    const unsub = onSnapshot(adminDocRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.is_confirmed === true) {
                alert("Admin has verified your payment! Thank you.");
                const finalPayBtn = document.getElementById("final-payment-btn");
                if (finalPayBtn) finalPayBtn.style.display = "block";
                window.location.href = "../html/home.html"; 
                unsub();
            } 
            else if (data.is_rejected === true) {
                alert("Your request was rejected by Admin. Please check again.");
                window.location.replace("../html/home.html");
                if (note) {
                    note.textContent = "Request rejected. Please try again or contact support.";
                    note.style.color = "red";
                }
                if (confirmBtn) confirmBtn.style.display = "block";
                
                unsub();
            }
        }
    });
};

const handleConfirmRequest = async (user) => {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return alert("No products in cart!"), window.location.replace("../html/home.html"), false;

    try {
        const items = JSON.parse(rawData);
        const historyCol = collection(db, "history", user.email, "buying_history");
        for (const item of items) {
            await addDoc(historyCol, { ...item, timestamp: Date.now() });
        }
        const adminStatusDoc = doc(db, "history", user.email, "admin_verify", "status");
        await setDoc(adminStatusDoc, { 
            is_confirmed: false, 
            is_rejected: false,
            createdAt: Date.now() 
        });

        return true;
    } catch (e) { return false; }
};

(async () => {
    const user = await checkSecurity();
    if (!user) {
        window.location.replace("../html/403.html");
        return;
    }

    const recheckBtn = document.getElementById("recheck");
    const confirmBtn = document.getElementById("confirmed-sent");
    const note = document.getElementById("note");
    const finalPayBtn = document.getElementById("final-payment-btn");

    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'login' });

    if (recheckBtn) {
        recheckBtn.addEventListener("click", async () => {
            try {
                isLoggingin = true;
                const result = await signInWithPopup(auth, googleProvider);
                globalUser = result.user;
                recheckBtn.querySelector("p").textContent = "Verified ✓";
                recheckBtn.disabled = true;
                if (confirmBtn) {
                    confirmBtn.disabled = false;
                    confirmBtn.style.opacity = "1";
                }
            } catch (e) { console.error(e); } finally { isLoggingin = false; }
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            const success = await handleConfirmRequest(globalUser || user);
            if (success) {
                confirmBtn.style.display = "none";
                if (note) {
                    note.style.display = "block";
                    note.textContent = "Waiting for Admin to verify...";
                    note.style.color = "black";
                }
                localStorage.removeItem(STORAGE_KEY);
                startListeningAdmin((globalUser || user).email);
            }
        });
    }

    if (finalPayBtn) {
        finalPayBtn.addEventListener("click", async () => {
            try {
                const adminStatusDoc = doc(db, "history", user.email, "admin_verify", "status");
                await deleteDoc(adminStatusDoc);
                alert("Payment completed!");
                window.location.replace("../html/home.html");
            } catch (e) { console.error(e); }
        });
    }
})();