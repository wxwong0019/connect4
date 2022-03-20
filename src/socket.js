import io from 'socket.io-client'

const socket = io('http://localhost:8000')

socket.on("connection", ()=> {
    console.log("client connected lool")
})

export default socket