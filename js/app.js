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
    }
];

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
