import express from 'express'
import cors from 'cors';
import 'dotenv/config'
import connectDB from './configs/db.js';
import adminRouter from './routes/adminRoutes.js';
import menuRouter from './routes/menuRoutes.js';
import orderRouter from './routes/orderrRoutes.js';
 

 const app = express();

 await connectDB();

 app.use(cors())
 app.use(express.json());

 app.get('/',(req, res)=> res.send("API is Running"))
 app.use('/api/admin',adminRouter)
 app.use('/api/menu',menuRouter)
 app.use('/api/order',orderRouter)


 const PORT = process.env.PORT || 7000;


 app.listen(PORT,()=>{
    console.log('server is running on ' + PORT)
});

export default app;