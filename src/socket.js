import io from 'socket.io-client'

const socket = io('http://localhost:8000')

socket.on("connect", ()=> {
    console.log("client connected lool")
})

export default socket