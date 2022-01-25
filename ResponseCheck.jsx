import React, { useRef, useState } from "react";

const ResponseCheck = () => {
  const [state, setState] = useState("waiting");
  const [message, setMessage] = useState("클릭해서 시작하세요");
  const [result, setResult] = useState([]);
  const timeOut = useRef(null);
  const startTime = useRef();
  const endTime = useRef();
  // ref 는 보통 DOM 에 접근할 때만 사용되었는데, hooks 에서는 this 의 속성들을 ref 로 표현한다. (ref 의 추가적인 기능)
  // ref 를 쓸 땐 current 를 붙여주어야 한다.

  const onClickScreen = () => {
    if (state === "waiting") {
      setState("ready");
      setMessage("초록색이 되면 클릭하세요");
      timeOut.current = setTimeout(() => {
        setState("now");
        setMessage("지금 클릭");
        startTime.current = new Date(); // 시작 시간
      }, Math.floor(Math.random() * 1000) + 2000); // 2 ~ 3초
    } else if (state === "ready") {
      // 성급하게 클릭 했을 때
      clearTimeout(timeOut.current);
      setState("waiting");
      setMessage(
        "너무 성급하셨군요. 초록색이 된 후에 클릭하세요 (지금 다시 클릭)"
      );
    } else if (state === "now") {
      // 반응 속도 체크 구간
      endTime.current = new Date(); // 끝 시간
      setState("waiting");
      setMessage("클릭해서 시작하세요");
      setResult((prevResult) => {
        return [...prevResult, endTime.current - startTime.current];
      }); // 옛날 배열을 추가하는 것이므로 함수형 setState 로 전환, prev 사용
    }
  };

  const onReset = () => {
    setResult([]);
  };

  const renderAverage = () => {
    return result.length === 0 ? null : (
      <>
        <div>
          평균 시간: {result.reduce((a, c) => a + c) / result.length}
          ms
        </div>
        <button onClick={onReset}>리셋하기</button>
      </>
    );
  };

  return (
    <>
      <div id="screen" className={state} onClick={onClickScreen}>
        {message}
      </div>
      {/* {(() => {
        if (result.length === 0) {
          return null;
        } else {
          return (
            <>
              <div>
                평균 시간: {result.reduce((a, c) => a + c) / result.length}
                ms
              </div>
              <button onClick={onReset}>리셋하기</button>
            </>
          );
        }
      })()} */}
      {renderAverage()}
    </>
  );
};

export default ResponseCheck;

