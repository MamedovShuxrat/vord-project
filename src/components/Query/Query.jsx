// src/components/Query/Query.jsx
import React, { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import SearchBlock from "../SearchBlock/SearchBlock";
import queryStyles from "./query.module.scss";
import DataClean from "../DataClean/DataClean";
import { useDispatch, useSelector } from "react-redux";
import { updateTabContent } from "../../core/store/chartsSlice";

const Query = ({ tabId }) => {
  const dispatch = useDispatch();

  // Проверка наличия данных в tabContents с использованием optional chaining
  const tabContent = useSelector(
    (state) => state.charts.tabContents?.[tabId] || ""
  );

  const [localQueryText, setLocalQueryText] = useState(tabContent);

  useEffect(() => {
    setLocalQueryText(tabContent);
  }, [tabContent]);

  const handleEditorChange = (value) => {
    setLocalQueryText(value || "");
    dispatch(updateTabContent({ tabId, content: value || "" }));
  };

  return (
    <div className={queryStyles.queryContainer}>
      <div className={queryStyles.tabsActions}>
        <div className={queryStyles.actionsBlock}>
          <button className={queryStyles.runButton}>Run</button>
          <select className={queryStyles.databaseSelect}>
            <option value="sql">SQL</option>
          </select>
        </div>
        <SearchBlock
          placeholder="Search connection"
          onSearch={() => {}}
          showAddButton={false}
        />
      </div>
      <div className={queryStyles.editorContainer}>
        <MonacoEditor
          height="400px"
          language="sql"
          theme="vs-light"
          value={localQueryText}
          onChange={handleEditorChange}
          options={{
            lineNumbers: "on",
            automaticLayout: true
          }}
        />
      </div>
      <DataClean />
    </div>
  );
};

export default Query;
