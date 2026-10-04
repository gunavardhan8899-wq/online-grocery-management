// ===============================
// FRESHCART - ONLINE GROCERY APP
// ===============================

// Product data
const products = [
    {
        id: 1,
        name: "Fresh Tomatoes",
        category: "Vegetables",
        price: 40,
        unit: "1 kg",
        image: "🍅"
    },
    {
        id: 2,
        name: "Potatoes",
        category: "Vegetables",
        price: 35,
        unit: "1 kg",
        image: "🥔"
    },
    {
        id: 3,
        name: "Fresh Carrots",
        category: "Vegetables",
        price: 50,
        unit: "1 kg",
        image: "🥕"
    },
    {
        id: 4,
        name: "Fresh Apples",
        category: "Fruits",
        price: 120,
        unit: "1 kg",
        image: "🍎"
    },
    {
        id: 5,
        name: "Bananas",
        category: "Fruits",
        price: 60,
        unit: "1 dozen",
        image: "🍌"
    },
    {
        id: 6,
        name: "Fresh Oranges",
        category: "Fruits",
        price: 90,
        unit: "1 kg",
        image: "🍊"
    },
    {
        id: 7,
        name: "Fresh Milk",
        category: "Dairy",
        price: 35,
        unit: "1 litre",
        image: "🥛"
    },
    {
        id: 8,
        name: "Cheese",
        category: "Dairy",
        price: 110,
        unit: "200 g",
        image: "🧀"
    },
    {
        id: 9,
        name: "Butter",
        category: "Dairy",
        price: 60,
        unit: "100 g",
        image: "🧈"
    },
    {
        id: 10,
        name: "Biscuits",
        category: "Snacks",
        price: 30,
        unit: "1 pack",
        image: "🍪"
    },
    {
        id: 11,
        name: "Potato Chips",
        category: "Snacks",
        price: 40,
        unit: "1 pack",
        image: "🍟"
    },
    {
        id: 12,
        name: "Chocolate",
        category: "Snacks",
        price: 50,
        unit: "1 bar",
        image: "🍫"
    },
    {
        id: 13,
        name: "Orange Juice",
        category: "Beverages",
        price: 80,
        unit: "1 litre",
        image: "🧃"
    },
    {
        id: 14,
        name: "Soft Drink",
        category: "Beverages",
        price: 45,
        unit: "750 ml",
        image: "🥤"
    },
    {
        id: 15,
        name: "Green Tea",
        category: "Beverages",
        price: 150,
        unit: "100 g",
        image: "🍵"
    },
    {
        id: 16,
        name: "Water Bottle",
        category: "Beverages",
        price: 20,
        unit: "1 litre",
        image: "💧"
    }
];


// Shopping cart
let cart = [];


// Current displayed products
let displayedProducts = [...products];


// ===============================
// PAGE LOAD
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    loadProducts();

    updateCart();

});


// ===============================
// DISPLAY PRODUCTS
// ===============================

function loadProducts(productList = displayedProducts) {

    const container = document.getElementById("productContainer");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (productList.length === 0) {

        container.innerHTML = `
            <div style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 50px;
            ">
                <h2>😔 No products found</h2>
                <p>Try searching for another product.</p>
            </div>
        `;

        return;
    }


    productList.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `

            <div class="product-image">
                ${product.image}
            </div>

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ${product.unit}
                </p>

                <div class="product-price">
                    ₹${product.price}
                </div>

                <button
                    class="add-button"
                    onclick="addToCart(${product.id})"
                >
                    Add to Cart
                </button>

            </div>

        `;

        container.appendChild(card);

    });

}


// ===============================
// ADD TO CART
// ===============================

function addToCart(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) {
        return;
    }


    const existingItem = cart.find(
        item => item.id === productId
    );


    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }


    updateCart();


    showMessage(
        `${product.name} added to cart 🛒`
    );

}


// ===============================
// UPDATE CART
// ===============================

function updateCart() {

    const cartCount =
        document.getElementById("cartCount");

    const cartItems =
        document.getElementById("cartItems");

    const cartTotal =
        document.getElementById("cartTotal");


    // Calculate total quantity

    const totalQuantity = cart.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );


    if (cartCount) {

        cartCount.textContent =
            totalQuantity;

    }


    // Display cart items

    if (!cartItems) {
        return;
    }


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div style="
                text-align:center;
                padding:40px 10px;
            ">

                <div style="
                    font-size:50px;
                    margin-bottom:15px;
                ">
                    🛒
                </div>

                <h3>Your cart is empty</h3>

                <p>
                    Add some groceries to continue.
                </p>

            </div>

        `;

        if (cartTotal) {
            cartTotal.textContent = "₹0";
        }

        return;
    }


    cartItems.innerHTML = "";


    cart.forEach(item => {

        const cartItem =
            document.createElement("div");

        cartItem.className =
            "cart-item";


        cartItem.innerHTML = `

            <div class="cart-item-info">

                <div class="cart-item-icon">
                    ${item.image}
                </div>

                <div>

                    <strong>
                        ${item.name}
                    </strong>

                    <p>
                        ₹${item.price} × ${item.quantity}
                    </p>

                </div>

            </div>


            <button
                class="remove-button"
                onclick="removeFromCart(${item.id})"
            >
                Remove
            </button>

        `;


        cartItems.appendChild(cartItem);

    });


    // Calculate total

    const total = cart.reduce(
        (sum, item) =>
            sum + item.price * item.quantity,
        0
    );


    if (cartTotal) {

        cartTotal.textContent =
            `₹${total}`;

    }

}


// ===============================
// REMOVE FROM CART
// ===============================

function removeFromCart(productId) {

    const itemIndex = cart.findIndex(
        item => item.id === productId
    );


    if (itemIndex === -1) {
        return;
    }


    if (cart[itemIndex].quantity > 1) {

        cart[itemIndex].quantity--;

    } else {

        cart.splice(itemIndex, 1);

    }


    updateCart();

}


// ===============================
// OPEN CART
// ===============================

function openCart() {

    const modal =
        document.getElementById("cartModal");

    if (modal) {

        modal.style.display = "flex";

    }

}


// ===============================
// CLOSE CART
// ===============================

function closeCart() {

    const modal =
        document.getElementById("cartModal");

    if (modal) {

        modal.style.display = "none";

    }

}


// ===============================
// CATEGORY FILTER
// ===============================

function filterCategory(category) {

    if (category === "All") {

        displayedProducts = [...products];

    } else {

        displayedProducts =
            products.filter(
                product =>
                    product.category === category
            );

    }


    loadProducts(displayedProducts);


    // Scroll to products

    document
        .getElementById("products")
        ?.scrollIntoView({
            behavior: "smooth"
        });

}


// ===============================
// SEARCH PRODUCTS
// ===============================

function searchProducts() {

    const input =
        document.getElementById("searchInput");

    const searchValue =
        input.value.toLowerCase().trim();


    displayedProducts =
        products.filter(product => {

            return (

                product.name
                    .toLowerCase()
                    .includes(searchValue)

                ||

                product.category
                    .toLowerCase()
                    .includes(searchValue)

            );

        });


    loadProducts(displayedProducts);

}


// ===============================
// SORT PRODUCTS
// ===============================

function sortProducts() {

    const select =
        document.getElementById("sortSelect");

    const sortValue =
        select.value;


    let sorted =
        [...displayedProducts];


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


    loadProducts(sorted);

}


// ===============================
// CHECKOUT
// ===============================

function checkout() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty. Please add products first."
        );

        return;

    }


    const total = cart.reduce(
        (sum, item) =>
            sum + item.price * item.quantity,
        0
    );


    const confirmation =
        confirm(
            `Your order total is ₹${total}.\n\nDo you want to place this order?`
        );


    if (!confirmation) {
        return;
    }


    // Create order object

    const order = {

        orderId:
            "ORD" +
            Date.now(),

        items:
            [...cart],

        total:
            total,

        date:
            new Date().toLocaleString(),

        status:
            "Confirmed"

    };


    // Save order locally

    const existingOrders =
        JSON.parse(
            localStorage.getItem("orders")
        ) || [];


    existingOrders.push(order);


    localStorage.setItem(
        "orders",
        JSON.stringify(existingOrders)
    );


    alert(
        `🎉 Order placed successfully!\n\nOrder ID: ${order.orderId}\nTotal: ₹${total}`
    );


    // Empty cart

    cart = [];

    updateCart();

    closeCart();

}


// ===============================
// SUCCESS MESSAGE
// ===============================

function showMessage(message) {

    const notification =
        document.createElement("div");


    notification.textContent =
        message;


    notification.style.position =
        "fixed";

    notification.style.bottom =
        "25px";

    notification.style.right =
        "25px";

    notification.style.background =
        "#15803d";

    notification.style.color =
        "white";

    notification.style.padding =
        "14px 20px";

    notification.style.borderRadius =
        "10px";

    notification.style.fontWeight =
        "600";

    notification.style.zIndex =
        "9999";

    notification.style.boxShadow =
        "0 10px 25px rgba(0,0,0,0.2)";


    document.body.appendChild(
        notification
    );


    setTimeout(() => {

        notification.remove();

    }, 2500);

}


// ===============================
// CLOSE CART WHEN CLICKING OUTSIDE
// ===============================

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
