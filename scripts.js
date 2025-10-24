document.addEventListener("DOMContentLoaded", () => {

    const user = {
        username: "NguyenThiNguyetNu",
        password: "nguyenthinguyetnu"
    };
    localStorage.setItem("NguyenThiNguyetNu", JSON.stringify(user));
    const form = document.querySelector("#formregister");
    const form2 = document.querySelector("#formlogin");
    const form3 = document.querySelector("#editnameinfo");
    const form4 = document.querySelector("#editpassinfo");
    const form5 = document.querySelector("#formsearch");
    const productsearch = document.querySelector("#product")
    const buttoninfo = document.querySelector("#infobutton");
    const logoutbutton = document.querySelector("#logoutbutton")

    const usernameInput = document.querySelector("#username");
    const passwordInput = document.querySelector("#password");
    const searchinput = document.querySelector("#search");
    const textsearch = document.querySelector("#text");
    const imgresult = document.querySelector("#img-result");
    const textresult = document.querySelector("#product-result");
    const conPassInput = document.querySelector("#con_pass");
    const usernameError = document.querySelector("#usernameerror");
    const passwordError = document.querySelector("#passerror");
    const usernameinfo = document.querySelector("#inputinfo_username");
    const errorcheckboxinfo = document.querySelector("#checkboxinfoerror");
    const nameupdateinput = document.querySelector("#editnameinput");
    const checkpassnameinput = document.querySelector("#check_pass");
    const errornameupdate = document.querySelector("#usernameerroredit");
    const checkpassupdatename = document.querySelector("#passerrornameedit");
    const successlinenameupdate = document.querySelector("#successlinenameupdate");
    const successlinenpassupdate = document.querySelector("#successlinepassupdate");
    const oldpassinput = document.querySelector("#checkpass");
    const newpassinput = document.querySelector("#newpass");
    const confirlnewpassinput = document.querySelector("#newconfirlmpass");
    const passolderror = document.querySelector("#passerroredit");
    const passnewerror = document.querySelector("#passnewerror");

    const usernameinput2 = document.querySelector("#loginusername");
    const passwordinput2 = document.querySelector("#loginpassword");
    const username2error = document.querySelector("#usernameerrorlog");
    const password2error = document.querySelector("#passerrorlog");
    const successline = document.querySelector("#successline");
    if (form) {
        localStorage.setItem("check403", JSON.stringify(false))
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            successline.textContent = "";
            usernameError.textContent = "";
            passwordError.textContent = "";
            usernameInput.classList.remove("error-border");
            passwordInput.classList.remove("error-border");
            conPassInput.classList.remove("error-border");
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            const con_pass = conPassInput.value.trim();

            let Lowercaseletter = /[a-z]/;
            let Uppercaseletter = /[A-Z]/;
            let number = /[0-9]/;

            let hasError = false;
            if (localStorage.getItem(username)) {
                usernameError.textContent = "This username has already been used.";
                usernameInput.classList.add("error-border");
                hasError = true;
            }
            else if (username.length < 8) {
                usernameError.textContent = "Username must contain at least 8 characters.";
                usernameInput.classList.add("error-border");
                hasError = true;
            } else if (username.length > 24) {
                usernameError.textContent = "Username must contain less than 24 characters.";
                usernameInput.classList.add("error-border");
                hasError = true;
            } else if (!username.match(number)) {
                usernameError.textContent = "Username must contain at least a number.";
                usernameInput.classList.add("error-border");
                hasError = true;
            } else if (!username.match(Lowercaseletter)) {
                usernameError.textContent = "Username must contain a lowercase letter.";
                usernameInput.classList.add("error-border");
                hasError = true;
            } else if (!username.match(Uppercaseletter)) {
                usernameError.textContent = "Username must contain an uppercase letter.";
                usernameInput.classList.add("error-border");
                hasError = true;
            }

            if (password.length < 10) {
                passwordError.textContent = "Password must be at least 10 characters.";
                passwordInput.classList.add("error-border");
                hasError = true;
            } else if (password !== con_pass) {
                passwordError.textContent = "Passwords do not match.";
                passwordInput.classList.add("error-border");
                conPassInput.classList.add("error-border");
                hasError = true;
            }

            if (!hasError) {
                const user = {
                    username: username,
                    password: password
                };
                localStorage.setItem(username, JSON.stringify(user));
                successline.textContent = "Register successful! Please log in.";
            }
        })
    }
    if (form2) {
        localStorage.setItem("check403", JSON.stringify(false))
        form2.addEventListener("submit", (e) => {
            e.preventDefault();
            username2error.textContent = "";
            password2error.textContent = "";
            usernameinput2.classList.remove("error-border");
            passwordinput2.classList.remove("error-border");

            const username = usernameinput2.value.trim();
            const password = passwordinput2.value.trim();

            if (!localStorage.getItem(username)) {
                username2error.textContent = "The username does not exist.";
                usernameinput2.classList.add("error-border");
                return;
            }

            const user = JSON.parse(localStorage.getItem(username));
            if (user.password !== password) {
                password2error.textContent = "Wrong password.";
                passwordinput2.classList.add("error-border");
                return;
            }
            localStorage.setItem("check403", JSON.stringify(true));
            localStorage.setItem("current_user", username);
            window.location.href = "../SPCK/home.html";
        });
    };
    if (usernameinfo) {
        current_user = localStorage.getItem("current_user");
        usernameinfo.textContent = current_user;
    }
    if (logoutbutton) {
        const check = JSON.parse(localStorage.getItem("check403"))
        if (check === false) {
            window.location.href = "../SPCK/403.html"
        }
        logoutbutton.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "../SPCK/index.html"
        })
    }
    if (buttoninfo) {
        buttoninfo.addEventListener("click", (e) => {
            e.preventDefault();
            const namecheckbox = document.querySelector("#username_checkbox");
            const passcheckbox = document.querySelector("#password_checkbox");
            if (passcheckbox.checked && namecheckbox.checked) {
                errorcheckboxinfo.textContent = "You can only choose 1 check box"
            }
            else if (namecheckbox.checked) {
                window.location.href = "../SPCK/Editinfousername.html";
            }
            else if (passcheckbox.checked) {
                window.location.href = "../SPCK/Editinfopassword.html";
            }
            else {
                errorcheckboxinfo.textContent = "You have to choose one from the two checkboxes to edit."
            }
        });
    };
    if (form3) {
        const check = JSON.parse(localStorage.getItem("check403"))
        if (check === false) {
            window.location.href = "../SPCK/403.html"
        }
        form3.addEventListener("submit", (e) => {
            e.preventDefault();
            successlinenameupdate.textContent = "";
            errornameupdate.textContent = "";
            checkpassupdatename.textContent = "";
            nameupdateinput.classList.remove("error-border");
            checkpassnameinput.classList.remove("error-border");

            const username = nameupdateinput.value.trim();
            const password = checkpassnameinput.value.trim();
            let current_user = localStorage.getItem("current_user");
            const takepass = JSON.parse(localStorage.getItem(current_user));
            const checkpass = takepass.password;

            let Lowercaseletter = /[a-z]/;
            let Uppercaseletter = /[A-Z]/;
            let number = /[0-9]/;
            let hasError = false;
            if (localStorage.getItem(username)) {
                errornameupdate.textContent = "This username has already been used.";
                nameupdateinput.classList.add("error-border");
                hasError = true;
            }

            else if (username.length < 8) {
                errornameupdate.textContent = "Username must contain at least 8 characters.";
                nameupdateinput.classList.add("error-border");
                hasError = true;
            } else if (username.length > 24) {
                errornameupdate.textContent = "Username must contain less than 24 characters.";
                nameupdateinput.classList.add("error-border");
                hasError = true;
            } else if (!username.match(number)) {
                errornameupdate.textContent = "Username must contain at least a number.";
                nameupdateinput.classList.add("error-border");
                hasError = true;
            } else if (!username.match(Lowercaseletter)) {
                errornameupdate.textContent = "Username must contain a lowercase letter.";
                nameupdateinput.classList.add("error-border");
                hasError = true;
            } else if (!username.match(Uppercaseletter)) {
                errornameupdate.textContent = "Username must contain an uppercase letter.";
                nameupdateinput.classList.add("error-border");
                hasError = true;
            }
            else if (password == "") {
                checkpassupdatename.textContent = "You have to enter your current password";
                checkpassnameinput.classList.add("error-border");
                hasError = true;
            }
            else if (password !== checkpass) {
                checkpassupdatename.textContent = "Wrong password";
                checkpassnameinput.classList.add("error-border");
                hasError = true;
            }
            if (!hasError) {
                localStorage.removeItem(current_user);
                localStorage.setItem(username, JSON.stringify({ ...takepass, username }));
                localStorage.setItem("current_user", username);
                successlinenameupdate.textContent = "Username has been update"

            }
        })
    }
    if (form4) {
        const check = JSON.parse(localStorage.getItem("check403"))
        if (check === false) {
            window.location.href = "../SPCK/403.html"
        }
        form4.addEventListener("submit", (e) => {
            e.preventDefault();
            successlinenpassupdate.textContent = "";
            passolderror.textContent = "";
            passnewerror.textContent = "";
            oldpassinput.classList.remove("error-border");
            newpassinput.classList.remove("error-border");
            confirlnewpassinput.classList.remove("error-border");

            const oldpass = oldpassinput.value.trim();
            const password = newpassinput.value.trim();
            const con_pass = confirlnewpassinput.value.trim();
            const current_user = localStorage.getItem("current_user");
            const takepass = JSON.parse(localStorage.getItem(current_user))
            const checkpass = takepass.password

            let hasError = false;

            if (password.length < 10) {
                passnewerror.textContent = "Password must be at least 10 characters.";
                newpassinput.classList.add("error-border");
                hasError = true;
            } else if (password !== con_pass) {
                passnewerror.textContent = "Passwords do not match.";
                newpassinput.classList.add("error-border");
                confirlnewpassinput.classList.add("error-border");
                hasError = true;
            }
            else if (oldpass == "") {
                passolderror.textContent = "You have to enter your current password.";
                oldpassinput.classList.add("error-border");
                hasError = true;
            }
            else if (oldpass !== checkpass) {
                passolderror.textContent = "Wrong password.";
                oldpassinput.classList.add("error-border");
                hasError = true;
            }
            if (!hasError) {
                successlinenpassupdate.textContent = "Your password has been update."
                takepass.password = password;
                username = localStorage.getItem("current_user")
                localStorage.setItem(username, JSON.stringify(takepass));
            }
        });
    };
    if (form5) {
        const check = JSON.parse(localStorage.getItem("check403"))
        if (check === false) {
            window.location.href = "../SPCK/403.html"
        }
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
                { key: "emeraldluxe", name: "Emerald Luxe", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2y4LYT-AZSMOcvP9x82sekWNOSDvDl77-LQ&s" },
                { key: "ivoryroyale", name: "Ivory Royale", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdzmAdhLZWFIMaEf9iv4dSD1_1FIEUL8eVvQ&s" },
                { key: "crimsonclassic", name: "Crimson Classic", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQajMS8YKkL9DSAysrv__HJY6yCmAiMJadxfw&s" },
                { key: "champagneelegance", name: "Champagne Elegance", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL1TRUWKmfHaGeA-Cl6sYrruUqtj0fFKJ84Q&s" },
                { key: "rosecharm", name: "Rose Charm", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXsz8uvvqrslJRSzZ81E2b3n2WpSzDJ07taw&s" },
                { key: "granitemoderno", name: "Granite Moderno", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL2Ce8bmavcd3cOF6gkZ4fVMtIowjEqf0oiQ&s" },
                { key: "sapphirerelaxa", name: "Sapphire Relaxa", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT11iXbyT1AtiKSoNIaYSOVqr1zaO6S8oJDQQ&s" },
                { key: "olivehaven", name: "Olive Haven", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmm9oCil7hWDPkE2Pc2crq_aNfj2AduW0CLw&s" },
                { key: "pearlserenity", name: "Pearl Serenity", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeFnZ0ZmYfgVbaQMjeFzQZJK1ab2dI5qJsuA&s" },
                { key: "amberglow", name: "Amber Glow", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgqcvwwX5NDFAB18F3C2uABJ9I6qvtxXZODg&s" },
                { key: "charcoalgrace", name: "Charcoal Grace", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgtaS4VGtKyCRm0sBnEqR4CYTd6hMYW1FMfQ&s" },
                { key: "midnightcomfort", name: "Midnight Comfort", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGk-yyyV52oLd95QwX9wO4ZhMrfQi6nZHmng&s" },
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
                { key: "emeraldluxe", name: "Emerald Luxe", img: "./image/imagep1.jpg" },
                { key: "ivoryroyale", name: "Ivory Royale", img: "./image/imagep2.jpg" },
                { key: "crimsonclassic", name: "Crimson Classic", img: "./image/imagep3.jpg" },
                { key: "champagneelegance", name: "Champagne Elegance", img: "./image/imagep4.jpg" },
                { key: "rosecharm", name: "Rose Charm", img: "./image/imagep5.jpg" },
                { key: "granitemoderno", name: "Granite Moderno", img: "./image/imagep6.jpg" },
                { key: "sapphirerelaxa", name: "Sapphire Relaxa", img: "./image/imagep7.jpg" },
                { key: "olivehaven", name: "Olive Haven", img: "./image/imagep8.jpg" },
                { key: "pearlserenity", name: "Pearl Serenity", img: "./image/imagep9.jpg" },
                { key: "amberglow", name: "Amber Glow", img: "./image/imagep10.jpg" },
                { key: "charcoalgrace", name: "Charcoal Grace", img: "./image/imagep11.jpg" },
                { key: "midnightcomfort", name: "Midnight Comfort", img: "./image/imagep12.jpg" },
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
            currentproduct = localStorage.getItem("current_product")
            if (currentproduct === "emeraldluxe") {
                window.location.href = "../SPCK/product1.html"
            }
            else if (currentproduct === "ivoryroyale") {
                window.location.href = "../SPCK/product2.html"
            }
            else if (currentproduct === "crimsonclassic") {
                window.location.href = "../SPCK/product3.html"
            }
            else if (currentproduct === "champagneelegance") {
                window.location.href = "../SPCK/product4.html"
            }
            else if (currentproduct === "rosecharm") {
                window.location.href = "../SPCK/product5.html"
            }
            else if (currentproduct === "granitemoderno") {
                window.location.href = "../SPCK/product6.html"
            }
            else if (currentproduct === "sapphirerelaxa") {
                window.location.href = "../SPCK/product7.html"
            }
            else if (currentproduct === "olivehaven") {
                window.location.href = "../SPCK/product8.html"
            }
            else if (currentproduct === "pearlserenity") {
                window.location.href = "../SPCK/product9.html"
            }
            else if (currentproduct === "amberglow") {
                window.location.href = "../SPCK/product10.html"
            }
            else if (currentproduct === "charcoalgrace") {
                window.location.href = "../SPCK/product11.html"
            }
            else if (currentproduct === "midnightcomfort") {
                window.location.href = "../SPCK/product12.html"
            }
        })
    }

})