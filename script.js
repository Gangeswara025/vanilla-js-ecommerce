let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  if (countEl) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countEl.innerText = totalItems > 0 ? `(${totalItems})` : "";
  }
}

let cartbtn = document.querySelectorAll(".add-to-cart-btn");

cartbtn.forEach((btn) => {
  btn.addEventListener("click", function () {
    let product = btn.parentElement;
    let name = product.querySelector(".product-name").innerText;
    let priceText = product.querySelector(".product-price").innerText;
    let price = Number(priceText.replace("$", ""));
    let imageSrc = product.querySelector("img").src;

    let item = {
      name: name,
      price: price,
      quantity: 1,
      image: imageSrc
    };

    let existing = cart.find((i) => i.name === name);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push(item);
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    
    btn.innerText = "ADDED!";
    btn.style.backgroundColor = "#fb641b";
    btn.style.color = "#fff";
    btn.style.borderColor = "#fb641b";
    
    setTimeout(() => {
      btn.innerText = "ADD TO CART";
      btn.style.backgroundColor = "";
      btn.style.color = "";
      btn.style.borderColor = "";
    }, 1500);

    updateCartCount();
    renderStandaloneCart();
  });
});

function renderStandaloneCart() {
  let itemsWrapper = document.querySelector(".standalone-cart-items-wrapper");
  let summaryContent = document.getElementById("cart-summary-content");
  
  if (!itemsWrapper || !summaryContent) return;
  
  itemsWrapper.innerHTML = "";
  let total = 0;
  let totalItems = 0;
  
  if (cart.length === 0) {
    itemsWrapper.innerHTML = `
      <div style="text-align: center; padding: 40px 0;">
        <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="empty cart" style="width: 200px; margin-bottom: 20px;">
        <h3 style="font-size: 24px; font-weight: 600; color: #212121; margin-bottom: 10px;">Your cart is empty!</h3>
        <p style="color: #878787; margin-bottom: 20px;">Add items to it now.</p>
        <a href="index.html" style="display: inline-block; padding: 12px 24px; background: #fb641b; color: #fff; text-decoration: none; font-weight: 600; border-radius: 4px;">Shop Now</a>
      </div>
    `;
    summaryContent.innerHTML = `
      <div class="summary-row">
        <span>Price (0 items)</span>
        <span>$0</span>
      </div>
      <div class="summary-total">
        <span>Total Amount</span>
        <span>$0</span>
      </div>
    `;
    return;
  }
  
  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    totalItems += item.quantity;
    
    let itemDiv = document.createElement("div");
    itemDiv.classList.add("standalone-cart-item");
    
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="standalone-cart-item-img">
      <div class="standalone-cart-item-details">
        <h4>${item.name}</h4>
        <p>Seller: Premium Store</p>
        <div class="standalone-cart-item-price">$${item.price}</div>
        
        <div class="standalone-cart-item-actions">
          <div class="quantity-controls">
            <button class="qty-btn decrement" data-index="${index}">-</button>
            <div class="qty-input">${item.quantity}</div>
            <button class="qty-btn increment" data-index="${index}">+</button>
          </div>
          <button class="standalone-remove-btn" data-index="${index}">REMOVE</button>
        </div>
      </div>
    `;
    itemsWrapper.appendChild(itemDiv);
  });
  
  itemsWrapper.querySelectorAll('.increment').forEach(btn => {
    btn.addEventListener('click', (e) => {
      let idx = e.target.dataset.index;
      cart[idx].quantity += 1;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderStandaloneCart();
      updateCartCount();
    });
  });
  
  itemsWrapper.querySelectorAll('.decrement').forEach(btn => {
    btn.addEventListener('click', (e) => {
      let idx = e.target.dataset.index;
      if (cart[idx].quantity > 1) {
        cart[idx].quantity -= 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderStandaloneCart();
        updateCartCount();
      }
    });
  });

  itemsWrapper.querySelectorAll('.standalone-remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      let idx = e.target.dataset.index;
      cart.splice(idx, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderStandaloneCart();
      updateCartCount();
    });
  });

  summaryContent.innerHTML = `
    <div class="summary-row">
      <span>Price (${totalItems} items)</span>
      <span>$${total}</span>
    </div>
    <div class="summary-row" style="color: #388e3c;">
      <span>Delivery Charges</span>
      <span>FREE</span>
    </div>
    <div class="summary-total">
      <span>Total Amount</span>
      <span>$${total}</span>
    </div>
  `;
}

updateCartCount();
renderStandaloneCart();
