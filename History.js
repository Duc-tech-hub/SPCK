document.addEventListener("DOMContentLoaded", () => {
  const check = JSON.parse(localStorage.getItem("check403"))
  if (check === false){
    window.location.href="../SPCK/403.html"
  }
  const buybutton1 = document.querySelector("#buttonbuy1");
  const buybutton2 = document.querySelector("#buttonbuy2");
  const buybutton3 = document.querySelector("#buttonbuy3");
  const buybutton4 = document.querySelector("#buttonbuy4");
  const buybutton5 = document.querySelector("#buttonbuy5");
  const buybutton6 = document.querySelector("#buttonbuy6");
  const buybutton7 = document.querySelector("#buttonbuy7");
  const buybutton8 = document.querySelector("#buttonbuy8");
  const buybutton9 = document.querySelector("#buttonbuy9");
  const buybutton10 = document.querySelector("#buttonbuy10");
  const buybutton11 = document.querySelector("#buttonbuy11");
  const buybutton12 = document.querySelector("#buttonbuy12");
  const button = document.querySelector("#button")

  const successline1 = document.querySelector("#successlinep1");
  const successline2 = document.querySelector("#successlinep2");
  const successline3 = document.querySelector("#successlinep3");
  const successline4 = document.querySelector("#successlinep4");
  const successline5 = document.querySelector("#successlinep5");
  const successline6 = document.querySelector("#successlinep6");
  const successline7 = document.querySelector("#successlinep7");
  const successline8 = document.querySelector("#successlinep8");
  const successline9 = document.querySelector("#successlinep9");
  const successline10 = document.querySelector("#successlinep10");
  const successline11 = document.querySelector("#successlinep11");
  const successline12 = document.querySelector("#successlinep12");

  let error1 = document.querySelector("#errorcheck1");
  let error2 = document.querySelector("#errorcheck2");
  let error3 = document.querySelector("#errorcheck3");
  let error4 = document.querySelector("#errorcheck4");
  let error5 = document.querySelector("#errorcheck5");
  let error6 = document.querySelector("#errorcheck6");
  let error7 = document.querySelector("#errorcheck7");
  let error8 = document.querySelector("#errorcheck8");
  let error9 = document.querySelector("#errorcheck9");
  let error10 = document.querySelector("#errorcheck10");
  let error11 = document.querySelector("#errorcheck11");
  let error12 = document.querySelector("#errorcheck12");

  const size1s = document.querySelector("#sizescheckbox1");
  const size1m = document.querySelector("#sizemcheckbox1");
  const size1l = document.querySelector("#sizelcheckbox1");

  const size2s = document.querySelector("#sizescheckbox2");
  const size2m = document.querySelector("#sizemcheckbox2");
  const size2l = document.querySelector("#sizelcheckbox2");

  const size3s = document.querySelector("#sizescheckbox3");
  const size3m = document.querySelector("#sizemcheckbox3");
  const size3l = document.querySelector("#sizelcheckbox3");

  const size4s = document.querySelector("#sizescheckbox4");
  const size4m = document.querySelector("#sizemcheckbox4");
  const size4l = document.querySelector("#sizelcheckbox4");

  const size5s = document.querySelector("#sizescheckbox5");
  const size5m = document.querySelector("#sizemcheckbox5");
  const size5l = document.querySelector("#sizelcheckbox5");

  const size6s = document.querySelector("#sizescheckbox6");
  const size6m = document.querySelector("#sizemcheckbox6");
  const size6l = document.querySelector("#sizelcheckbox6");

  const size7s = document.querySelector("#sizescheckbox7");
  const size7m = document.querySelector("#sizemcheckbox7");
  const size7l = document.querySelector("#sizelcheckbox7");

  const size8s = document.querySelector("#sizescheckbox8");
  const size8m = document.querySelector("#sizemcheckbox8");
  const size8l = document.querySelector("#sizelcheckbox8");

  const size9s = document.querySelector("#sizescheckbox9");
  const size9m = document.querySelector("#sizemcheckbox9");
  const size9l = document.querySelector("#sizelcheckbox9");

  const size10s = document.querySelector("#sizescheckbox10");
  const size10m = document.querySelector("#sizemcheckbox10");
  const size10l = document.querySelector("#sizelcheckbox10");

  const size11s = document.querySelector("#sizescheckbox11");
  const size11m = document.querySelector("#sizemcheckbox11");
  const size11l = document.querySelector("#sizelcheckbox11");

  const size12s = document.querySelector("#sizescheckbox12");
  const size12m = document.querySelector("#sizemcheckbox12");
  const size12l = document.querySelector("#sizelcheckbox12");

  const quantity1 = document.querySelector("#number1");
  const quantity2 = document.querySelector("#number2");
  const quantity3 = document.querySelector("#number3");
  const quantity4 = document.querySelector("#number4");
  const quantity5 = document.querySelector("#number5");
  const quantity6 = document.querySelector("#number6");
  const quantity7 = document.querySelector("#number7");
  const quantity8 = document.querySelector("#number8");
  const quantity9 = document.querySelector("#number9");
  const quantity10 = document.querySelector("#number10");
  const quantity11 = document.querySelector("#number11");
  const quantity12 = document.querySelector("#number12");
  const username = localStorage.getItem("current_user");

  if (error1) error1.textContent = "";
  if (error2) error2.textContent = "";
  if (error3) error3.textContent = "";
  if (error4) error4.textContent = "";
  if (error5) error5.textContent = "";
  if (error6) error6.textContent = "";
  if (error7) error7.textContent = "";
  if (error8) error8.textContent = "";
  if (error9) error9.textContent = "";
  if (error10) error10.textContent = "";
  if (error11) error11.textContent = "";
  if (error12) error12.textContent = "";

  if (successline1) successline1.textContent = "";
  if (successline2) successline2.textContent = "";
  if (successline3) successline3.textContent = "";
  if (successline4) successline4.textContent = "";
  if (successline5) successline5.textContent = "";
  if (successline6) successline6.textContent = "";
  if (successline7) successline7.textContent = "";
  if (successline8) successline8.textContent = "";
  if (successline9) successline9.textContent = "";
  if (successline10) successline10.textContent = "";
  if (successline11) successline11.textContent = "";
  if (successline12) successline12.textContent = "";

  const historyContainer = document.getElementById("history-container");

  function updateHistory() {
    const history = JSON.parse(localStorage.getItem("Item" + username)) || [];
    if (!historyContainer) return;
    historyContainer.innerHTML = "";
    const pad = n => n.toString().padStart(2, '0');

    history.forEach(item => {
      const d = new Date(item.timestamp);
      const hours = pad(d.getHours());
      const mins = pad(d.getMinutes());
      const secs = pad(d.getSeconds());
      const date = pad(d.getDate());
      const month = pad(d.getMonth() + 1);
      const year = d.getFullYear();

      const div = document.createElement("div");
      div.classList.add("history-item");
      div.textContent = `Product: ${item.Name} - Size: ${item.Size} - Quantity: ${item.quantity} - Time: ${hours}:${mins}:${secs} - Date: ${month}/${date}/${year}`;
      historyContainer.appendChild(div);
    });
  }


  function addBuyEvent(buyButton, sizes, quantity, errorBox, productName, successline) {
    if (!buyButton) return;
    buyButton.addEventListener("click", (e) => {
      e.preventDefault();
      const checkedSizes = sizes.filter(el => el.checked);
      if (checkedSizes.length === 0) { errorBox.textContent = "You have to choose a size to buy."; return; }
      if (checkedSizes.length > 1) { errorBox.textContent = "You can only choose one size."; return; }

      let size = checkedSizes[0] === sizes[0] ? "S" :
        checkedSizes[0] === sizes[1] ? "M" : "L";
      const now = new Date();
      let item = JSON.parse(localStorage.getItem("Item" + username)) || [];
      item.push({ Name: productName, Size: size, quantity: quantity.value, timestamp: now.getTime() });
      localStorage.setItem("Item" + username, JSON.stringify(item));
      errorBox.textContent = "";
      successline.textContent = "Successfull buying this product."
      updateHistory();
    });
  }

  addBuyEvent(buybutton1, [size1s, size1m, size1l], quantity1, error1, "Emerald Luxe", successline1);
  addBuyEvent(buybutton2, [size2s, size2m, size2l], quantity2, error2, "Ivory Royale", successline2);
  addBuyEvent(buybutton3, [size3s, size3m, size3l], quantity3, error3, "Crimson Classic", successline3);
  addBuyEvent(buybutton4, [size4s, size4m, size4l], quantity4, error4, "Champagne Elegance", successline4);
  addBuyEvent(buybutton5, [size5s, size5m, size5l], quantity5, error5, "Rosé Charm", successline5);
  addBuyEvent(buybutton6, [size6s, size6m, size6l], quantity6, error6, "Granite Moderno", successline6);
  addBuyEvent(buybutton7, [size7s, size7m, size7l], quantity7, error7, "Sapphire Relaxa", successline7);
  addBuyEvent(buybutton8, [size8s, size8m, size8l], quantity8, error8, "Olive Haven", successline8);
  addBuyEvent(buybutton9, [size9s, size9m, size9l], quantity9, error9, "Pearl Serenity", successline9);
  addBuyEvent(buybutton10, [size10s, size10m, size10l], quantity10, error10, "Amber Glow", successline10);
  addBuyEvent(buybutton11, [size11s, size11m, size11l], quantity11, error11, "Charcoal Grace", successline11);
  addBuyEvent(buybutton12, [size12s, size12m, size12l], quantity12, error12, "Midnight Comfort", successline12);

  updateHistory();
});
