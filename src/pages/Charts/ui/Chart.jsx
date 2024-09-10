import React from "react";
import ChartType from "./ChartType";

const Chart = ({ tabId }) => {
  return (
    <div>
      <div style={{ display: "flex", marginBottom: "20px" }}>
        <ChartType />
      </div>
    </div>
  );
};

export default Chart;
