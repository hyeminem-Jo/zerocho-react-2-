import React, { Component } from "react";
import Ball from "./Ball";

function getWinNumbers() {
  // console.log("getWinNumbers");
  const candidate = Array(45)
    .fill()
    .map((v, i) => i + 1);
  const shuffle = [];
  while (candidate.length > 0) {
    const randomIndex = Math.floor(Math.random() * candidate.length);
    // candidate.splice(randomIndex, 3) = [1, 2, 15]
    const value = candidate.splice(randomIndex, 1)[0];
    shuffle.push(value);
  }

  const bonusNumber = shuffle[shuffle.length - 1]; // 맨 끝에 배치
  const winNumbers = shuffle.slice(0, 6).sort((a, b) => a - b);
  return [...winNumbers, bonusNumber]; // 랜덤공 + 보너스공 합치기
}

class Lotto extends Component {
  state = {
    winNumbers: getWinNumbers(), // 당첨 숫자들 (미리 뽑아두고 하나씩 보여주기)
    winBalls: [], // 화면
    bonus: null,
    redo: false, // 재실행
  };

  timeouts = [];

  // 처음 시작 하자마자 실행되기 때문에 componentDidMount
  // 보통 비동기에 변수를 같이 쓰면 클로저 문제가 생기는데, let 을 쓰면 발생하지 않는다. (예전 var 를 썼을 때 비동기에서 클로저가 많이 발생함);
  componentDidMount() {
    this.runTimeouts();
  }

  // 중복 코드(공 랜덤으로 나오는 효과) 리팩토링
  runTimeouts = () => {
    const { winNumbers } = this.state;
    for (let i = 0; i < winNumbers.length - 1; i++) {
      // 마지막 bonus 공을 넣기 위해 1을 빼줌 (6개)
      this.timeouts[i] = setTimeout(() => {
        this.setState((prevState) => {
          return {
            // 리액트에서 배열에 무언갈 push 할 땐 다음과 같이 전개연산자로 추가
            // => 별개의 새로운 배열로 반환되어 state 가 바뀐 것으로 인지되기 때문에
            winBalls: [...prevState.winBalls, winNumbers[i]],
          };
        });
      }, (i + 1) * 1000);
    }
    this.timeouts[6] = setTimeout(() => {
      this.setState({
        bonus: winNumbers[6],
        redo: true,
      });
    }, 7000);
  }

  // 업데이트 하고 싶은 상황 처리 (리렌더링)
  // componentDidUpdate 에서는 조건문이 중요하다.
  // >> 그렇지 않으면 setState 가 될 때마다 리렌더링 후에 발생하는 coomponentDidUpdte 가 계속 실행되기 때문이다.
  // 그렇기 때문에 "onClickRedo 가 실행되어야 실행" 이라는 조건을 걸어줌
  // onClickRedo 때 바뀌는 상황을 조건으로 걸어 조건에 해당되면 시행되도록 해줌
  //ex) onClickRedo 에서 winBalls 를 [] 로 비워줬을 때, 조건
  // => if (winBalls.length === 0) {}
  componentDidUpdate(prevProps, prevState) {
    if (this.state.winBalls.length === 0) {
      this.runTimeouts();
    }
  }
  
  componentWillUnmount() {
    this.timeouts.forEach((v) => {
      clearTimeout(v);
    });
  }

  // 초기화 후 다시 실행하는 버튼
  onClickRedo = () => {
    this.setState({
      winNumbers: getWinNumbers(),
      winBalls: [],
      bonus: null,
      redo: false,
    });
    this.timeouts = [];
  };

  render() {
    const { winBalls, bonus, redo } = this.state;
    return (
      <>
        <div>당첨 숫자</div>
        <div id="result">
          {winBalls.map((v) => (
            <Ball key={v} number={v} />
          ))}
        </div>
        <div>보너스!</div>
        {bonus && <Ball number={bonus} />}
        {redo && <button onClick={this.onClickRedo}>한 번더</button>}
        {/* <button onClick={redo ? this.onClickRedo : () => {}}>한번 더!</button> */}
      </>
    );
  }
}

export default Lotto;
