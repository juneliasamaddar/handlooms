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
    }

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
