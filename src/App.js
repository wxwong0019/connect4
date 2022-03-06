import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  var initialBoard = [];
  for(let i=0; i<6; i++){
    var colArray = [];
    for(let i=0; i<7; i++){
      colArray.push(null);
    }
    initialBoard.push(colArray);
  }
  initialBoard[0][2] = 1
  const [currentPlayer, setCurrentPlayer] = useState("blue")
  const [board, setBoard] = useState(initialBoard)
  
  const checkBoard = (x,y) => {
    if(board[x][y]){
      return true;
    }
    return false;
  }
  console.log(board)
  
  var rowArray = [];
  for(let i=0; i<6; i++){
    var colArray= [];
    for(let j=0; j<7; j++){
      const handleClick =(e) =>{
        console.log("i :"+i+" j :"+j);
      }
      colArray.push(
        <div style={ {border:"1px solid black", backgroundColor:'black', width:'10vw', height:'10vw', display:'flex'}} onClick={handleClick}>
          <div style={{borderRadius:"50%", backgroundColor:'white', display:'flex', width:'70%', height:'70%', marginLeft:'10px', padding:1} }>
            {checkBoard(i,j) ? <div style={{ backgroundColor:currentPlayer, borderRadius:"50%",flex:1}} /> : null}  
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
