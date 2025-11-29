function showPage(pageId) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");
}

function router() {
    let hash = location.hash.replace("#", "");
    if (hash === "") hash = "home";
    showPage(hash);
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);
// MOBILE NAV TOGGLE
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});
