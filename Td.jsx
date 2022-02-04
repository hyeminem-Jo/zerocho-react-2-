import React, { memo, useCallback, useContext, useMemo } from "react";
import {
  CODE,
  OPEN_CELL,
  CLICK_MINE,
  FLAG_CELL,
  QUESTION_CELL,
  NORMALIZE_CELL,
  TableContext,
} from "./MineSearch";

const getTdStyle = (code) => {
  switch (code) {
    case CODE.NORMAL:
    case CODE.MINE: {
      return {
        background: "#444",
      };
    }
    case CODE.OPENED: {
      return {
        background: "white",
      };
    }
    case CODE.NORMAL: {
      return {
        background: "#444",
      };
    }

    case CODE.FLAG:
    case CODE.FLAG_MINE:
      return {
        background: "crimson",
      };

    case CODE.QUESTION:
    case CODE.QUESTION_MINE:
      return {
        background: "yellow",
      };

    default: {
      return {
        background: "#fff",
      };
    }
  }
};

const getTdText = (code) => {
  console.log("getTdText, return 부분");
  switch (code) {
    case CODE.NORMAL: {
      return "";
    }
    case CODE.MINE: {
      return "X";
    }
    case CODE.CLICKED_MINE: {
      return "펑";
    }

    case CODE.FLAG:
    case CODE.FLAG_MINE:
      return "!";

    case CODE.QUESTION:
    case CODE.QUESTION_MINE:
      return "?";

    // 오류: 기본적으로 아무것도 표시 안되게 해놓았기 때문에 주변 지뢰 개수인 count 값을 넣어도 나타나지 않았던 것
    // default: return '';

    default:
      return code;
  }
};

const Td = memo(({ rowIndex, cellIndex }) => {
  const { tableData, dispatch, halted } = useContext(TableContext);

  // 클릭 시 OPEN_CELL action 이 dispatch 되면서 줄 칸의 좌표가 전달됨
  const onClickTd = useCallback(() => {
    if (halted) {
      return;
    }
    switch (tableData[rowIndex][cellIndex]) {
      // 클릭 해도 아무 효과 없도록
      case CODE.OPENED:
      case CODE.FLAG:
      case CODE.FLAG_MINE:
      case CODE.QUESTION:
      case CODE.QUESTION_MINE:
        return;
      // 클릭 하면 OPENED 칸으로 바꾸기
      case CODE.NORMAL: {
        dispatch({ type: OPEN_CELL, row: rowIndex, cell: cellIndex });
        return; // switch 문은 return 이든 break 든으로 끊어주어야함
      }
      // 클릭 하면 펑
      case CODE.MINE: {
        dispatch({ type: CLICK_MINE, row: rowIndex, cell: cellIndex });
        return;
      }
    }
  }, [tableData[rowIndex][cellIndex], halted]);

  // 우클릭 이벤트
  const onRightClickTd = useCallback(
    (e) => {
      e.preventDefault();
      if (halted) {
        return;
      }
      switch (tableData[rowIndex][cellIndex]) {
        case CODE.NORMAL:
        case CODE.MINE:
          dispatch({ type: FLAG_CELL, row: rowIndex, cell: cellIndex });
          return;

        case CODE.FLAG:
        case CODE.FLAG_MINE:
          dispatch({ type: QUESTION_CELL, row: rowIndex, cell: cellIndex });
          return;

        case CODE.QUESTION:
        case CODE.QUESTION_MINE:
          dispatch({ type: NORMALIZE_CELL, row: rowIndex, cell: cellIndex });
          return;

        default:
          return;
      }
    },
    [tableData[rowIndex][cellIndex], halted]
  );

  console.log("Td 컴포넌트 렌더");

  // (1) return 부분 자체(값)를 useMemo 하는 법
  // return useMemo(() => (
  //   <td style={getTdStyle(tableData[rowIndex][cellIndex])} onClick={onClickTd}
  //     onContextMenu={onRightClickTd}>
  //     {getTdText(tableData[rowIndex][cellIndex])}
  //   </td>
  // ), [tableData[rowIndex][cellIndex]]);

  // return 부분, 예를들어 getTdText 부분은 한 번 실행되고 Td 컴포넌트 함수 부분은 100번 실행되는 것을 알 수 있다.
  // console.log('Td 컴포넌트 렌더') => 100번
  // console.log('getTdText, return 부분') => 1번

  // (2-2) 컴포넌트로 따로 빼서 memo 후 return 에 넣는 법
  return (
    <RealTd
      onClickTd={onClickTd}
      onRightClickTd={onRightClickTd}
      data={tableData[rowIndex][cellIndex]}
    />
  );
});

// (2-1) 컴포넌트로 따로 빼서 memo 후 return 에 넣는 법
const RealTd = memo(({ onClickTd, onRightClickTd, data }) => {
  console.log("realTd rendered");
  return (
    <td
      style={getTdStyle(data)}
      onClick={onClickTd}
      onContextMenu={onRightClickTd}
    >
      {getTdText(data)}
    </td>
  );
});

export default Td;

// 두 가지 방법
// 1. return 부분 자체에 useMemo 를 써서 캐싱
// 2. return 부분을 따로 컴포넌트로 빼서 그 컴포넌트 함수를 memo 
// ** useContext 의 사용 때문에 Td 함수가 호출되는 것은 어쩔 수 없음, 대신 return 부분인 컴포넌트 즉 나오는 값 만이라도 캐싱되어 실제로는 한 번만 렌더링 됨