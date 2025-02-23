const dotenv = require('dotenv')
dotenv.config()
const cookieParser = require('cookie-parser')
const express = require('express')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const connectDB = require('./config/db')
const user = require('./routes/userRoutes')
const chat = require('./routes/chatRoutes')
const message = require('./routes/messageRoutes')
const { errorHandler, notFound } = require('./middlewares/errorHandler')
const app = express()


//connect database

connectDB()

//middlewares

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(fileUpload())


//routes

app.use('/api/v1/users', user)
app.use('/api/v1/chats',chat)
app.use('/api/v1/messages', message)


//error middlewares

app.use(notFound)
app.use(errorHandler)

const server = app.listen(process.env.PORT, (req, res)=>{
    console.log('Server up and running')
})

const io = require('socket.io')(server,{
    cors :{
        origin: process.env.CLIENT_URL,
        credentials: true
    },
    pingTimeout: 60000
})

io.on('connection', (socket)=>{
    console.log('connected to socket.io')
})