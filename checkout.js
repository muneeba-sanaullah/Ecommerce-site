// ========== checkout.js ==========

document.addEventListener("DOMContentLoaded", () => {
  renderOrderSummary();
  const form = document.getElementById("checkout-form");
  const confirmation = document.getElementById("confirmation-message");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const address = document.getElementById("address").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const email = document.getElementById("email").value.trim();

      const userInfo = {
        name,
        address,
        phone,
        email
      };

      if (!name || !address || !phone || !email) {
        confirmation.textContent = "Please fill in all fields.";
        confirmation.classList.remove("d-none");
        return; // Prevent submission
      }

      localStorage.setItem("checkoutUserInfo", JSON.stringify(userInfo));

      // Simulate order placement
      localStorage.removeItem("cart");
      localStorage.removeItem("checkoutUserInfo");

      form.classList.add("d-none");
      confirmation.textContent = "Thank you for your order! Your order has been placed.";
      confirmation.classList.remove("d-none");
      renderOrderSummary();
    });
  }
});

function renderOrderSummary() {
  const cart = getCart();
  const summary = document.getElementById("order-summary");
  if (!summary) return;

  if (!cart || cart.length === 0) {
    summary.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  let total = 0;
  summary.innerHTML = cart.map(item => {
    const priceValue = parseFloat(item.price.replace(/[^\d.]/g, ""));
    const itemTotal = priceValue * item.quantity;
    total += itemTotal;
    return `<div class='d-flex justify-content-between border-bottom py-2'>
      <span>${item.title} <span class='badge bg-secondary'>x${item.quantity}</span></span>
      <span>${item.price}</span>
    </div>`;
  }).join("");

  summary.innerHTML += `<div class='d-flex justify-content-between fw-bold fs-5 mt-2'>
    <span>Total:</span>
    <span>PKR ${total.toFixed(2)}</span>
  </div>`;
}
