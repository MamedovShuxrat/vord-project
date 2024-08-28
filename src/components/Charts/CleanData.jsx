// src/components/CleanData/ui/CleanData.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTabContent } from "../../core/store/chartsSlice";

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
    <div>
      <h2>Clean Data Component</h2>
      <textarea
        value={localCleanDataContent}
        onChange={(e) => handleContentChange(e.target.value)}
        rows={10}
        cols={50}
      />
    </div>
  );
};

export default CleanData;
