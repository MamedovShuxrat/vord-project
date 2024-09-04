import React, { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import queryStyles from "./query.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  updateTabContent,
  loadUserDatabases,
  executeQuery
} from "../../../core/store/chartsSlice";
import { Select, Spin, message } from "antd";

const { Option } = Select;

const EXTENSIONS = [
  { id: 1, extension: false, name: "json api" },
  { id: 3, extension: "xlsx", name: "excel xlsx" },
  { id: 5, extension: "csv", name: "csv" },
  { id: 6, extension: "json", name: "json" }
];

const Query = ({ tabId }) => {
  const dispatch = useDispatch();
  const { databases, queryResult, loading } = useSelector(
    (state) => state.charts
  );
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [selectedExtensionId, setSelectedExtensionId] = useState(null);
  const [showSQL, setShowSQL] = useState(true);

  const accessToken = JSON.parse(localStorage.getItem("userToken"));
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userId = userData ? userData.pk : null;

  const tabContent = useSelector(
    (state) => state.charts.tabContents?.[tabId] || ""
  );

  const [localQueryText, setLocalQueryText] = useState(tabContent);

  useEffect(() => {
    setLocalQueryText(tabContent);
  }, [tabContent]);

  useEffect(() => {
    if (userId) {
      dispatch(loadUserDatabases(accessToken));
    }
  }, [dispatch, accessToken, userId]);

  const handleEditorChange = (value) => {
    setLocalQueryText(value || "");
    dispatch(updateTabContent({ tabId, content: value || "" }));
  };

  const handleRun = () => {
    if (!selectedDatabase || !localQueryText || selectedExtensionId === null) {
      message.error(
        "Выберите базу данных, введите запрос и выберите расширение."
      );
      return;
    }

    const requestData = {
      clientdb_id: selectedDatabase,
      str_query: localQueryText,
      extension: selectedExtensionId
    };

    dispatch(executeQuery({ token: accessToken, requestData }));
    setShowSQL(false);
  };

  return (
    <div className={queryStyles.queryContainer}>
      <div className={queryStyles.tabsActions}>
        <div className={queryStyles.actionsBlock}>
          <button className={queryStyles.runButton} onClick={handleRun}>
            Run
          </button>
          <Select
            className={queryStyles.databaseSelect}
            value={selectedDatabase}
            onChange={(value) => setSelectedDatabase(value)}
            placeholder="Select a database"
            style={{ width: 200 }}
            loading={loading}
          >
            {databases && databases.length > 0 ? (
              databases.map((db) => (
                <Option key={db.id} value={db.id}>
                  {db.connection_name}
                </Option>
              ))
            ) : (
              <Option disabled>No databases available</Option>
            )}
          </Select>
          <Select
            className={queryStyles.extensionSelect}
            value={selectedExtensionId}
            onChange={(value) => setSelectedExtensionId(value)}
            placeholder="Select an extension"
            style={{ width: 150, marginLeft: 10 }}
          >
            {EXTENSIONS.map((ext) => (
              <Option key={ext.id} value={ext.id}>
                {ext.name}
              </Option>
            ))}
          </Select>
        </div>
        <div className={queryStyles.switchBlock}>
          <button
            style={{ marginRight: "20px" }}
            onClick={() => setShowSQL(true)}
            className={showSQL ? queryStyles.activeTab : ""}
          >
            SQL
          </button>
          <button
            onClick={() => setShowSQL(false)}
            className={!showSQL ? queryStyles.activeTab : ""}
          >
            Result
          </button>
        </div>
      </div>
      <div className={queryStyles.editorContainer}>
        {showSQL ? (
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
        ) : (
          <div className={queryStyles.resultContainer}>
            {loading ? <Spin /> : <pre>{queryResult}</pre>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Query;
