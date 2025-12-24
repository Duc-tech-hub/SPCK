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
const db = getFirestore(app);

let isLoggingIn = false;
async function updateHistory(user) {
  const historyContainer = document.getElementById("history-container");
  if (!user || !historyContainer) return;

  try {
    const historyCol = collection(db, "history", user.email, "buying_history");
    const q = query(historyCol, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    historyContainer.innerHTML = "";
    const pad = n => n.toString().padStart(2, '0');

    querySnapshot.forEach((doc) => {
      const item = doc.data();
      const d = new Date(item.timestamp);
      const timeStr = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      const dateStr = `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;

      const div = document.createElement("div");
      div.classList.add("history-item");
      div.style.padding = "10px";
      div.style.borderBottom = "1px solid #ccc";
      div.textContent = `Product: ${item.Name} - Size: ${item.Size} - Quantity: ${item.quantity} - Time: [${timeStr} ${dateStr}]`;
      historyContainer.appendChild(div);
    });
  } catch (e) {
    console.error("Lỗi load history:", e);
  }
}
async function handleBuy(sizes, quantity, errorBox, productName, successline) {
  const user = auth.currentUser;

  const checkedSizes = sizes.filter(el => el && el.checked);
  if (checkedSizes.length !== 1) {
    errorBox.textContent = checkedSizes.length === 0 ? "Choose a size!" : "Only one size allowed!";
    return;
  }

  const sizeMapping = ["S", "M", "L"];
  const sizeIndex = sizes.findIndex(el => el.checked);
  const size = sizeMapping[sizeIndex];

  try {
    const historyCol = collection(db, "history", user.email, "buying_history");
    await addDoc(historyCol, {
      Name: productName,
      Size: size,
      quantity: quantity.value,
      timestamp: Date.now(),
      action: "Purchase"
    });

    errorBox.textContent = "";
    successline.textContent = "Successful";
    updateHistory(user);
  } catch (e) {
    console.error("Ghi lỗi:", e);
    errorBox.textContent = "Database error!";
  }
}
document.addEventListener("DOMContentLoaded", () => {
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
      const names = ["Emerald Luxe", "Ivory Royale", "Crimson Classic", "Champagne Elegance", "Rosé Charm", "Granite Moderno", "Sapphire Relaxa", "Olive Haven", "Pearl Serenity", "Amber Glow", "Charcoal Grace", "Midnight Comfort"];

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        handleBuy(sizes, qty, err, names[i - 1], success);
      });
    }
  }
});
onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname.toLowerCase();
  const isAtLogin = path.includes("index.html") || path === "/" || path === "";

  if (user) {
    if (isAtLogin && !isLoggingIn) {
      window.location.replace("home.html");
    }
    updateHistory(user);
  } else {
    const protectedPages = ["history.html"];
    if (protectedPages.some(p => path.includes(p))) {
      window.location.replace("403.html");
    }
  }
});