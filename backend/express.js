require('dotenv').config();

const express=require('express')
const mongoose = require("mongoose");
const cors=require('cors')
const app=express()


app.use(express.json())
app.use(cors())


mongoose.connect(process.env.MONGO_URI)
.then(() => 
console.log("Connected DB:", mongoose.connection.db.databaseName))
.catch(err => console.log(err));

const orderSchema= new mongoose.Schema({
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

    landmark: {
        type: String
    },

    items: [
        {
            name: String,
            price: Number,
            quantity: Number
        }
    ],

    total: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        default: "Pending"
    },

    orderDate: {
        type: Date,
        default: Date.now
    }
})



const order=mongoose.model("orderData",orderSchema)

app.post('/orders', async (req, res) => {
    try {

        const orderData = req.body;

        if (!orderData.items || orderData.items.length === 0) {
            return res.status(400).send("Cart is empty");
        }

        await order.create(orderData);

        res.status(201).send("Order placed");

    } catch(err) {

        console.log(err);
        res.status(500).send("Server Error");

    }
});


app.get('/admin/dashboard', async (req, res) => {

    try {

        const orders = await order.find().sort({ _id: -1 });

        const totalOrders = orders.length;

        const pendingOrders = orders.filter(
            item => item.status === "Pending"
        ).length;

        const deliveredOrders = orders.filter(
            item => item.status === "Delivered"
        ).length;

        const revenue = orders.reduce((sum, item) => {

            if(item.status === "Delivered"){
                return sum + Number(item.total);
            }

            return sum;

        }, 0);

        res.json({
            totalOrders,
            pendingOrders,
            deliveredOrders,
            revenue,
            recentOrders: orders.slice(0, 10)
        });

    } catch(err) {

        console.log(err);

        res.status(500).json({
            message:"Server Error"
        });

    }

});

app.get('/orders', async (req,res) => {
    const orders = await order.find().sort({ orderDate: -1 });
    res.json(orders);
});

app.patch('/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedOrder = await order.findByIdAndUpdate(
            id,
            {status},
            { new: true }
        );

        res.json(updatedOrder);

    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});





// this request gets product from the database


const productSchema = new mongoose.Schema({}, {
    strict: false,          // Jo bhi fields collection me hain, sab allow
    collection: "Products"  // Existing collection ka naam
});

const Product = mongoose.model("Product", productSchema);


app.get('/products', async (req, res) => {
    try {

        const products = await Product.find();
        console.log(products)

        res.json(products);

    } catch (err) {

        console.log(err);
        res.status(500).send("Server Error");

    }
});

// this code wil help admin to update the price
app.patch('/products/:id', async (req, res) => {

    try {
        if(req.body.price <= 0){
        return res.status(400).send("Invalid Price");
          }
          
        const updatedProduct =
            await Product.findByIdAndUpdate(
                req.params.id,
                {
                    price: req.body.price
                },
                {
                    new: true
                }
            );

        res.json(updatedProduct);

    } catch (err) {

        console.log(err);
        res.status(500).send("Server Error");

    }
});

app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});


module.exports=app;