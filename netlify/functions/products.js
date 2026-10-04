const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        unit: {
            type: String,
            required: true
        },

        image: {
            type: String,
            default: "🛒"
        },

        stock: {
            type: Number,
            default: 100
        }
    },
    {
        timestamps: true
    }
);

const Product =
    mongoose.models.Product ||
    mongoose.model("Product", productSchema);


async function connectDatabase() {

    if (mongoose.connection.readyState === 0) {

        await mongoose.connect(MONGODB_URI);

    }

}


exports.handler = async function(event) {

    try {

        await connectDatabase();


        // GET PRODUCTS

        if (event.httpMethod === "GET") {

            const products =
                await Product.find()
                    .sort({ createdAt: -1 });

            return {

                statusCode: 200,

                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },

                body: JSON.stringify(products)

            };

        }


        // ADD PRODUCT

        if (event.httpMethod === "POST") {

            const data =
                JSON.parse(event.body);


            const product =
                await Product.create({

                    name: data.name,

                    category: data.category,

                    price: Number(data.price),

                    unit: data.unit,

                    image: data.image || "🛒",

                    stock:
                        Number(data.stock) || 100

                });


            return {

                statusCode: 201,

                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },

                body: JSON.stringify(product)

            };

        }


        return {

            statusCode: 405,

            body: JSON.stringify({
                message: "Method not allowed"
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
