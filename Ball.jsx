import React, { memo } from "react";

// 함수 컴포넌트는 PureComponent 가 아니기 때문에 PureComponent 처럼 만들어야 하고, 이를 memo 가 대신 수행해준다.
// memo 처럼 컴포넌트를 감싸주는 컴포넌트를 하이오더 컴포넌트 또는 HOC 라고 한다. 
const Ball = memo(({ number }) => {
  let background;
    if (number <= 10) {
      background = "crimson";
    } else if (number <= 20) {
      background = "orange";
    } else if (number <= 30) {
      background = "yellow";
    } else if (number <= 40) {
      background = "blue";
    } else {
      background = "green";
    }

    return (
      <div className="ball" style={{ background }}>
        {number}
      </div>
    );
});

export default Ball;

