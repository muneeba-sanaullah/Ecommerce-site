document.addEventListener("DOMContentLoaded", () => {
    fetch("footer.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("footer-placeholder").innerHTML = data;
        window.scrollTo(0, 0);
    });
});