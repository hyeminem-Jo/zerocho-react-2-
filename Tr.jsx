import React, { useContext } from "react";
import { TableContext } from "./MineSearch";
import Td from "./Td";

const Tr = ({ rowIndex }) => {
  const { tableData } = useContext(TableContext);
  return (
    <tr>
      {/* tableData[0] 이 undefined 일 수 있기 때문에 보호 연삱자로 감싸줌*/}
      {tableData[0] && Array(tableData[0].length).fill().map((td, i) => <Td rowIndex={rowIndex} cellIndex={i} />)}
    </tr>
  );
};

export default Tr;
