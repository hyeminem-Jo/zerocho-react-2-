import React, { useMemo, createContext, useReducer } from "react";
import Table from "./Table";
import Form from "./Form";

// 칸 데이터를 코드로 부여
export const CODE = {
  MINE: -7,
  NORMAL: -1,
  QUESTION: -2,
  FLAG: -3,
  QUESTION_MINE: -4,
  FLAG_MINE: -5,
  CLICKED_MINE: -6,
  OPENED: 0,
}

// 다른 파일에서 사용할 수 있게 export 를 해준다.
export const TableContext = createContext({
  tableData: [],
  dispatch: () => {}, // dispatch 의 초기값은 함수
  // 의미 x
});

const initialState = {
  tableData: [],
  timer: 0,
  result: '',
};

// 지뢰 넣을 자리 랜덤으로 뽑기
const plantMine = (row, cell, mine) => {
  console.log(row, cell, mine);
  const candidate = Array(row * cell).fill().map((arr, i) => { return i });
  const shuffle = [];
  while (candidate.length > row * cell - mine) {
    const chosen = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
    shuffle.push(chosen);
  }

  // 2 차원 배열로 만든 후 닫힌 칸 채우기
  const data = [];
  for (let i = 0; i < row; i++ ) {
    const rowData = [];
    data.push(rowData);
    for (let j = 0; j < cell; j++) {
      rowData.push(CODE.NORMAL); // 닫힌 칸 
    }
  }

  // 랜덤 자리에 지뢰 심기
  for (let k = 0; k < shuffle.length; k++) {
    const ver = Math.floor(shuffle[k] / cell);
    const hor = shuffle[k] % cell;
    data[ver][hor] = CODE.MINE; // 지뢰 칸
  }

  console.log(data);
  return data; // data 2차원 배열 반환
}

export const START_GAME = 'START_GAME';

const reducer = (state, action) => {
  switch (action.type) {
    case START_GAME: {
      return {
        ...state,
        tableData: plantMine(action.row, action.cell, action.mine)
      }
    }
    default:
      return state;
  }
};

const MineSearch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => ({ tableData: state.tableData, dispatch }), [state.tableData])
  
  return (
    <TableContext.Provider value={value}>
      <Form />
      <div>{state.timer}</div>
      <Table />
      <div>{state.result}</div>
    </TableContext.Provider>
  );
};

export default MineSearch;
