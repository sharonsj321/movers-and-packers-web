require('dotenv').config()  //applistening
const cors = require("cors");
const express=require('express')
const connectDb=require('./src/config/Db')
const authroutes=require('./src/routes/authroutes')
const adminroutes=require('./src/routes/adminroutes')
const serviceRoutes = require("./src/routes/serviceRoutes");
const userRoutes= require("./src/routes/userRoutes")
const bookingRoutes=require("./src/routes/bookingroutes")
const carShiftingRoutes = require("./src/routes/carShiftingRoutes"); // ✅ Correct route
const houseShiftingRoutes = require("./src/routes/houseShiftingRoutes");
const officeShiftingRoutes = require("./src/routes/officeShiftingRoutes");
const domesticShiftRoutes=require("./src/routes/domesticShiftRoutes")
const paymentRoutes = require("./src/routes/paymentroutes");
// const Razorpay = require("razorpay");

// const razorpayInstance = new Razorpay({
//     key_id: process.env.RZP_KEY_ID, // ✅ Correct key name
//     key_secret: process.env.RZP_KEY_SECRET,
//   });

// const paymentRoutes = require("./src/routes/paymentroutes");
// const Razorpay = require("razorpay");

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });


const app=express()
connectDb()

app.get('/',(req,res)=>{
    res.send("Hello World")
})

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes); // Add user routes


app.use('/api/auth',authroutes)       //  /api/auth ennu vannal auth routine vilikan parayunnu
app.use('/api/admin',adminroutes)

// app.use("/api/payment", paymentRoutes);


// Import and use service routes
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/car-shifting", carShiftingRoutes);
app.use("/api/house-shifting", houseShiftingRoutes);
app.use("/api/office-shifting", officeShiftingRoutes);
app.use("/api/domestic-shift", domesticShiftRoutes);
app.use("/api/payments", paymentRoutes);



app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
  
// app.use("/api/vehicles", vehicleRoutes);





port=process.env.PORT
console.log(port)

app.listen(port,()=>{
    console.log(`listening to the port ${port}`)
    
})
