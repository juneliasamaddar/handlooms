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
