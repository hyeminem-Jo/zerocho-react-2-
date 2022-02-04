import React, { memo, useCallback, useContext, useState } from 'react';
import { TableContext } from './MineSearch';
import { START_GAME } from './MineSearch';

const Form = memo(() => {
  // 가로, 세로 칸 과 지뢰 갯수
  const [row, setRow] = useState(10);
  const [cell, setCell] = useState(10);
  const [mine, setMine] = useState(20);
  // useContext 를 통해 데이터에 접근
  const { dispatch } = useContext(TableContext);

  // value 값 관리 
  const onChangeRow = useCallback((e) => {
    setRow(e.target.value);
  }, [])

  const onChangeCell = useCallback((e) => {
    setCell(e.target.value);
  }, [])

  const onChangeMine = useCallback((e) => {
    setMine(e.target.value);
  }, [])

  // Context API 적용 예정
  const onClickBtn = useCallback(() => {
    dispatch({type: START_GAME, row, cell, mine})
  }, [row, cell, mine])

  return (
    <div>
      <input type="number" placeholder="세로" value={row} onChange={onChangeRow} />
      <input type="number" placeholder="가로" value={cell} onChange={onChangeCell} />
      <input type="number" placeholder="지뢰" value={mine} onChange={onChangeMine} />
      <button onClick={onClickBtn}>시작</button>
    </div>
  );
});

export default Form;