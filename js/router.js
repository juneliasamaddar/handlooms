// SHOW PAGE
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(p => 
        p.classList.remove("active")
    );
    
    const page = document.getElementById(pageId);
    if (page) page.classList.add("active");
}

// ROUTER
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
