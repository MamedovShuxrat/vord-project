// src/components/Charts/ui/Chart.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTabContent } from "../../../core/store/chartsSlice";
import TextArea from "antd/es/input/TextArea";
import ChartImage from "./ChartImage";
import ChartType from "./ChartType";
import { Button } from "antd";
import styles from "../../CreateDataBaseCard/createDataBaseCard.module.scss";

const Chart = ({ tabId }) => {
  const dispatch = useDispatch();
  const tabContent = useSelector(
    (state) => state.charts.tabContents[tabId] || ""
  );
  const [localChartContent, setLocalChartContent] = useState(tabContent);

  useEffect(() => {
    setLocalChartContent(tabContent);
  }, [tabContent]);

  const handleContentChange = (newContent) => {
    setLocalChartContent(newContent);
    dispatch(updateTabContent({ tabId, content: newContent }));
  };

  return (
    <div>
      <div style={{ display: "flex", marginBottom: "20px" }}>
        <ChartImage />
        <ChartType />
      </div>
      <div style={{ textAlign: "center" }}>
        <Button type="primary" size="small">
          {" "}
          Send{" "}
        </Button>
      </div>
      {/* <TextArea
        rows={4}
        placeholder="Description"
        style={{
          border: "2px solid gray",
          borderRadius: "8px",
          padding: "10px",
          width: "669px",
          height: "132px",
          marginLeft: "38px",
          marginBottom: "20px"
        }}
        className="custom-textarea"
      />
      <button
        type="submit"
        className={`${styles.formDataBtn} ${styles.formDataBtnBlue}`}
        onClick={() => handleFormButtonClick(isFormValid)}
      >
        Report
      </button> */}
    </div>
  );
};

export default Chart;
