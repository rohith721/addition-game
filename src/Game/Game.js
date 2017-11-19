import React, { Component } from 'react';
import './Game.css';
import PropType from 'prop-types';
import sampleSize from 'lodash';
import Number from '../Number/Number';
const randomNumbers=(min,max)=>{
    return Math.floor(Math.random()*(max-min))+min;
}
class Game extends React.Component{
    
    static bgColors = {
    playing: '#ccc',
    won: 'green',
    lost: 'red',
  };

    state = {
    gameStatus: 'new',
    remainingSeconds: this.props.initialSeconds,
    selectedIds: [],
  };
    
    challengeNumber = Array.
    from({ length: this.props.challengeSize }).
    map(()=>randomNumbers(...this.props.challengerangeNumbers));
    
    targetNumber = [this.challengeNumber[Math.floor(Math.random()*this.challengeNumber.length)],
    this.challengeNumber[Math.floor(Math.random()*this.challengeNumber.length)],
    this.challengeNumber[Math.floor(Math.random()*this.challengeNumber.length)],
    this.challengeNumber[Math.floor(Math.random()*this.challengeNumber.length)]
].reduce((acc,curr)=>acc+curr);

componentDidMount() {
    if (this.props.autoPlay) {
      this.startGame();
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  startGame =()=>{
    this.setState({ gameStatus: 'playing' }, () => {
      this.intervalId = setInterval(() => {
        this.setState((prevState) => {
          const newRemainingSeconds = prevState.remainingSeconds - 1;
          if (newRemainingSeconds === 0) {
            clearInterval(this.intervalId);
            return { gameStatus: 'lost', remainingSeconds: 0 };
          }
          return { remainingSeconds: newRemainingSeconds };
        });
      }, 1000);
    });
  };

isNumberAvailable = (numberIndex) =>

    this.state.selectedIds.indexOf(numberIndex) === -1;

  selectNumber = (numberIndex) => {
    if (this.state.gameStatus !== 'playing') {
      return;
    }
    this.setState(
      (prevState) => ({
        selectedIds: [...prevState.selectedIds, numberIndex],
        gameStatus: this.calcGameStatus([
          ...prevState.selectedIds,
          numberIndex,
        ]),
      }),
      () => {
        if (this.state.gameStatus !== 'playing') {
          clearInterval(this.intervalId);
        }
      }
    );
  };

  calcGameStatus = (selectedIds) => {
    const sumSelected = selectedIds.reduce(
      (acc, curr) => acc + this.challengeNumber[curr],
      0
    );
    if (sumSelected < this.targetNumber) {
      return 'playing';
    }
    return sumSelected === this.targetNumber ? 'won' : 'lost';
  };

    render() {
        const { gameStatus, remainingSeconds } = this.state;
    return (
      <div className="game">

        <div className="target" 
         style={{ backgroundColor: Game.bgColors[this.state.gameStatus] }}>{this.state.gameStatus === 'new' ? '?' : this.targetNumber}</div>
        <div className="challenge-numbers">
            {this.challengeNumber.map((value,index)=>
            <Number key={index} 
                   id={index}
                  value={this.state.gameStatus === 'new' ? '?' : value}
                   clickable={this.isNumberAvailable(index)} 
                   onClick={this.selectNumber}
                   />)}
         
        </div>

       <div className="footer">
          {gameStatus === 'new' ? (
            <button onClick={this.startGame}>Start</button>
          ) : (
            <div className="timer-value">{remainingSeconds}</div>
          )}
          {['won', 'lost'].includes(gameStatus) && (
            <button onClick={this.props.onPlayAgain}>Play Again</button>
          )}
        </div>

      </div>
    );}
}
export default Game;