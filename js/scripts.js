import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore, getDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

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
const googleProvider = new GoogleAuthProvider();
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
    const protectedFiles = ["search.html", "userinfo.html"];
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
    const googleMethodButton = document.querySelector("#googlemethod");
    const form5 = document.querySelector("#formsearch");
    const productsearch = document.querySelector("#product")
    const logoutbutton = document.querySelector("#logoutbutton")
    const searchinput = document.querySelector("#search");
    const textsearch = document.querySelector("#text");
    const imgresult = document.querySelector("#img-result");
    const textresult = document.querySelector("#product-result");

    if (googleMethodButton) {
        googleMethodButton.addEventListener("click", () => {
            isLoggingIn = true;
            signInWithPopup(auth, googleProvider)
                .then(async (result) => {
                    const user = result.user;
                    console.log("LOGIN THÀNH CÔNG!", user.email);
                    try {
                        const userDoc = await getDoc(doc(db, "users", user.uid));
                        if (userDoc.exists() && userDoc.data().is_disabled === true) {
                            alert("Your account has been locked!");
                            await signOut(auth);
                            isLoggingIn = false;
                            return;
                        }
                        await setDoc(doc(db, "users", user.uid), {
                            email: user.email,
                            lastLogin: new Date().toLocaleString('vi-VN')
                        }, { merge: true });

                        window.location.href = "../html/home.html";

                    } catch (e) {
                        console.error("Lỗi khi kiểm tra user:", e);
                        alert("System error. Please try again.");
                        await signOut(auth);
                    }

                })
                .catch((error) => {
                    console.error("LỖI LOGIN:", error.code, error.message);
                    alert("Login with Google failed");
                    isLoggingIn = false;
                });
        });
    }
    if (logoutbutton) {
        logoutbutton.addEventListener("click", (e) => {
            auth.signOut()
                .then(() => {
                    localStorage.clear();
                    window.location.replace("index.html");
                })
                .catch((error) => {
                    alert("Log out fail");
                });
        });
    };
    if (form5) {
        imgresult.src = "";
        textsearch.textContent = "";
        textresult.textContent = "";
        productsearch.classList.remove("product1");
        productsearch.classList.add("product");
        localStorage.removeItem("current_product");

        form5.addEventListener("submit", (e) => {
            e.preventDefault();

            textresult.textContent = "";
            textsearch.textContent = "";
            imgresult.src = "";

            const searchin = searchinput.value.trim();
            const keyword = searchin.toLowerCase().replace(/\s+/g, "");

            if (!keyword) {
                textresult.textContent = "";
                imgresult.classList.add("hideimg");
                imgresult.classList.remove("image");
                textsearch.textContent = "You have to input words to search.";
                productsearch.classList.remove("product1");
                productsearch.classList.add("product");
            }
            else {
                textsearch.textContent = "";
            }

            const products = [
                { key: "emeraldluxe", name: "Emerald Luxe", img: "image/imagep1" },
                { key: "ivoryroyale", name: "Ivory Royale", img: "image/imagep2" },
                { key: "crimsonclassic", name: "Crimson Classic", img: "image/imagep3" },
                { key: "champagneelegance", name: "Champagne Elegance", img: "image/imagep4" },
                { key: "rosecharm", name: "Rose Charm", img: "image/imagep5" },
                { key: "granitemoderno", name: "Granite Moderno", img: "image/imagep6" },
                { key: "sapphirerelaxa", name: "Sapphire Relaxa", img: "image/imagep7" },
                { key: "olivehaven", name: "Olive Haven", img: "image/imagep8" },
                { key: "pearlserenity", name: "Pearl Serenity", img: "image/imagep9" },
                { key: "amberglow", name: "Amber Glow", img: "image/imagep10" },
                { key: "charcoalgrace", name: "Charcoal Grace", img: "image/imagep11" },
                { key: "midnightcomfort", name: "Midnight Comfort", img: "image/imagep12" },
            ];

            const result = products.find(p => p.key === keyword);

            if (result) {
                imgresult.src = result.img;
                textresult.textContent = result.name;
                productsearch.classList.remove("product");
                productsearch.classList.add("product1");
                localStorage.setItem("current_product", result.key);
                textsearch.textContent = "";
            } else {
                textresult.textContent = "";
                imgresult.classList.add("hideimg");
                imgresult.classList.remove("image");
                productsearch.classList.remove("product1");
                productsearch.classList.add("product");
                textsearch.textContent = `There's no product named "${searchin}".`;
            }
        });
        form5.addEventListener("input", () => {
            const products = [
                { key: "emeraldluxe", name: "Emerald Luxe", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2y4LYT-AZSMOcvP9x82sekWNOSDvDl77-LQ&s" },
                { key: "ivoryroyale", name: "Ivory Royale", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdzmAdhLZWFIMaEf9iv4dSD1_1FIEUL8eVvQ&s" },
                { key: "crimsonclassic", name: "Crimson Classic", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQajMS8YKkL9DSAysrv__HJY6yCmAiMJadxfw&s" },
                { key: "champagneelegance", name: "Champagne Elegance", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL1TRUWKmfHaGeA-Cl6sYrruUqtj0fFKJ84Q&s" },
                { key: "rosecharm", name: "Rosé Charm", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXsz8uvvqrslJRSzZ81E2b3n2WpSzDJ07taw&s" },
                { key: "granitemoderno", name: "Granite Moderno", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL2Ce8bmavcd3cOF6gkZ4fVMtIowjEqf0oiQ&s" },
                { key: "sapphirerelaxa", name: "Sapphire Relaxa", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT11iXbyT1AtiKSoNIaYSOVqr1zaO6S8oJDQQ&s" },
                { key: "olivehaven", name: "Olive Haven", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmm9oCil7hWDPkE2Pc2crq_aNfj2AduW0CLw&s" },
                { key: "pearlserenity", name: "Pearl Serenity", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeFnZ0ZmYfgVbaQMjeFzQZJK1ab2dI5qJsuA&s" },
                { key: "amberglow", name: "Amber Glow", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgqcvwwX5NDFAB18F3C2uABJ9I6qvtxXZODg&s" },
                { key: "charcoalgrace", name: "Charcoal Grace", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgtaS4VGtKyCRm0sBnEqR4CYTd6hMYW1FMfQ&s" },
                { key: "midnightcomfort", name: "Midnight Comfort", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGk-yyyV52oLd95QwX9wO4ZhMrfQi6nZHmng&s" },
            ];
            const searchin = searchinput.value.trim();
            const keyword = searchin.toLowerCase().replace(/\s+/g, "");
            const result1 = products.filter(p => p.key.toLowerCase().includes(keyword));
            if (!keyword) {
                imgresult.classList.add("hideimg");
                imgresult.classList.remove("image");
                localStorage.setItem("current_product", "")
                textsearch.textContent = "You have to input words to search.";
                productsearch.classList.remove("product1");
                productsearch.classList.add("product");
                imgresult.src = "";
                textresult.textContent = "";
            }
            else {
                textsearch.textContent = "";
            }
            if (result1) {
                if (result1.length === 1) {
                    let result = result1[0]
                    imgresult.src = result.img;
                    textresult.textContent = result.name;
                    imgresult.classList.add("image");
                    imgresult.classList.remove("hideimg");
                    productsearch.classList.remove("product");
                    productsearch.classList.add("product1");
                    localStorage.setItem("current_product", result.key);
                    textsearch.textContent = "";
                    console.log(result)
                }
                else {
                    localStorage.setItem("current_product", "")
                    productsearch.classList.remove("product1");
                    productsearch.classList.add("product");
                    imgresult.classList.add("hideimg");
                    imgresult.classList.remove("image");
                    imgresult.src = "";
                    textresult.textContent = "";
                }
            }
        })
    }
    if (productsearch) {
        productsearch.addEventListener("click", (e) => {
            e.preventDefault();
            const currentproduct = localStorage.getItem("current_product")
            if (currentproduct === "emeraldluxe") {
                window.location.href = "../html/product1.html"
            }
            else if (currentproduct === "ivoryroyale") {
                window.location.href = "../html/product2.html"
            }
            else if (currentproduct === "crimsonclassic") {
                window.location.href = "../html/product3.html"
            }
            else if (currentproduct === "champagneelegance") {
                window.location.href = "../html/product4.html"
            }
            else if (currentproduct === "rosecharm") {
                window.location.href = "../html/product5.html"
            }
            else if (currentproduct === "granitemoderno") {
                window.location.href = "../html/product6.html"
            }
            else if (currentproduct === "sapphirerelaxa") {
                window.location.href = "../html/product7.html"
            }
            else if (currentproduct === "olivehaven") {
                window.location.href = "../html/product8.html"
            }
            else if (currentproduct === "pearlserenity") {
                window.location.href = "../html/product9.html"
            }
            else if (currentproduct === "amberglow") {
                window.location.href = "../html/product10.html"
            }
            else if (currentproduct === "charcoalgrace") {
                window.location.href = "../html/product11.html"
            }
            else if (currentproduct === "midnightcomfort") {
                window.location.href = "../html/product12.html"
            }
        })
    }

});