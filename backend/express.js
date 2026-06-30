require('dotenv').config();

const express=require('express')
const mongoose = require("mongoose");
const cors=require('cors')
const app=express()
const bcrypt=require('bcrypt')

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

// schema for admin 
const adminSchema =new mongoose.Schema({
    email:String,
    password:String,
});

// mongoose model for the admin its necessary

const admin= mongoose.model("Admin",adminSchema);

// this is the checkpoint for login of admin

app.post('/login',async (req,res)=>{
    const{email,password}=req.body

    const admin= await Admin.findOne({email:email})

    // this is the check point logic for Email
     if(!admin){
        return res.status(401).json({
             message:"invalid Email"
        })
     }
    
     // this is the check point logic for password
     
     const isMatch= await bcrypt.compare(password,admin.password)
     
     if(!isMatch){
        return res.status(401).json({
            message:"Invalid Password"
        });
     }
     
     // creation of jwt token 
     const Token= Jwt.sign({
        id:admin.id,
        email:admin.email
     },
      process.env.JWT_SECRET,
     {
       expiresIn:"30min"
     }
    
    
    )
     res.json({
        message:"login sucessful",
        Token
     })
})


// this is for the admin dashboard 
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


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});