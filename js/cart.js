document.addEventListener("DOMContentLoaded", () => {
    const redirectb = document.querySelector("#redirect");
    redirectb.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "../html/../html/pay-form.html"
    })
});