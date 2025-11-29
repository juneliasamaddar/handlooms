
// ------------------- DATABASE SETUP -----------------------
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
// SAMPLE PRODUCT DATA
const products = [
    {
        title: "Kanchipuram Silk Saree",
        price: "₹4500",
        img: "assets/images/saree1.jpg"
    },
    {
        title: "Ikat Dupatta",
        price: "₹1200",
        img: "assets/images/dupatta.jpg"
    }
];

// RENDER CARDS IN HOME PAGE
const homeBox = document.getElementById("home-products");

products.forEach(p => {
    homeBox.innerHTML += `
        <div class="product-card">
            <img src="${p.img}">
            <div class="product-card-title">${p.title}</div>
            <div class="product-card-price">${p.price}</div>
        </div>
    `;
});
