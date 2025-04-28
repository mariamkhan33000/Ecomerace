import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js'
import orderRoute from './routes/ordrerRoutes.js'
import cartRoute from './routes/cartRoutes.js'
import brandRoutes from './routes/brandRoutes.js'
import categoryRoute from './routes/categoryRoutes.js'
import cors from 'cors'
import connectedDb from './database/db.js';
import morgan from 'morgan';
import productRoute from './routes/productRoutes.js'
dotenv.config()

const app = express()

const PORT = process.env.PORT || 4002;


app.use(express.json())
app.use(morgan("tiny"))
app.use(cookieParser())
app.use(cors({
    credentials : true,
    origin:process.env.ORGIN
}))

app.use('/auth', authRoutes)
app.use('/product', productRoute)
app.use('/orders', orderRoute)
app.use('/carts', cartRoute)
app.use('/brands', brandRoutes)
app.use('/categories', categoryRoute)


app.listen(PORT, () => {
    console.log(`Server in runnig at Port ${PORT} Successfully . . . . .`)
    connectedDb()
})




