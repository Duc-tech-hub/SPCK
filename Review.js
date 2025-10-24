import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

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

document.addEventListener("DOMContentLoaded", async () => {
    const check = JSON.parse(localStorage.getItem("check403"))
    if (check === false) {
        window.location.href = "../SPCK/403.html"
    }
    const form = document.querySelector("#reviewform");
    const inputs = Array.from(document.querySelectorAll("input[type=checkbox][id^='checkp']"));
    const stars = Array.from(document.querySelectorAll("input[type=checkbox][name='stars']"));
    const commentList = document.querySelector("#comment-list");
    const combutton = document.querySelector("#combutton");
    const comment = document.querySelector("#comment");
    const error1 = document.querySelector("#errorcheckp");
    const error2 = document.querySelector("#errorstars");
    const error3 = document.querySelector("#errorcomment");
    const successline = document.querySelector("#successline");
    const nocom = document.querySelector("#nocomment");
    const pad = n => n.toString().padStart(2, '0');

    error1.textContent = "";
    error2.textContent = "";
    error3.textContent = "";
    successline.textContent = "";
    if (nocom) nocom.textContent = "";

    commentList.innerHTML = "";
    const q = query(collection(db, "comments"), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        nocom.textContent = "There's no comment yet.";
        combutton.classList.remove("combutton1");
        combutton.classList.add("combutton");
    } else {
        combutton.classList.remove("combutton");
        combutton.classList.add("combutton1");

        let shown = 0;
        querySnapshot.forEach(doc => {
            if (shown >= 2) return;
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
                <div class="author">${item.name.replace(/</g, "&lt;")}</div>
                <div class="date">${date}/${month}/${year}</div>
                <div class="product">Reviewed: ${item.product ? item.product.replace(/</g, "&lt;") : "N/A"}</div>
                <div class="rating">${"⭐".repeat(Math.max(0, Math.min(5, item.stars || 0)))}</div>
                <div class="text">${item.text ? item.text.replace(/</g, "&lt;") : ""}</div>
            `;
            commentList.appendChild(div);
            shown++;
        });
    }

    if (combutton) {
        combutton.style.display = "inline-block";
        combutton.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "../SPCK/comments.html";
        });
    }

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            error1.textContent = "";
            error2.textContent = "";
            error3.textContent = "";
            successline.textContent = "";

            const comment1 = comment.value.trim();
            const checkinput = inputs.filter(el => el.checked);
            const checkstar = stars.filter(el => el.checked);
            const wordCount = comment1.split(/\s+/).length;

            if (checkinput.length === 0) {
                error1.textContent = "You have to choose a product option to review.";
                return;
            }
            if (checkinput.length > 1) {
                error1.textContent = "You can only choose one product option.";
                return;
            }
            if (checkstar.length === 0) {
                error2.textContent = "You have to choose one of the star options.";
                return;
            }
            if (checkstar.length > 1) {
                error2.textContent = "You can only choose one star option.";
                return;
            }
            if (comment1.length === 0) {
                error3.textContent = "You haven't right a commend yet.";
                return;
            }
            if (wordCount >= 200) {
                error3.textContent = "Your comment was too long. A comment should be under 200 words.";
                return;
            }

            const now = new Date();
            await addDoc(collection(db, "comments"), {
                name: localStorage.getItem("current_user"),
                date: now,
                product: checkinput[0].value,
                stars: parseInt(checkstar[0].value),
                text: comment1
            });

            successline.textContent = "Comment created successfully.";
            commentList.innerHTML = "";
            const q2 = query(collection(db, "comments"), orderBy("date", "desc"));
            const querySnapshot2 = await getDocs(q2);

            if (querySnapshot2.empty) {
                nocom.textContent = "There's no comment yet.";
                combutton.classList.remove("combutton1");
                combutton.classList.add("combutton");
            } else {
                combutton.classList.remove("combutton");
                combutton.classList.add("combutton1");

                let shown = 0;
                querySnapshot2.forEach(doc => {
                    if (shown >= 2) return;
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
                        <div class="author">${item.name.replace(/</g, "&lt;")}</div>
                        <div class="date">${date}/${month}/${year}</div>
                        <div class="product">Reviewed: ${item.product ? item.product.replace(/</g, "&lt;") : "N/A"}</div>
                        <div class="rating">${"⭐".repeat(Math.max(0, Math.min(5, item.stars || 0)))}</div>
                        <div class="text">${item.text ? item.text.replace(/</g, "&lt;") : ""}</div>
                    `;
                    commentList.appendChild(div);
                    shown++;
                });
            }

            comment.value = "";
            if (checkinput[0]) checkinput[0].checked = false;
            if (checkstar[0]) checkstar[0].checked = false;
        });
    }
});