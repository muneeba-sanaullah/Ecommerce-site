document.addEventListener("DOMContentLoaded", () => {
    fetch("navbar.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("navbar-placeholder").innerHTML = data;

        highlightCurrentPage();
        toggleIcons();
        updateCartBadge();
        updateWishlistBadge();
    })
});

function highlightCurrentPage(){
    const currentPage = document.body.dataset.page;
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

    navLinks.forEach(link => {
        if (link.dataset.page === currentPage) {
            link.classList.add("active");
        }
        else{
            link.classList.remove("active");
        }
    });
};

function toggleIcons() {
  const currentPage = window.location.pathname.split("/").pop();

  const iconMap = {
    'cart.html': ['bi-cart', 'bi-cart-fill'],
    'wishlist.html': ['bi-heart', 'bi-heart-fill'],
    'account.html': ['bi-person', 'bi-person-fill']
  };

  const links = document.querySelectorAll('a[data-page]');

  links.forEach(link => {
    const page = link.getAttribute('data-page');
    const icon = link.querySelector('i');

    if (page === currentPage && icon && iconMap[page]) {
      const [defaultIcon, activeIcon] = iconMap[page];
      icon.classList.remove(defaultIcon);
      icon.classList.add(activeIcon);
    }
  });
}

document.addEventListener("DOMContentLoaded", toggleIcons);




