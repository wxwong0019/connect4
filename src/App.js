import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  var initialBoard = new Array();
  for(let i=0; i<6; i++){
    var subArray = new Array(7)

    initialBoard.push(subArray);
  }
  const [currentPlayer, setCurrentPlayer] = useState("blue")
  const [board, setBoard] = useState(initialBoard)
  const [winner, setWinner] = useState("none");
  
  const checkBoard = (x,y) => {
    var count = 0;
    var tempX = x;
    var tempY = y
    var currColor = board[x][y];

    //check horizontally
    while(tempX>=0){
      if(board[tempX][y] === currColor){
        count++;
      }else{
        break;
      }
      tempX--;
    }
    tempX = x;
    while(tempX <= 5){
      if(board[tempX][y] === currColor){
        count++;
      }else{
        break;
      }
      tempX++;
    }
    if(count === 4) {
      setWinner(currColor);
      return;
    }

    //check vertically
    count = 0;
    while(tempY>=0){
      if(board[x][tempY] === currColor){
        count++;
      }else{
        break;
      }
      tempY--;
    }
    tempY = y;
    while(tempY <= 6){
      if(board[x][tempY] === currColor){
        count++;
      }else{
        break;
      }
      tempY++;
    }
    if(count === 4) {
      setWinner(currColor);
      return;
    }

    //check diagonal one
    tempX = x;
    tempY = y;
    count = 0;
    while(tempX >= 0 && tempY >=0){
      if(board[tempX][tempY] === currColor){
        count++;
      }else{
        break;
      }
      tempX--;
      tempY--;
    }
    tempX = x;
    tempY = y;
    while(tempX <= 5 && tempY <= 6 ){
      if(board[tempX][tempY] === currColor){
        count++;
      }else{
        break;
      }
      tempX++;
      tempY++;
    }
    if(count === 4) {
      setWinner(currColor);
      return;
    }

    //check diagonal two
    tempX = x;
    tempY = y;
    count = 0;
    while(tempX <= 5 && tempY >=0){
      if(board[tempX][tempY] === currColor){
        count++;
      }else{
        break;
      }
      tempX++;
      tempY--;
    }
    tempX = x;
    tempY = y;
    while(tempX >= 0 && tempY <= 6 ){
      if(board[tempX][tempY] === currColor){
        count++;
      }else{
        break;
      }
      tempX--;
      tempY++;
    }
    if(count === 4) {
      setWinner(currColor);
      return;
    }
  }
  
  var rowArray = [];
  for(let i=0; i<6; i++){
    var colArray= [];
    for(let j=0; j<7; j++){
      
      const handleClick =(e) =>{
        if(winner !== "none"){
          return;
        }else{
          console.log("next move")
        }
        console.log("i :"+i+" j :"+j);
        var topPiece = 5;
        while(topPiece>=0 && board[topPiece][j] ){
          topPiece--;
        }
        if(topPiece<0){
          return
        }
        setBoard(prevBoard => {
          const newBoard = [...prevBoard];
          // const newBoardRow= [...newBoard[topPiece]]
          // newBoardRow[j] = currentPlayer
          // newBoard[topPiece] = newBoardRow
          newBoard[topPiece][j] = currentPlayer
          // const newBoard = prevBoard.map((row,id) => {
          //   if(id === topPiece){
          //     const newBoardRow = row.map((piece, id) => {
          //       if(id === j){
          //         return currentPlayer;
          //       }else{
          //         return piece
          //       }
          //     })
          //     return newBoardRow
          //   }else{
          //     return row;
          //   }
          // })
          return newBoard
        })
        currentPlayer === "blue" ? setCurrentPlayer("red") : setCurrentPlayer("blue")
        checkBoard(i,j);
        console.log(board);
        console.log("winner is :"+winner)
      }

      colArray.push(
        <div style={ {border:"1px solid black", backgroundColor:'black', width:'10vw', height:'10vw', display:'flex'}} onClick={handleClick}>
          <div style={{borderRadius:"50%", backgroundColor:'white', display:'flex', width:'70%', height:'70%', marginLeft:'10px',marginTop:'10px', padding:1} }>
            {board[i][j] ? <div style={{ backgroundColor:board[i][j], borderRadius:"50%",flex:1}} /> : null}  
          </div> 

        </div>
      )
    }
    rowArray.push(
      <div style={{display:'flex', flexDirection:'row'}}>{colArray}</div>
    )
  }

  return (
    <div className="App">
      <div>{rowArray}</div>
    </div>
  );
}

export default App;
