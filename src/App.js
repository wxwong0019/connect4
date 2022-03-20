import './App.css';
import { useEffect, useState } from 'react';
// import socket from './socket';
import io from 'socket.io-client'

const socket = io('http://localhost:8000')


function App() {
  var initialBoard = new Array();
  for(let i=0; i<6; i++){
    var subArray = new Array(7).fill(null)

    initialBoard.push(subArray);
  }
  
  const [currentPlayer, setCurrentPlayer] = useState("blue")
  const [myColor, setMyColor] = useState()
  const [board, setBoard] = useState([...initialBoard])
  const [winner, setWinner] = useState("none");
  const [currMove, setCurrMove] = useState([])
  const [roomId, setRoomId] = useState()
  useEffect(()=>{
    // if(roomId === undefined){
      socket.on("connect", ()=> {
        if(roomId === undefined){
          console.log('setting Room ID')
          setRoomId(socket.id)
        }
        
      })
    // }
    
    console.log("myColor :"+myColor);
    console.log("currentPlayer :"+currentPlayer);
  
    socket.on("set-initial-color", (opponentInitialColor)=> {
      console.log("opponentInitialColor :"+opponentInitialColor);
      if(opponentInitialColor === "blue"){
        
        setMyColor("red")
      }else{
        setMyColor("blue")
      }
      // else{
      //   setMyColor("blue")
      //   socket.emit("initial-color-&id", "blue",socket.id)
      // }
    })
    if(myColor === undefined){
      console.log("first to set blue")
      setMyColor("blue")
      // socket.emit("initial-color-&id", "blue", socket.id)
    }
    
    if(currMove[0]){
      checkBoard(currMove[0],currMove[1]);
    }
    socket.on("opponent-move", (opponentMove, opponentColor)=> {
      console.log(opponentMove)
        if(opponentMove.length ===0){
          if(opponentColor === "blue"){
            setMyColor("red")
          }else{
            setMyColor("blue")
          }
          
        }
        console.log("opponentColor : "+opponentColor)
        if(opponentMove.length !==0 && currMove[0] !== opponentMove[0] && currMove[1] !== opponentMove[1]){
          // console.log("entered setBoard")
          setBoard(prevBoard => {
            const newBoard = [...prevBoard];
            const newBoardRow= [...newBoard[opponentMove[0]]]
            newBoardRow[opponentMove[1]] = opponentColor
            newBoard[opponentMove[0]] = newBoardRow
            setCurrMove([opponentMove[0],opponentMove[1]])
            return newBoard
          })
        }
        if(opponentColor == "blue"){
          setCurrentPlayer("red")
        }else{
          setCurrentPlayer("blue")
        }
    })    
  },[board,winner,currentPlayer, myColor, roomId])
  const handleReset = () =>{
    console.log(initialBoard)
    setBoard(initialBoard);
    setWinner("none")
    setCurrMove([])
  }

  const checkBoard = (x, y) => {
    var count = 0;
    var tempX = x;
    var tempY = y
    var currColor = board[x][y];
    //check vertically
    while (tempX >= 0) {
      if (board[tempX][y] === currColor) {
        count++;
      } else {
        break;
      }
      tempX--;
    }
    tempX = x+1;
    while (tempX <= 5) {
      if (board[tempX][y] === currColor) {
        count++;
      } else {
        break;
      }
      tempX++;
    }
    if (count === 4) {
      console.log("Win vertically :"+count)
      setWinner(currColor);
      return;
    }

    //check horizontally
    count = 0;
    while (tempY >= 0) {
      if (board[x][tempY] === currColor) {
        count++;
      } else {
        break;
      }
      tempY--;
    }
    tempY = y+1;
    while (tempY <= 6) {
      if (board[x][tempY] === currColor) {
        count++;
      } else {
        break;
      }
      tempY++;
    }
    if (count === 4) {
      setWinner(currColor);
      return;
    }

    //check diagonal one
    tempX = x;
    tempY = y;
    count = 0;
    while (tempX >= 0 && tempY >= 0) {
      if (board[tempX][tempY] === currColor) {
        count++;
      } else {
        break;
      }
      tempX--;
      tempY--;
    }
    tempX = x+1;
    tempY = y+1;
    while (tempX <= 5 && tempY <= 6) {
      if (board[tempX][tempY] === currColor) {
        count++;
      } else {
        break;
      }
      tempX++;
      tempY++;
    }
    if (count === 4) {
      setWinner(currColor);
      return;
    }

    //check diagonal two
    tempX = x;
    tempY = y;
    count = 0;
    while (tempX <= 5 && tempY >= 0) {
      if (board[tempX][tempY] === currColor) {
        count++;
      } else {
        break;
      }
      tempX++;
      tempY--;
    }
    tempX = x-1;
    tempY = y+1;
    while (tempX >= 0 && tempY <= 6) {
      if (board[tempX][tempY] === currColor) {
        count++;
      } else {
        break;
      }
      tempX--;
      tempY++;
    }
    if (count === 4) {
      setWinner(currColor);
      return;
    }
  }
  const handleIdInput = (e) =>{
    setRoomId(e.target.value)
  }
  const handleJoinRoom = (e) =>{
    e.preventDefault();
    socket.emit("initial-color-&id", "blue", socket.id)
    console.log("handle Join Room")
  }
  const renderBoard = () => {
    // console.log("rendering Board ....")
   
    var rowArray = [];
    for (let i = 0; i < 6; i++) {
      var colArray = [];
      for (let j = 0; j < 7; j++) {

        const handleClick = (e) => {
          if(currentPlayer !== myColor) {
            console.log("it's not your turn!")
            return;
          }
          if (winner !== "none") {
            console.log("there is a winner :" + winner)
            return;
          }

          var topPiece = 5;
          while (topPiece >= 0 && (board[topPiece][j] === "red" || board[topPiece][j] === "blue")) {
            topPiece--;
          }
          if (topPiece < 0) {
            console.log("topepiece :" + topPiece)
            return
          }
          setBoard(prevBoard => {
            const newBoard = [...prevBoard];
            const newBoardRow= [...newBoard[topPiece]]
            newBoardRow[j] = currentPlayer
            newBoard[topPiece] = newBoardRow
            setCurrMove([topPiece,j])
            return newBoard
          })
          var tempCurrentPlayer = null;
          socket.emit("from-client", [topPiece,j], currentPlayer, roomId)
          currentPlayer === "blue" ? tempCurrentPlayer = "red" : tempCurrentPlayer = "blue"
          setCurrentPlayer(tempCurrentPlayer)
          
        }

        colArray.push(
          <div key={j} style={{ border: "1px solid black", backgroundColor: 'black', width: '10vw', height: '10vw', display: 'flex' }} onClick={handleClick}>
            <div style={{ borderRadius: "50%", backgroundColor: 'white', display: 'flex', width: '70%', height: '70%', marginLeft: '10px', marginTop: '10px', padding: 1 }}>
              {board[i][j] ? <div style={{ backgroundColor: board[i][j], borderRadius: "50%", flex: 1 }} /> : null}
            </div>

          </div>
        )
      }
      rowArray.push(
        <div key={i} style={{ display: 'flex', flexDirection: 'row' }}>{colArray}</div>
      )
    }
    return rowArray;
  }


  return (
    <div className="App">
      <div>Room id : {roomId}</div>
      <form onSubmit={handleJoinRoom}>
        <input onChange={handleIdInput}></input>
        <button type="submit">join room</button>
      </form>
      <div>{ <h1> you are {myColor}</h1>}</div>
      <div style={{margin:"auto",width:"80%" }}>{renderBoard()}</div>
      <div>{winner !== "none" ? <h1> Winner is {winner} <button onClick={handleReset}>reset</button></h1> : null}</div>
    </div>
  );
}

export default App;
