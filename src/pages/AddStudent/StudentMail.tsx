import React from "react";
import { ICellRendererParams } from "ag-grid-community";

export default (props: ICellRendererParams) => {
  const cellValue = props.valueFormatted ? props.valueFormatted : props.value;

  const buttonClicked = () => {
    alert(`${cellValue} medals won!`);
  };

  return (
    <span>
      <span>{cellValue}</span>&nbsp;
      <div >

      <div >
        <button
          style={{ color: "red", backgroundColor: "green",padding:"10px" }}
          onClick={() => buttonClicked()}
        >
          Push For Total
        </button>
      </div>
      <div style={{marginLeft:"10px"}}>
        <button
          style={{ color: "blue", backgroundColor: "green" }}
          onClick={() => buttonClicked()}
        >
          Push For Totals
        </button>
      </div>
      <div style={{marginLeft:"10px"}}>
        <button
          style={{ color: "blue", backgroundColor: "green" }}
          onClick={() => buttonClicked()}
        >
          Push For Total
        </button>
      </div>
      </div>
    </span>
  );
};
