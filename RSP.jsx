import React, { useEffect, useRef, useState } from "react";

const rspCoords = {
  바위: "0",
  가위: "-142px",
  보: "-284px",
};

const scores = {
  가위: 1,
  바위: 0,
  보: -1,
};

// 컴퓨터가 현재 어떤 손을 내민지 판단
const computerChoice = (imgCoord) => {
  return Object.entries(rspCoords).find(function (v) {
    return v[1] === imgCoord; 
  })[0]; 
};

const RSP = () => {
  const [result, setResult] = useState('');
  const [imgCoord, setImgCoord] = useState(rspCoords.바위);
  // 한번 상수로 선언을 해주었다면 계속 상수로 선언해주면 좋다.
  // 상수(Constant): 프로그램이 실행되는 동안 값이 고정되어 변경할 수 없는 메모리 공간
  const [score, setScore] = useState(0);
  const interval = useRef();

  // componentDidMount + componentDidUpdate + componentWillUnmount
  useEffect(() => { // componentDidMount + componentDidUpdate 역할(1대1 대응은 x)
    interval.current = setInterval(changeHand, 100)
    return () => { //componentWillUnmount 역할
      clearInterval(interval.current);
    }
  }, [imgCoord]) // [] 가 이전에 setInterval 때 일어났던 클로저 문제를 해결해준다.
  // 바뀌는 state, 즉 useEffect 를 실행하고 싶은 state 를 넣으면 된다.
  // useEffect 의 두 번째 인수 배열[] 에 넣은 값(ex. imgCoord)이 바뀔 때, useEffect 가 실행된다.
  // 비동기코드와 만나 클로저가 발생하면서 새로운 imgCoord 로 갱신되지 못한다. 처음 바위 일때만 실행된 후로 똑같이 유지되버리는데 이때 []에 바뀌는 state(imgCoord) 를 넣어주면 그 state 의 변화에 따라 useEffect 가 실행되고 그 안의 비동기 코드도 실행이 된다.
  // 그냥 빈 배열[] 로 둔다면 "첫 렌더링때만 실행되고 그 이후론 무엇이 바뀌든 (ex) imgCoord 가 바뀌든) 상관하지 않고 작동하지 않겠다" 라는 뜻을 가진다. 
  // [] 안 요소의 유무는 componentDidUpdate 의 실행을 결정
  // ([] :componentDidMount 처럼 처음에만 실행)
  // ([imgCoord] :componentDidUpdate 처럼 첫렌더링 다음 리렌더링 이후 실행)

  // 함수 컴포넌트는 렌더링이 될 때마다 그 함수 컴포넌트 전체가 통채로 다시 실행된다.
  // 렌더링이 될 때마다 useEffect 가 실행되고, 그때마다 그 안에서 비동기코드가 실행되면서 겹친다고 생각한다. 하지만 비동기 코드와 동시에 그를 없애는 clearInterval 도 같이 실행 반복 실행되고 있기 때문에 사실상 그냥 setInterval 이 실행되는 것과 같다.

  const changeHand = () => {
    if (imgCoord === rspCoords.바위) {
      setImgCoord(rspCoords.가위)
    } else if (imgCoord === rspCoords.가위) {
      setImgCoord(rspCoords.보)
    } else if (imgCoord === rspCoords.보) {
      setImgCoord(rspCoords.바위)
    }
  }

  const onClickBtn = (choice) => () => {
    clearInterval(interval.current);
    const myScore = scores[choice];
    const cpuScore = scores[computerChoice(imgCoord)];
    const diff = myScore - cpuScore;
    if (diff === 0) {
      setResult("비겼습니다!")
    } else if ([-1, 2].includes(diff)) {
      setResult("이겼습니다!");
      setScore((prevScore) => prevScore + 1)
    } else {
      setResult("졌습니다 ㅠ");
      setScore((prevScore) => prevScore - 1)
    }
    
    setTimeout(() => {
      interval.current = setInterval(changeHand, 100);
    }, 1000)
  };


  return (
    <>
      <div id="computer" style={{ background: `url(http://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0`}}/>
      <div>
        <button id="rock" className="btn" onClick={onClickBtn("바위")}>바위</button>
        <button id="scissor" className="btn" onClick={onClickBtn("가위")}>가위</button>
        <button id="paper" className="btn" onClick={onClickBtn("보")}>보</button>
      </div>
      <div>{result}</div>
      <div>현재 {score} 점</div>
    </>
  );
}

export default RSP;



// class RSP extends Component {

//   // 컴포넌트가 첫 렌더링된 후 여기에 비동기 요청을 많이함
//   componentDidMount() {
//     interval.current = setInterval(changeHand, 100);
//   }

//   // 리렌더링 후
//   componentDidUpdate() {}

//   // 컴포넌트가 제거되기 직전 (부모 컴포넌트에 의해 제거될 때)
//   componentWillUnmount() {
//     clearInterval(interval.current);
//   }

  
//   changeHand = () => {
//     const { imgCoord } = this.state;
//     if (imgCoord === rspCoords.바위) {
//       this.setState({
//         imgCoord: rspCoords.가위,
//       });
//     } else if (imgCoord === rspCoords.가위) {
//       this.setState({
//         imgCoord: rspCoords.보,
//       });
//     } else if (imgCoord === rspCoords.보) {
//       this.setState({
//         imgCoord: rspCoords.바위,
//       });
//     }
//   }

//   onClickBtn = (choice) => () => {
//     clearInterval(interval.current);
//     const myScore = scores[choice];
//     const cpuScore = scores[computerChoice(imgCoord)];
//     const diff = myScore - cpuScore;
//     if (diff === 0) {
//       this.setState({
//         result: "비겼습니다!",
//       });
//     } else if ([-1, 2].includes(diff)) {
//       this.setState((prevState) => {
//         return {
//           result: "이겼습니다!",
//           score: prevState.score + 1,
//         };
//       });
//     } else {
//       this.setState((prevState) => {
//         return {
//           result: "졌습니다ㅠ",
//           score: prevState.score - 1,
//         };
//       });
//     }
    
//     setTimeout(() => {
//       this.interval = setInterval(this.changeHand, 100);
//     }, 1000)
//   }

//   render() {
//     const { result, score, imgCoord } = this.state;
//     return (
//       <>
//         <div
//           id="computer"
//           style={{
//             background: `url(http://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0`,
//           }}
//         />
//         <div>
//           <button id="rock" className="btn" onClick={this.onClickBtn("바위")}>바위</button>
//           <button id="scissor" className="btn" onClick={this.onClickBtn("가위")}>가위</button>
//           <button id="paper" className="btn" onClick={this.onClickBtn("보")}>보</button>
//         </div>
//         <div>{result}</div>
//         <div>현재 {score} 점</div>
//       </>
//     );
//   }
// }

// export default RSP;
