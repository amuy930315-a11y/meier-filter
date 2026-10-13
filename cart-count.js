
(function () {
  const CART_KEY = "meier-cart";

  function updateCartCount() {
    let cart = [];

    try {
      const saved = JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
      );
      cart = Array.isArray(saved) ? saved : [];
    } catch (error) {
      cart = [];
    }

    const uniqueIds = new Set(
      cart.map(item => {
        return typeof item === "string"
          ? item
          : item?.id;
      }).filter(Boolean)
    );

    
document.querySelectorAll(
  "#cart-count, #mobile-cart-count"
).forEach(function(count) {
  count.textContent = uniqueIds.size;
});

  }

  document.addEventListener("DOMContentLoaded", updateCartCount);
  window.addEventListener("pageshow", updateCartCount);
  window.addEventListener("storage", updateCartCount);
})();
