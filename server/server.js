import express from "express"
import cors from "cors"
import "dotenv/config"
import cookieParser from "cookie-parser"
import connectDB from "./config/db.js"
import authRouter from "./routes/AuthRoutes.js"

const app = express()
const port = process.env.PORT || 4000

connectDB()
app.use(cors({credentials:true}))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

//API Endpoints
app.get("/", (req, res) => {
    res.send("Hello World")
})

app.use("/api/auth", authRouter)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})