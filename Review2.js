import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

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
const db = getFirestore(app);

addEventListener("DOMContentLoaded", async () => {
    const check = JSON.parse(localStorage.getItem("check403"))
    if (check === false) {
        window.location.href = "../SPCK/403.html"
    }
    const commentsContainer = document.querySelector("#comments-container");
    const pad = n => n.toString().padStart(2, '0');

    commentsContainer.innerHTML = '<div class="loading">Loading comments...</div>';

    const q = query(collection(db, "comments"), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);

    commentsContainer.innerHTML = '';

    if (querySnapshot.empty) {
        commentsContainer.innerHTML = '<div class="no-comments">No comments yet.</div>';
        return;
    }

    querySnapshot.forEach(doc => {
        const item = doc.data();
        const d = item.date && typeof item.date.toDate === "function"
            ? item.date.toDate()
            : (item.date ? new Date(item.date) : new Date());

        const date = pad(d.getDate());
        const month = pad(d.getMonth() + 1);
        const year = d.getFullYear();

        const div = document.createElement("div");
        div.classList.add("comment");
        div.innerHTML = `
            <div class="author">${item.name ? item.name.replace(/</g, "&lt;") : "Anonymous"}</div>
            <div class="date">${date}/${month}/${year}</div>
            <div class="product">Reviewed: ${item.product ? item.product.replace(/</g, "&lt;") : "N/A"}</div>
            <div class="rating">${"⭐".repeat(Math.max(0, Math.min(5, item.stars || 0)))}</div>
            <div class="text">${item.text ? item.text.replace(/</g, "&lt;") : ""}</div>
        `;
        commentsContainer.appendChild(div);
    });
});