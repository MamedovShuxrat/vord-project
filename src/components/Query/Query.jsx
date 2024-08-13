import React, { useState } from "react";
import SearchBlock from "../SearchBlock/SearchBlock";
import queryStyles from "./query.module.scss";

const Query = () => {
  const [queryText, setQueryText] = useState(""); // State for the text area

  return (
    <div className={queryStyles.queryContainer}>
      <div className={queryStyles.tabsActions}>
        <button className={queryStyles.runButton}>Run</button>
        <select className={queryStyles.databaseSelect}>
          <option value="sql">SQL</option>
          {/* Add more options as necessary */}
        </select>
        <SearchBlock placeholder="Search connection" onSearch={() => {}} />
      </div>

      {/* Поле для ввода текста SQL-запроса */}
      <div className={queryStyles.queryEditor}>
        <textarea
          className={queryStyles.queryTextarea}
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          rows="20"
        />
      </div>
    </div>
  );
};

export default Query;
