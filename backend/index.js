const express =require("express")
const app = express()
const http = require("http")
const cors = require("cors")
const {Server} = require("socket.io")

app.use(cors())
//Crear un server
const server = http.createServer(app)

const io = new Server(server,{
    cors: {
        //origen
        //peticiones llegan por el puerto 3001
        origin:"http://localhost:5173",
        methods: ["GET","POST"]

    }
})

io.on("connection", (socket)=>{
    //imprimir le id del socket
    console.log(`Usuario actual: ${socket.id}`)


    //cuando se une a la sala
    socket.on("join_room", (data)=>{
        socket.join(data)
        //imprimir cuando entra
        console.log(`Usuario con id: ${socket.id} se unio a la sala: ${data}`);

    })
    //cuando se envia un mensaje
    socket.on("send_message", (data)=>{
         socket.to(data.room).emit("receive_message",data);
        //recibe el mensaje
        //manda al usuario en la sala con emit.to, la sala viene de lso campos
        //esa sala recibe el mensaje
        //receive_message

        

    })

    //tomar socket y cuando nods desconectemos
    socket.on("disconnect", () =>{

        console.log("Usuario desconectado", socket.id)

    })
})

//Escuchar server
server.listen(3001, ()=> {
    console.log("Servidor funcionando bien fresco ")
} )
