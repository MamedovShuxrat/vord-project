import React, { useState } from "react";
import SearchBlock from "../SearchBlock/SearchBlock";
import queryStyles from "./query.module.scss";

const Query = () => {
  const [queryText, setQueryText] = useState(""); // State for the text area

  const getLineNumberedText = () => {
    const lines = queryText.split("\n");
    return lines.map((line, index) => `${index + 1}. ${line}`).join("\n");
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
        <SearchBlock placeholder="Search connection" onSearch={() => {}} />
      </div>

      {/* Поле для ввода текста SQL-запроса с порядковыми номерами строк */}
      <div className={queryStyles.queryEditor}>
        <pre className={queryStyles.queryTextarea}>{getLineNumberedText()}</pre>
        <textarea
          className={queryStyles.queryTextareaInput}
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          rows="20"
        />
      </div>
    </div>
  );
};

export default Query;
