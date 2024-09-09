// src/components/CleanData/ui/CleanData.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTabContent } from "../../../core/store/chartsSlice";
import DataClean from "../ui/DataClean/DataClean";

const CleanData = ({ tabId }) => {
  const dispatch = useDispatch();
  const tabContent = useSelector(
    (state) => state.charts.tabContents[tabId] || ""
  );
  const [localCleanDataContent, setLocalCleanDataContent] =
    useState(tabContent);

  useEffect(() => {
    setLocalCleanDataContent(tabContent);
  }, [tabContent]);

  const handleContentChange = (newContent) => {
    setLocalCleanDataContent(newContent);
    dispatch(updateTabContent({ tabId, content: newContent }));
  };

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ width: "649px", height: "486px" }}>
        <DataClean />
      </div>
    </div>
  );
};

export default CleanData;
