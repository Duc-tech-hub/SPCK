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


const STORAGE_KEY = 'sofa_cart_history';

const getCartItems = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

const saveToLocal = (item) => {
    const items = getCartItems();
    items.push(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

async function handleBuy(sizes, quantity, errorBox, productName, successline) {
    if (errorBox) errorBox.textContent = "";
    if (successline) successline.textContent = "";

    const checkedSizes = sizes.filter(el => el && el.checked);

    if (checkedSizes.length !== 1) {
        if (errorBox) {
            errorBox.style.color = "red";
            errorBox.textContent = checkedSizes.length === 0 ? "Choose a size!" : "Only one size allowed!";
        }
        return;
    }

    const sizeMapping = ["S", "M", "L"];
    const sizeIndex = sizes.findIndex(el => el && el.checked);
    const size = sizeMapping[sizeIndex];

    const newItem = {
        Name: productName,
        Size: size,
        quantity: quantity ? quantity.value : 1,
        timestamp: Date.now()
    };

    saveToLocal(newItem);

    if (errorBox) errorBox.textContent = "";
    if (successline) {
        successline.style.color = "green";
        successline.textContent = "Successful";
    }

    renderCart();
}

const renderCart = () => {
    const container = document.getElementById("cont");
    const payButton = document.getElementById("redirect");

    if (!container || !payButton) return;

    const items = getCartItems();
    payButton.style.display = items.length > 0 ? "block" : "none";
    const oldItems = container.querySelectorAll(".cart-item-row");
    oldItems.forEach(el => el.remove());
    items.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "cart-item-row d-flex justify-content-between border-bottom p-2 mb-2";
        div.innerHTML = `
            <span><strong>${item.Name}</strong> (${item.Size}) x ${item.quantity}</span>
            <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">X</button>
        `;
        container.insertBefore(div, payButton);
    });

    container.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const idx = this.getAttribute("data-index");
            let currentItems = getCartItems();
            currentItems.splice(idx, 1);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(currentItems));
            renderCart();
        });
    });
};

document.addEventListener("DOMContentLoaded", () => {
    const names = ["Emerald Luxe", "Ivory Royale", "Crimson Classic", "Champagne Elegance", "Rosé Charm", "Granite Moderno", "Sapphire Relaxa", "Olive Haven", "Pearl Serenity", "Amber Glow", "Charcoal Grace", "Midnight Comfort"];

    for (let i = 1; i <= 12; i++) {
        const btn = document.querySelector(`#buttonbuy${i}`);
        if (btn) {
            const sizes = [
                document.querySelector(`#sizescheckbox${i}`),
                document.querySelector(`#sizemcheckbox${i}`),
                document.querySelector(`#sizelcheckbox${i}`)
            ];
            const qty = document.querySelector(`#number${i}`);
            const err = document.querySelector(`#errorcheck${i}`);
            const success = document.querySelector(`#successlinep${i}`);

            btn.addEventListener("click", (e) => {
                e.preventDefault();
                handleBuy(sizes, qty, err, names[i - 1], success);
            });
        }
    }
    renderCart();

    const payButton = document.getElementById("redirect");
    if (payButton) {
        payButton.addEventListener("click", () => {
            window.location.href = '../html/pay-form.html';
        });
    }
});