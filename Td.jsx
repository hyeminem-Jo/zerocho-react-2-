import React, { useContext } from "react";
import { CODE, TableContext } from "./MineSearch";

const getTdStyle = (code) => {
  switch (code) {
    case CODE.NORMAL: 
    case CODE.MINE: {
      return {
        background: '#444',
      }
    }
    case CODE.OPENED: {
      return {
        background: 'white',
      }
    }
    case CODE.NORMAL: {
      return {
        background: '#444',
      }
    }
    default: {
      return {
        background: '#fff',
      }
    }
  }
};

const getTdText = (code) => {
  switch (code) {
    case CODE.NORMAL: {
      return '';
    }
    case CODE.MINE: {
      return 'X';
    }
    default: {
      return '';
    }
  }
};

const Td = ({ rowIndex, cellIndex }) => {
  const { tableData } = useContext(TableContext);
  return (
    <td style={getTdStyle(tableData[rowIndex][cellIndex])}>
      {getTdText(tableData[rowIndex][cellIndex])}
    </td>
    // <td>{tableData[rowIndex][cellIndex]}</td>
  );
};

export default Td;
