<<<<<<< HEAD
// ------------------ DATABASE SETUP ------------------
const DB = {
    USERS: "users",
    PRODUCTS: "products",
    PENDING: "pending_products",
    CAMPAIGNS: "campaigns",
    CART: "cart"
};

function read(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function write(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function initDB() {
    Object.values(DB).forEach(key => {
        if (!localStorage.getItem(key)) write(key, []);
    });
}
initDB();


// ------------------ SIGNUP ------------------
document.getElementById("signupBtn")?.addEventListener("click", () => {
    let name = signupName.value.trim();
    let email = signupEmail.value.trim();
    let pass = signupPassword.value.trim();
    let role = signupRole.value;

    if (!name || !email || !pass) {
        alert("Fill all fields");
        return;
=======
// PRODUCT DATA
const products = [
    {
        title: "Kanchipuram Silk Saree",
        price: "₹4500",
        category: "saree",
        img: "assets/images/saree1.jpg"
    },
    {
        title: "Ikat Dupatta",
        price: "₹1200",
        category: "dupatta",
        img: "assets/images/dupatta.jpeg"
    },
    {
        title: "Banarasi Handloom Saree",
        price: "₹5200",
        category: "saree",
        img: "assets/images/banarasi.jpg"
    },
    {
        title: "Kalamkari Cotton Dupatta",
        price: "₹750",
        category: "dupatta",
        img: "assets/images/kalamkari.JPG"
    },
    {
        title: "Assam Muga Silk Fabric",
        price: "₹1800 / meter",
        category: "fabric",
        img: "assets/images/muga.jpg"
    },
    {
        title: "Pochampally Ikat Saree",
        price: "₹3500",
        category: "saree",
        img: "assets/images/ikat.webp"
    },
    {
        title: "Kota Doria Dupatta",
        price: "₹990",
        category: "dupatta",
        img: "assets/images/kotadoria.jpg"
    },
    {
        title: "Jamdani Handwoven Fabric",
        price: "₹1400 / meter",
        category: "fabric",
        img: "assets/images/jamdani.jpg"
>>>>>>> 7b147c3dc6850adaef2a347e7acecc1857bfb271
    }

<<<<<<< HEAD
    let users = read(DB.USERS);
    if (users.find(u => u.email === email)) {
        alert("Email already exists");
        return;
    }

    users.push({
        id: Date.now(),
        name,
        email,
        pass,
        role
    });

    write(DB.USERS, users);
    alert("Signup successful!");
    location.hash = "#login";
});


// ------------------ LOGIN ------------------
document.getElementById("loginBtn")?.addEventListener("click", () => {
    let email = loginEmail.value.trim();
    let pass = loginPassword.value.trim();

    let users = read(DB.USERS);
    let user = users.find(u => u.email === email && u.pass === pass);

    if (!user) {
        alert("Invalid username or password");
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));

    // Role-based redirects
    if (user.role === "buyer") location.hash = "#products";
    if (user.role === "artisan") location.hash = "#artisanDashboard";
    if (user.role === "admin") location.hash = "#adminDashboard";
    if (user.role === "marketing") location.hash = "#marketingDashboard";
});
// ------------------ ARTISAN PRODUCT UPLOAD ------------------
document.getElementById("productForm")?.addEventListener("submit", (e) => {
    e.preventDefault();

    let user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || user.role !== "artisan") {
        alert("Only artisans can upload products");
        return;
    }

    let product = {
        id: Date.now(),
        name: pName.value.trim(),
        price: parseFloat(pPrice.value),
        img: pImg.value.trim(),
        desc: pDesc.value.trim(),
        artisanId: user.id
    };

    if (!product.name || !product.price || !product.desc) {
        alert("Fill all fields correctly");
        return;
    }

    let pending = read(DB.PENDING);
    pending.push(product);
    write(DB.PENDING, pending);

    alert("Product submitted for admin approval!");
    e.target.reset();
});


// Load artisan approved product
function loadArtisanProducts() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    let approved = read(DB.PRODUCTS).filter(p => p.artisanId === user.id);

    artisanProducts.innerHTML =
        approved.length === 0
            ? "<p>No approved products yet</p>"
            : approved.map(p => `
                <div class="card">
                    <img src="${p.img}" class="prod-img">
                    <h4>${p.name}</h4>
                    <p>₹${p.price}</p>
                </div>
            `).join("");
}


// Load artisan pending product
function loadArtisanPending() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    let pending = read(DB.PENDING).filter(p => p.artisanId === user.id);

    artisanPending.innerHTML =
        pending.length === 0
            ? "<p>No pending products</p>"
            : pending.map(p => `
                <div class="card">
                    <h4>${p.name}</h4>
                    <p>Waiting for admin approval</p>
                </div>
            `).join("");
}


// When artisan page opens
window.addEventListener("hashchange", () => {
    if (location.hash === "#artisanDashboard") {
        loadArtisanProducts();
        loadArtisanPending();
    }
});


// ------------------ ADMIN PANEL ------------------
function loadPendingForAdmin() {
    let pending = read(DB.PENDING);

    pendingList.innerHTML =
        pending.length === 0
            ? "<p>No pending items</p>"
            : pending.map(p => `
                <div class="card">
                    <img src="${p.img}" class="small-img">
                    <h4>${p.name} - ₹${p.price}</h4>
                    <p>${p.desc}</p>
                    <button onclick="approveProduct(${p.id})">Approve</button>
                    <button onclick="rejectProduct(${p.id})">Reject</button>
                </div>
            `).join("");
}

function approveProduct(id) {
    let pending = read(DB.PENDING);
    let products = read(DB.PRODUCTS);

    let item = pending.find(p => p.id === id);
    products.push(item);
    write(DB.PRODUCTS, products);

    write(DB.PENDING, pending.filter(p => p.id !== id));

    loadPendingForAdmin();
}

function rejectProduct(id) {
    let pending = read(DB.PENDING).filter(p => p.id !== id);
    write(DB.PENDING, pending);
    loadPendingForAdmin();
}

window.addEventListener("hashchange", () => {
    if (location.hash === "#adminDashboard") loadPendingForAdm
// ------------------ CART SYSTEM ------------------
function addToCart(id) {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || user.role !== "buyer") {
        alert("Login as buyer to add items!");
        return;
    }

    let cart = read(DB.CART);
    let item = cart.find(c => c.userId === user.id && c.productId === id);

    if (item) item.qty++;
    else cart.push({ userId: user.id, productId: id, qty: 1 });

    write(DB.CART, cart);
    alert("Added to cart");
}

function loadCart() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || user.role !== "buyer") return;

    let cart = read(DB.CART).filter(c => c.userId === user.id);
    let products = read(DB.PRODUCTS);

    cartItems.innerHTML =
        cart.length === 0
            ? "<p>Your cart is empty.</p>"
            : cart.map(c => {
                let p = products.find(prod => prod.id === c.productId);
                return `
                    <div class="cart-item">
                        ${p.name} — ${c.qty} × ₹${p.price}
                    </div>
                `;
            }).join("");
            let total = 0;
cart.forEach(c => {
    let p = products.find(prod => prod.id === c.productId);
    total += p.price * c.qty;
});

cartItems.innerHTML += `<h3>Total: ₹${total}</h3>`;
<button onclick="removeFromCart(${c.productId})">Remove</button>
function removeFromCart(id) {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    let cart = read(DB.CART).filter(c => !(c.userId === user.id && c.productId === id));
    write(DB.CART, cart);
    loadCart();
}


}

// Load cart on navigation
window.addEventListener("hashchange", () => {
    if (location.hash === "#cart") loadCart();
});
// ------------------ CAMPAIGN SYSTEM ------------------
document.getElementById("campaignForm")?.addEventListener("submit", (e) => {
    e.preventDefault();

    let user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || user.role !== "marketing") {
        alert("Only marketing users can add campaigns");
        return;
    }

    let campaigns = read(DB.CAMPAIGNS);

    campaigns.push({
        id: Date.now(),
        title: cTitle.value,
        img: cImg.value,
        discount: cDiscount.value,
        desc: cDesc.value
    });

    write(DB.CAMPAIGNS, campaigns);

    alert("Campaign added!");
    e.target.reset();
    loadCampaigns();
});

function loadCampaigns() {
    let campaigns = read(DB.CAMPAIGNS);

    campaignList.innerHTML =
        campaigns.length === 0
            ? "<p>No campaigns yet</p>"
            : campaigns.map(c => `
                <div class="card">
                    <img src="${c.img}" class="small-img">
                    <h4>${c.title} — ${c.discount}% OFF</h4>
                    <p>${c.desc}</p>
                </div>
            `).join("");
}

window.addEventListener("hashchange", () => {
    if (location.hash === "#marketingDashboard") loadCampaigns();
});
// ------------------ PRODUCTS PAGE ------------------
function loadProducts() {
    let list = read(DB.PRODUCTS);

    productList.innerHTML =
        list.length === 0
            ? "<p>No products available</p>"
            : list.map(p => `
                <div class="card">
                    <img src="${p.img}" class="prod-img">
                    <h4>${p.name}</h4>
                    <p>₹${p.price}</p>
                    <button onclick="addToCart(${p.id})">Add to Cart</button>
                </div>
            `).join("");
}

// Load products when #products is opened
window.addEventListener("hashchange", () => {
    if (location.hash === "#products") loadProducts();
});
// ------------------ SEARCH BAR ------------------
document.getElementById("search-bar")?.addEventListener("input", function () {
    let q = this.value.toLowerCase();
    let list = read(DB.PRODUCTS);

    let result = list.filter(p =>
        p.name.toLowerCase().includes(q)
    );

    productList.innerHTML =
        result.length === 0
            ? "<p>No matching products</p>"
            : result.map(p => `
                <div class="card">
                    <img src="${p.img}" class="prod-img">
                    <h4>${p.name}</h4>
                    <p>₹${p.price}</p>
                    <button onclick="addToCart(${p.id})">Add to Cart</button>
                </div>
            `).join("");
});
// ------------------ HOME PAGE ------------------
function loadHomeProducts() {
    let list = read(DB.PRODUCTS).slice(0, 4); // show only 4

    homeProducts.innerHTML =
        list.length === 0
            ? "<p>No trending products yet</p>"
            : list.map(p => `
                <div class="card">
                    <img src="${p.img}" class="prod-img">
                    <h4>${p.name}</h4>
                    <p>₹${p.price}</p>
                </div>
            `).join("");
}

// Load when home page is opened
window.addEventListener("hashchange", () => {
    if (location.hash === "#home" || location.hash === "") loadHomeProducts();
});

// Load on page load
loadHomeProducts();
=======
];
// DISPLAY ALL PRODUCTS
function displayProducts(list) {
    const container = document.getElementById("product-list");
    container.innerHTML = "";

    list.forEach(p => {
        container.innerHTML += `
            <div class="product-card">
                <img src="${p.img}" class="product-img">

                <div class="product-card-title">${p.title}</div>
                <div class="product-card-price">${p.price}</div>

                <button class="add-to-cart">Add to Cart</button>
            </div>
        `;
    });
}

displayProducts(products);

// SEARCH FILTER
const searchBar = document.getElementById("search-bar");
if (searchBar) {
    searchBar.addEventListener("keyup", (e) => {
        const keyword = e.target.value.toLowerCase();
        const filtered = products.filter(p => 
            p.title.toLowerCase().includes(keyword)
        );
        displayProducts(filtered);
    });
}


// CATEGORY FILTER
const categoryFilter = document.getElementById("category-filter");
if (categoryFilter) {
    categoryFilter.addEventListener("change", (e) => {
        const selected = e.target.value;

        if (selected === "all") {
            displayProducts(products);
            return;
        }

        const filtered = products.filter(p => p.category === selected);
        displayProducts(filtered);
    });
}

// TRENDING SECTION
function loadTrendingProducts() {
    const homeGrid = document.getElementById("home-products");

    if (!homeGrid) {
        console.error("home-products container not found");
        return;
    }

    homeGrid.innerHTML = `
        <div class="product-card">
            <img src="assets/images/saree1.jpg" class="product-img">
            <div class="product-card-title">Kanchipuram Silk Saree</div>
            <div class="product-card-price">₹4500</div>
        </div>

        <div class="product-card">
            <img src="assets/images/dupatta.jpeg" class="product-img">
            <div class="product-card-title">Ikat Dupatta</div>
            <div class="product-card-price">₹1200</div>
        </div>
    `;
}

// LOAD TRENDING ON PAGE LOAD
window.addEventListener("load", loadTrendingProducts);
>>>>>>> 7b147c3dc6850adaef2a347e7acecc1857bfb271
function updateNavbar() {
    let user = JSON.parse(localStorage.getItem("currentUser"));

    if (user) {
        document.querySelector(".btn-login").innerHTML = "Logout";
        document.querySelector(".btn-login").onclick = () => {
            localStorage.removeItem("currentUser");
            location.hash = "#home";
            updateNavbar();
        };
    } else {
        document.querySelector(".btn-login").innerHTML = "Login";
        document.querySelector(".btn-login").onclick = null;
    }
}

updateNavbar();
window.addEventListener("hashchange", updateNavbar);
window.addEventListener("hashchange", () => {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    let page = location.hash.replace("#", "");

    const restricted = {
        artisanDashboard: "artisan",
        adminDashboard: "admin",
        marketingDashboard: "marketing",
        cart: "buyer"
    };

    if (restricted[page] && (!user || user.role !== restricted[page])) {
        alert("Access Denied!");
        location.hash = "#login";
    }
});
write(DB.PENDING, pending);
loadArtisanPending();
