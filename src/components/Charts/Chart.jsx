// src/components/Charts/ui/Chart.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTabContent } from "../../core/store/chartsSlice";

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
      <h2>Chart Component</h2>
      <textarea
        value={localChartContent}
        onChange={(e) => handleContentChange(e.target.value)}
        rows={10}
        cols={50}
      />
    </div>
  );
};

export default Chart;
