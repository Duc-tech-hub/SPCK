document.addEventListener("DOMContentLoaded", () => {
    
    const address = document.querySelector("#address");
    const suggestions = document.querySelector("#address-suggestions");

    address.addEventListener("input", async () => {
        const query = address.value.trim();
        if (query.length < 3) {
            suggestions.innerHTML = "";
            return;
        }
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=vn`);
        const results = await response.json();
        suggestions.innerHTML = "";
        results.forEach(result => {
            const div = document.createElement("div");
            div.textContent = result.display_name;
            div.style.cursor = "pointer";
            div.addEventListener("click", () => {
                address.value = result.display_name;
                suggestions.innerHTML = "";
            });
            suggestions.appendChild(div);
        });
    });
});