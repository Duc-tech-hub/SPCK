import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
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
let isSelectMode = false;
let users = [];

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
    if (name !== "duck.sssop0356@gmail.com" && name !== "sangntp.stommy@mindx.net.vn") {
        window.location.href = "../html/../html/403_2.html"
    }
})();
const loadUsersToBox = () => {
    const container = document.querySelector('#output-box-accouts');
    if (!container) return;
    onSnapshot(collection(db, "users"), (snapshot) => {
        container.innerHTML = "";

        users = []

        snapshot.forEach((doc) => {
            const user = doc.data();
            users.push(user.email);
            const userBox = document.createElement("div");
            const checkboxHTML = isSelectMode
                ? `<input type="checkbox" class="user-checkbox" value="${doc.id}" style="width: 20px; height: 20px; margin-right: 15px; cursor: pointer;">`
                : "";
            userBox.style.cssText = `
                border: 1px solid #ccc; 
                padding: 15px; 
                margin: 10px; 
                border-radius: 8px; 
                display: inline-block; 
                min-width: 180px;
                background-color: #fff;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            `;

            userBox.innerHTML = `
    <div style="display: flex; align-items: center; padding: 5px;">
        ${checkboxHTML} 
        <div>
            <strong style="display: block; color: #2c3e50; margin-bottom: 5px;">${user.email}</strong>
            <p style="margin: 0; font-size: 0.8rem; color: ${user.is_disabled ? 'red' : '#666'};">
                ${user.is_disabled ? '🚫 Account Disabled' : `Last login: ${user.lastLogin}`}
            </p>
        </div>
    </div>
`;

            container.appendChild(userBox);
        });
    });
};
document.querySelector('#form-account').addEventListener('submit', (e) => {
    e.preventDefault();
    const keyword = document.querySelector('#search-account').value.toLowerCase().trim();
    const container = document.querySelector('#output-box-accouts');
    const userBoxes = container.querySelectorAll('div[style*="border: 1px solid"]');

    userBoxes.forEach((box) => {
        const emailTag = box.querySelector('strong');

        if (emailTag) {
            const emailValue = emailTag.textContent.toLowerCase();
            if (emailValue.includes(keyword)) {
                box.style.display = "inline-block";
            } else {
                box.style.display = "none";
            }
        }
    });
});
document.querySelector('#search-account').addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase().trim();
    const container = document.querySelector('#output-box-accouts');
    const userBoxes = container.querySelectorAll('div[style*="border: 1px solid"]');

    userBoxes.forEach((box) => {
        const emailTag = box.querySelector('strong');

        if (emailTag) {
            const emailValue = emailTag.textContent.toLowerCase();
            if (emailValue.includes(keyword)) {
                box.style.display = "inline-block";
            } else {
                box.style.display = "none";
            }
        }
    });
});
document.querySelector('#select-account').addEventListener('click', (e) => {
    isSelectMode = !isSelectMode;

    const disableBtn = document.querySelector('#disable-account');
    const enableBtn = document.querySelector('#enable-account');
    if (isSelectMode) {
        e.target.textContent = "Cancel";
        disableBtn.style.display = "inline-block";
        enableBtn.style.display = "inline-block";
    } else {
        e.target.textContent = "Select";
        disableBtn.style.display = "none";
        enableBtn.style.display = "none";
    }

    loadUsersToBox();
});
loadUsersToBox();
document.querySelector('#disable-account').addEventListener('click', async () => {
    const selectedCheckboxes = document.querySelectorAll('.user-checkbox:checked');

    if (selectedCheckboxes.length === 0) {
        alert("You have to choose an account");
        return;
    }

    if (confirm(`Are you sure you want to lock ${selectedCheckboxes.length} account(s)?`)) {
        try {
            for (const cb of selectedCheckboxes) {
                const userId = cb.value;
                const userRef = doc(db, "users", userId);

                await updateDoc(userRef, {
                    is_disabled: true
                });
            }
            alert("Lock successfully");
            resetSelectMode();
        } catch (error) {
            console.error("Lỗi khi disable:", error);
        }
    }
});
document.querySelector('#enable-account').addEventListener('click', async () => {
    const selectedCheckboxes = document.querySelectorAll('.user-checkbox:checked');

    if (selectedCheckboxes.length === 0) {
        alert("You have to choose an account");
        return;
    }

    if (confirm(`Unlock ${selectedCheckboxes.length} account(s)?`)) {
        try {
            for (const cb of selectedCheckboxes) {
                const userId = cb.value;
                const userRef = doc(db, "users", userId);

                await updateDoc(userRef, {
                    is_disabled: false
                });
            }
            alert("Unlock successfully!");
            resetSelectMode();
        } catch (error) {
            console.error("Lỗi khi enable:", error);
        }
    }
});
function resetSelectMode() {
    isSelectMode = false;
    const selectBtn = document.querySelector('#select-account');
    const disableBtn = document.querySelector('#disable-account');
    const enableBtn = document.querySelector('#enable-account');

    selectBtn.textContent = "Select";
    disableBtn.style.display = "none";
    enableBtn.style.display = "none";
    loadUsersToBox();
}