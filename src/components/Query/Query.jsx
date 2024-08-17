import React, { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import SearchBlock from "../SearchBlock/SearchBlock";
import queryStyles from "./query.module.scss";

const Query = ({ queryText, setQueryText }) => {
  const [localQueryText, setLocalQueryText] = useState(queryText); // State for the SQL query text

  useEffect(() => {
    setLocalQueryText(queryText);
  }, [queryText]);

  const handleEditorChange = (value) => {
    setLocalQueryText(value || "");
    setQueryText(value || ""); // Update the query text in the parent component
  };

  return (
    <div className={queryStyles.queryContainer}>
      <div className={queryStyles.tabsActions}>
        <div className={queryStyles.actionsBlock}>
          <button className={queryStyles.runButton}>Run</button>
          <select className={queryStyles.databaseSelect}>
            <option value="sql">SQL</option>
            {/* Add more options as necessary */}
          </select>
        </div>
        <SearchBlock
          placeholder="Search connection"
          onSearch={() => {}}
          showAddButton={false}
        />
      </div>
      <div className={queryStyles.queryEditor}>
        <MonacoEditor
          height="400px" // Можно настроить высоту редактора
          language="sql" // Поддержка синтаксиса SQL
          theme="vs-light" // Темная тема, можно изменить на "light"
          value={localQueryText}
          onChange={handleEditorChange} // Обновляем состояние при изменении текста
          options={{
            lineNumbers: "on", // Включаем нумерацию строк
            automaticLayout: true // Автоматическая настройка размеров редактора
          }}
        />
      </div>
    </div>
  );
};

export default Query;
