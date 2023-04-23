require("dotenv").config();
const Product = require("./models/Product");
const Order = require("./models/Order");
const productsJson = require("./mockData/products.json");
const ordersJson = require("./mockData/orders.json");
const connectDB = require("./db/connect");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.create(productsJson);

    // await Order.deleteMany();
    // await Order.create(ordersJson);
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
