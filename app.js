const PRODUCT_API = "/.netlify/functions/products";
const ORDER_API = "/.netlify/functions/orders";

let products = [];
let cart = [];

let currentCategory = "All";


// ==========================================
// LOAD PRODUCTS WHEN PAGE OPENS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadProducts();

    updateCartCount();

});


// ==========================================
// LOAD PRODUCTS FROM DATABASE
// ==========================================

async function loadProducts() {

    const container =
        document.getElementById("productContainer");

    try {

        container.innerHTML =
            "<p>Loading products...</p>";


        const response =
            await fetch(PRODUCT_API);


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message || "Unable to load products"
            );

        }


        products = data;


        displayProducts(products);


    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <p>
                ❌ Unable to load products.
                Please try again later.
            </p>
        `;

    }

}


// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function displayProducts(productList) {

    const container =
        document.getElementById("productContainer");


    if (productList.length === 0) {

        container.innerHTML = `
            <p>
                No products available.
            </p>
        `;

        return;

    }


    container.innerHTML =
        productList.map(product => `

            <div class="product-card">

                <div class="product-image">

                    ${product.image || "🛒"}

                </div>


                <div class="product-info">

                    <span class="product-category">

                        ${product.category}

                    </span>


                    <h3>

                        ${product.name}

                    </h3>


                    <p class="product-unit">

                        ${product.unit}

                    </p>


                    <div class="product-bottom">

                        <span class="product-price">

                            ₹${product.price}

                        </span>


                        <button
                            class="add-cart-btn"
                            onclick="addToCart('${product._id}')">

                            Add to Cart

                        </button>

                    </div>

                </div>

            </div>

        `).join("");

}


// ==========================================
// ADD TO CART
// ==========================================

function addToCart(productId) {

    const product =
        products.find(
            item => item._id === productId
        );


    if (!product) {

        return;

    }


    const existing =
        cart.find(
            item => item._id === productId
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            ...product,

            quantity: 1

        });

    }


    updateCartCount();

    showMessage(
        `${product.name} added to cart`
    );

}


// ==========================================
// UPDATE CART COUNT
// ==========================================

function updateCartCount() {

    const count =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    const cartCount =
        document.getElementById("cartCount");


    if (cartCount) {

        cartCount.textContent = count;

    }

}


// ==========================================
// OPEN CART
// ==========================================

function openCart() {

    const modal =
        document.getElementById("cartModal");


    modal.style.display = "flex";


    updateCart();

}


// ==========================================
// CLOSE CART
// ==========================================

function closeCart() {

    const modal =
        document.getElementById("cartModal");


    modal.style.display = "none";

}


// ==========================================
// UPDATE CART
// ==========================================

function updateCart() {

    const cartItems =
        document.getElementById("cartItems");


    const cartTotal =
        document.getElementById("cartTotal");


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;

        cartTotal.textContent = "₹0";

        return;

    }


    cartItems.innerHTML =
        cart.map(item => `

            <div class="cart-item">

                <div class="cart-item-image">

                    ${item.image || "🛒"}

                </div>


                <div class="cart-item-info">

                    <h4>

                        ${item.name}

                    </h4>

                    <p>

                        ₹${item.price}

                    </p>


                    <div class="quantity-controls">

                        <button
                            onclick="changeQuantity('${item._id}', -1)">

                            −

                        </button>


                        <span>

                            ${item.quantity}

                        </span>


                        <button
                            onclick="changeQuantity('${item._id}', 1)">

                            +

                        </button>

                    </div>

                </div>


                <button
                    class="remove-btn"
                    onclick="removeFromCart('${item._id}')">

                    ✕

                </button>

            </div>

        `).join("");


    const total =
        cart.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );


    cartTotal.textContent =
        "₹" + total.toLocaleString("en-IN");

}


// ==========================================
// CHANGE QUANTITY
// ==========================================

function changeQuantity(productId, change) {

    const item =
        cart.find(
            product => product._id === productId
        );


    if (!item) {

        return;

    }


    item.quantity += change;


    if (item.quantity <= 0) {

        removeFromCart(productId);

        return;

    }


    updateCartCount();

    updateCart();

}


// ==========================================
// REMOVE FROM CART
// ==========================================

function removeFromCart(productId) {

    cart =
        cart.filter(
            item => item._id !== productId
        );


    updateCartCount();

    updateCart();

}


// ==========================================
// FILTER CATEGORY
// ==========================================

function filterCategory(category) {

    currentCategory = category;


    let filtered;


    if (category === "All") {

        filtered = products;

    } else {

        filtered =
            products.filter(
                product =>
                    product.category === category
            );

    }


    displayProducts(filtered);

}


// ==========================================
// SEARCH PRODUCTS
// ==========================================

function searchProducts() {

    const searchInput =
        document.getElementById("searchInput");


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    let filtered =
        products.filter(product => {

            const name =
                product.name.toLowerCase();

            const category =
                product.category.toLowerCase();


            return (
                name.includes(searchText) ||
                category.includes(searchText)
            );

        });


    if (currentCategory !== "All") {

        filtered =
            filtered.filter(
                product =>
                    product.category ===
                    currentCategory
            );

    }


    displayProducts(filtered);

}


// ==========================================
// SORT PRODUCTS
// ==========================================

function sortProducts() {

    const sortValue =
        document.getElementById("sortSelect").value;


    let sorted =
        [...products];


    if (currentCategory !== "All") {

        sorted =
            sorted.filter(
                product =>
                    product.category ===
                    currentCategory
            );

    }


    if (sortValue === "low") {

        sorted.sort(
            (a, b) =>
                a.price - b.price
        );

    }


    if (sortValue === "high") {

        sorted.sort(
            (a, b) =>
                b.price - a.price
        );

    }


    if (sortValue === "name") {

        sorted.sort(
            (a, b) =>
                a.name.localeCompare(b.name)
        );

    }


    displayProducts(sorted);

}


// ==========================================
// CHECKOUT
// ==========================================

async function checkout() {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;

    }


    const customerName =
        prompt("Enter your name:");


    if (!customerName) {

        return;

    }


    const phone =
        prompt("Enter your mobile number:");


    if (!phone) {

        return;

    }


    const address =
        prompt("Enter your delivery address:");


    if (!address) {

        return;

    }


    const total =
        cart.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );


    const orderData = {

        customerName,

        phone,

        address,

        items:
            cart.map(item => ({

                productId:
                    item._id,

                name:
                    item.name,

                price:
                    item.price,

                quantity:
                    item.quantity,

                unit:
                    item.unit,

                image:
                    item.image

            })),

        total

    };


    try {

        const response =
            await fetch(ORDER_API, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body:
                    JSON.stringify(orderData)

            });


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Order could not be placed"
            );

        }


        alert(
            "✅ Order placed successfully!\n\n" +
            "Order ID: " +
            data.order.orderId
        );


        cart = [];


        updateCartCount();

        updateCart();

        closeCart();


    } catch (error) {

        console.error(error);

        alert(
            "❌ Failed to place order.\n" +
            error.message
        );

    }

}


// ==========================================
// MESSAGE
// ==========================================

function showMessage(message) {

    const messageBox =
        document.createElement("div");


    messageBox.className =
        "success-message";


    messageBox.textContent =
        "✓ " + message;


    document.body.appendChild(
        messageBox
    );


    setTimeout(() => {

        messageBox.remove();

    }, 2000);

}


// ==========================================
// CLOSE CART WHEN CLICKING OUTSIDE
// ==========================================

window.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById("cartModal");


        if (
            event.target === modal
        ) {

            closeCart();

        }

    }
);
