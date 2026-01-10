import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { 
    getFirestore, getDoc, doc, collection, getDocs 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { 
    getAuth, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// --- 1. CONFIG ---
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
const renderHistory = async (email) => {
    const container = document.getElementById("history-container");
    if (!container) return;

    container.innerHTML = "<p class='text-center'>Loading history...</p>";

    try {
        const historyCol = collection(db, "history", email, "buying_history");
        const snapshot = await getDocs(historyCol);

        if (snapshot.empty) {
            container.innerHTML = "<p class='text-center text-muted'>No purchase history found.</p>";
            return;
        }
        let historyData = [];
        snapshot.forEach(doc => {
            historyData.push(doc.data());
        });
        historyData.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        container.innerHTML = "";

        historyData.forEach((item) => {
            const dateStr = item.timestamp ? new Date(item.timestamp).toLocaleString('vi-VN') : "N/A";
            container.innerHTML += `
                <div class="card mb-3 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="card-title mb-1">${item.Name || "Unknown Product"}</h5>
                            <span class="badge bg-success">Purchased</span>
                        </div>
                        <p class="card-text mb-1 text-secondary">Size: ${item.Size || "Standard"}</p>
                        <div class="d-flex justify-content-between">
                            <span>Quantity: <strong>${item.quantity || 1}</strong></span>
                            <small class="text-muted">${dateStr}</small>
                        </div>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error("Firestore Error:", error);
        container.innerHTML = `<p class='text-danger text-center'>Error loading data: ${error.message}</p>`;
    }
};
const checkSecurity = () => {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            unsubscribe();
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists() && userDoc.data().is_disabled === true) {
                        alert("Account Locked!");
                        await signOut(auth);
                        window.location.replace("../html/403.html");
                        return resolve(null);
                    }
                } catch (e) { console.error(e); }
            }
            resolve(user);
        });
    });
};
(async () => {
    const user = await checkSecurity();
    if (user) {
        renderHistory(user.email);
    } else {
        window.location.replace("index.html");
    }
})();