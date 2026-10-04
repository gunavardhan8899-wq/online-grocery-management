const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;


// Order Schema

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true
        },

        customerName: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        address: {
            type: String,
            required: true
        },

        items: [
            {
                productId: String,

                name: String,

                price: Number,

                quantity: Number,

                unit: String,

                image: String
            }
        ],

        total: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            default: "Confirmed"
        }
    },
    {
        timestamps: true
    }
);


const Order =
    mongoose.models.Order ||
    mongoose.model("Order", orderSchema);


// Connect MongoDB

async function connectDatabase() {

    if (mongoose.connection.readyState === 0) {

        await mongoose.connect(MONGODB_URI);

    }

}


// Netlify Function

exports.handler = async function(event) {

    try {

        await connectDatabase();


        // CORS

        const headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
        };


        // OPTIONS

        if (event.httpMethod === "OPTIONS") {

            return {
                statusCode: 200,
                headers,
                body: ""
            };

        }


        // GET ORDERS

        if (event.httpMethod === "GET") {

            const orders =
                await Order.find()
                    .sort({ createdAt: -1 });


            return {

                statusCode: 200,

                headers,

                body: JSON.stringify(orders)

            };

        }


        // CREATE ORDER

        if (event.httpMethod === "POST") {

            const data =
                JSON.parse(event.body);


            if (
                !data.customerName ||
                !data.phone ||
                !data.address ||
                !data.items ||
                data.items.length === 0
            ) {

                return {

                    statusCode: 400,

                    headers,

                    body: JSON.stringify({
                        message:
                            "Please provide all customer and order details"
                    })

                };

            }


            const order =
                await Order.create({

                    orderId:
                        "ORD" + Date.now(),

                    customerName:
                        data.customerName,

                    phone:
                        data.phone,

                    address:
                        data.address,

                    items:
                        data.items,

                    total:
                        Number(data.total),

                    status:
                        "Confirmed"

                });


            return {

                statusCode: 201,

                headers,

                body: JSON.stringify({

                    message:
                        "Order placed successfully",

                    order

                })

            };

        }


        // INVALID METHOD

        return {

            statusCode: 405,

            headers,

            body: JSON.stringify({

                message:
                    "Method not allowed"

            })

        };


    } catch (error) {

        console.error(error);


        return {

            statusCode: 500,

            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },

            body: JSON.stringify({

                message:
                    "Server error",

                error:
                    error.message

            })

        };

    }

};
