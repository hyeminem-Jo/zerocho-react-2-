import React, { Component } from "react";

class ResponseCheck extends Component {
  state = {
    state: "waiting",
    message: "클릭해서 시작하세요",
    result: [],
  };

  timeout;
  startTime;
  endTime;
  // startTime 역시 변하는 부분이긴 하지만, state 로 만들어버리면 렌더링이 다시 되기 때문에 그냥 this.startTime 으로 만들어준다. (re-rendering 을 겪고 싶지 않을 땐 this.~ 로 만들어준다.)
  // startTime 의 변화로 화면에 변화를 주는 것은 아니기 때문에 굳이 state 로 만들 필요 x

  onClickScreen = () => {
    const { state, message, result } = this.state;
    if (state === "waiting") {
      this.setState({
        state: "ready",
        message: "초록색이 되면 클릭하세요",
      });
      this.timeout = setTimeout(() => {
        this.setState({
          state: "now",
          message: "지금 클릭",
        });
        this.startTime = new Date(); // 시작 시간
      }, Math.floor(Math.random() * 1000) + 2000); // 2 ~ 3초
    } else if (state === "ready") {
      // 성급하게 클릭 했을 때
      // 이때 처음 화면으로 돌아가야 하는데, 이전에 생긴 setTimeout 이 작동되어버려 초기화면이 아닌 초록색 화면이 나와버린다. 이를 방지하기 위해 기존에 있던 setTimeout 을 우선 초기화 시켜준다.
      clearTimeout(this.timeout);
      this.setState({
        state: "waiting",
        message:
          "너무 성급하셨군요. 초록색이 된 후에 클릭하세요 (지금 다시 클릭)",
      });
    } else if (state === "now") {
      // 반응 속도 체크 구간
      this.endTime = new Date(); // 끝 시간
      this.setState((prevState) => {
        return {
          state: "waiting",
          message: "클릭해서 시작하세요",
          result: [...prevState.result, this.endTime - this.startTime],
        }; // 옛날 배열을 추가하는 것이므로 함수형 setState 로 전환, prev 사용
      });
    }
  };

  onReset = () => {
    this.setState({
      result: [],
      // reseult 가 빈 배열이 되면서 초기화 된다.
    })
  }

  renderAverage = () => {
    const { result } = this.state;
    return result.length === 0 ? null : (
      <>
        <div>
          평균 시간: {result.reduce((a, c) => a + c) / this.state.result.length}
          ms
        </div>
        <button onClick={this.onReset}>리셋하기</button>
      </>
    );
  };

  render() {
    const { state, message } = this.state;
    return (
      <>
        <div id="screen" className={state} onClick={this.onClickScreen}>
          {message}
        </div>
        {this.renderAverage()}
      </>
    );
  }
}

export default ResponseCheck;
