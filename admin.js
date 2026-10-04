const PRODUCT_API = "/.netlify/functions/products";
const ORDER_API = "/.netlify/functions/orders";


// Load dashboard when page opens

document.addEventListener("DOMContentLoaded", () => {

    loadProducts();

    loadOrders();

});


// ==========================================
// ADD PRODUCT
// ==========================================

const productForm =
    document.getElementById("productForm");


productForm.addEventListener("submit", async function(event) {

    event.preventDefault();


    const product = {

        name:
            document.getElementById("productName").value,

        category:
            document.getElementById("productCategory").value,

        price:
            Number(
                document.getElementById("productPrice").value
            ),

        unit:
            document.getElementById("productUnit").value,

        image:
            document.getElementById("productImage").value || "🛒",

        stock:
            Number(
                document.getElementById("productStock").value
            )

    };


    try {

        const response =
            await fetch(PRODUCT_API, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(product)

            });


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message || "Failed to add product"
            );

        }


        alert("✅ Product added successfully!");


        productForm.reset();


        document.getElementById("productStock").value = 100;


        loadProducts();


    } catch (error) {

        console.error(error);

        alert(
            "❌ Error adding product: " +
            error.message
        );

    }

});



// ==========================================
// LOAD PRODUCTS
// ==========================================

async function loadProducts() {

    const container =
        document.getElementById("adminProducts");


    try {

        const response =
            await fetch(PRODUCT_API);


        const products =
            await response.json();


        if (!response.ok) {

            throw new Error(
                products.message || "Failed to load products"
            );

        }


        document.getElementById("totalProducts")
            .textContent = products.length;


        if (products.length === 0) {

            container.innerHTML =
                "<p>No products found.</p>";

            return;

        }


        container.innerHTML = products.map(product => `

            <div class="admin-product-card">

                <div class="admin-product-info">

                    <span class="admin-product-image">
                        ${product.image || "🛒"}
                    </span>

                    <div>

                        <h3>
                            ${product.name}
                        </h3>

                        <p>
                            ${product.category}
                        </p>

                        <p>
                            ₹${product.price}
                            / ${product.unit}
                        </p>

                        <p>
                            Stock:
                            ${product.stock}
                        </p>

                    </div>

                </div>

            </div>

        `).join("");


    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <p>
                ❌ Unable to load products.
            </p>
        `;

    }

}



// ==========================================
// LOAD ORDERS
// ==========================================

async function loadOrders() {

    const container =
        document.getElementById("adminOrders");


    try {

        const response =
            await fetch(ORDER_API);


        const orders =
            await response.json();


        if (!response.ok) {

            throw new Error(
                orders.message || "Failed to load orders"
            );

        }


        document.getElementById("totalOrders")
            .textContent = orders.length;


        // Calculate total sales

        const totalSales =
            orders.reduce(
                (sum, order) =>
                    sum + Number(order.total || 0),
                0
            );


        document.getElementById("totalSales")
            .textContent =
                "₹" + totalSales.toLocaleString("en-IN");


        if (orders.length === 0) {

            container.innerHTML =
                "<p>No orders found.</p>";

            return;

        }


        container.innerHTML = orders.map(order => `

            <div class="admin-order-card">

                <div class="order-header">

                    <h3>
                        ${order.orderId}
                    </h3>

                    <span class="order-status">
                        ${order.status}
                    </span>

                </div>


                <p>
                    <strong>Customer:</strong>
                    ${order.customerName}
                </p>


                <p>
                    <strong>Phone:</strong>
                    ${order.phone}
                </p>


                <p>
                    <strong>Address:</strong>
                    ${order.address}
                </p>


                <p>
                    <strong>Total:</strong>
                    ₹${order.total}
                </p>


                <p>
                    <strong>Date:</strong>
                    ${new Date(
                        order.createdAt
                    ).toLocaleString("en-IN")}
                </p>


                <h4>Items</h4>


                <ul>

                    ${order.items.map(item => `

                        <li>
                            ${item.image || "🛒"}
                            ${item.name}
                            × ${item.quantity}
                            — ₹${item.price}
                        </li>

                    `).join("")}

                </ul>

            </div>

        `).join("");


    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <p>
                ❌ Unable to load orders.
            </p>
        `;

    }

}
