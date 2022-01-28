import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Ball from "./Ball";

// state 안쓰는 함수는 class 나 hooks 에서 분리해주기
function getWinNumbers() {
  console.log("getWinNumbers");
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

const Lotto = () => {
  const LottoNumbers = useMemo(() => getWinNumbers(), []);
  // [] 안의 값이 바뀌지 않는 한 componentDidMount 이후로 실행되지 x
  const [winNumbers, setWinNumbers] = useState(LottoNumbers);
  const [winBalls, setWinBalls] = useState([]);
  const [bonus, setBonus] = useState(null);
  const [redo, setRedo] = useState(false);
  const timeouts = useRef([]);

  useEffect(() => {
    for (let i = 0; i < winNumbers.length - 1; i++) {
      // 마지막 bonus 공을 넣기 위해 1을 빼줌 (6개)
      timeouts.current[i] = setTimeout(() => {
        // timeout.current 은 바뀐 것일까? (No)
        // 이는 timeout.current 에 직접 넣어준 것이 아니라 그 요소에 넣은 것이므로
        setWinBalls((prevWinballs) => [...prevWinballs, winNumbers[i]]);
      }, (i + 1) * 1000);
    }
    timeouts.current[6] = setTimeout(() => {
      setBonus(winNumbers[6]);
      setRedo(true);
    }, 7000);

    // componentWillUnmount
    return () => {
      timeouts.current.forEach((v) => {
        clearTimeout(v);
      });
    };
  }, [timeouts.current]); // 바뀌는 시점을 넣어주면 된다.

  // 초기화 후 다시 실행하는 버튼
  const onClickRedo = useCallback(() => {
    console.log('onClickRedo');
    console.log(winNumbers); // [2, 7, 18, 27, 32, 35, 19]
    
    setWinNumbers(getWinNumbers());
    setWinBalls([]);
    setBonus(null);
    setRedo(false);
    timeouts.current = [];
  }, [winNumbers]);

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
      {redo && <button onClick={onClickRedo}>한 번더</button>}
    </>
  );
};

export default Lotto;

// import React, { Component } from "react";
// import Ball from "./Ball";

// // state 안쓰는 함수는 class 나 hooks 에서 분리해주기
// function getWinNumbers() {
//   // console.log("getWinNumbers");
//   const candidate = Array(45)
//     .fill()
//     .map((v, i) => i + 1);
//   const shuffle = [];
//   while (candidate.length > 0) {
//     const randomIndex = Math.floor(Math.random() * candidate.length);
//     // candidate.splice(randomIndex, 3) = [1, 2, 15]
//     const value = candidate.splice(randomIndex, 1)[0];
//     shuffle.push(value);
//   }

//   const bonusNumber = shuffle[shuffle.length - 1]; // 맨 끝에 배치
//   const winNumbers = shuffle.slice(0, 6).sort((a, b) => a - b);
//   return [...winNumbers, bonusNumber]; // 랜덤공 + 보너스공 합치기
// }

// class Lotto extends Component {
//   state = {
//     winNumbers: getWinNumbers(), // 당첨 숫자들 (미리 뽑아두고 하나씩 보여주기)
//     winBalls: [], // 화면
//     bonus: null,
//     redo: false, // 재실행
//   };

//   timeouts = [];

//   // 처음 시작 하자마자 실행되기 때문에 componentDidMount
//   // 보통 비동기에 변수를 같이 쓰면 클로저 문제가 생기는데, let 을 쓰면 발생하지 않는다. (예전 var 를 썼을 때 비동기에서 클로저가 많이 발생함);
//   componentDidMount() {
//     this.runTimeouts();
//   }

//   // 중복 코드(공 랜덤으로 나오는 효과) 리팩토링
//   runTimeouts = () => {
//     const { winNumbers } = this.state;
//     for (let i = 0; i < winNumbers.length - 1; i++) {
//       // 마지막 bonus 공을 넣기 위해 1을 빼줌 (6개)
//       this.timeouts[i] = setTimeout(() => {
//         this.setState((prevState) => {
//           return {
//             // 리액트에서 배열에 무언갈 push 할 땐 다음과 같이 전개연산자로 추가
//             // => 별개의 새로운 배열로 반환되어 state 가 바뀐 것으로 인지되기 때문에
//             winBalls: [...prevState.winBalls, winNumbers[i]],
//           };
//         });
//       }, (i + 1) * 1000);
//     }
//     this.timeouts[6] = setTimeout(() => {
//       this.setState({
//         bonus: winNumbers[6],
//         redo: true,
//       });
//     }, 7000);
//   }

//   // 업데이트 하고 싶은 상황 처리 (리렌더링)
//   componentDidUpdate(prevProps, prevState) {
//     if (this.state.winBalls.length === 0) {
//       this.runTimeouts();
//     }
//   }

//   componentWillUnmount() {
//     this.timeouts.forEach((v) => {
//       clearTimeout(v);
//     });
//   }

//   // 초기화 후 다시 실행하는 버튼
//   onClickRedo = () => {
//     this.setState({
//       winNumbers: getWinNumbers(),
//       winBalls: [],
//       bonus: null,
//       redo: false,
//     });
//     this.timeouts = [];
//   };

//   render() {
//     const { winBalls, bonus, redo } = this.state;
//     return (
//       <>
//         <div>당첨 숫자</div>
//         <div id="result">
//           {winBalls.map((v) => (
//             <Ball key={v} number={v} />
//           ))}
//         </div>
//         <div>보너스!</div>
//         {bonus && <Ball number={bonus} />}
//         {redo && <button onClick={this.onClickRedo}>한 번더</button>}
//         {/* <button onClick={redo ? this.onClickRedo : () => {}}>한번 더!</button> */}
//       </>
//     );
//   }
// }

// export default Lotto;
