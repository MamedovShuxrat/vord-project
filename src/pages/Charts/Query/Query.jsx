import React, { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import queryStyles from "./query.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { updateTabContent } from "../../../core/store/chartsSlice";
import { Select, Spin, message } from "antd";
import axios from "axios";

const { Option } = Select;

// Предопределенный список расширений
const EXTENSIONS = [
  { id: 1, extension: false, name: "json api" },
  { id: 3, extension: "xlsx", name: "excel xlsx" },
  { id: 5, extension: "csv", name: "csv" },
  { id: 6, extension: "json", name: "json" }
];

const Query = ({ tabId }) => {
  const dispatch = useDispatch();
  const [databases, setDatabases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [selectedExtensionId, setSelectedExtensionId] = useState(null);
  const [showSQL, setShowSQL] = useState(true);
  const [result, setResult] = useState("");

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
    if (!userId) {
      console.warn("User ID is not available. Skipping fetch.");
      return;
    }

    const fetchDatabases = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://varddev.tech:8000/api/clientdb/",
          {
            headers: {
              Authorization: `Token ${accessToken}`,
              "Content-Type": "application/json"
            }
          }
        );

        const userDatabases = response.data.filter(
          (db) => db.user_id === userId
        );

        setDatabases(
          userDatabases.map((db) => ({ id: db.id, name: db.connection_name }))
        );
      } catch (error) {
        console.error("Failed to fetch databases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatabases();
  }, [accessToken, userId]);

  const handleEditorChange = (value) => {
    setLocalQueryText(value || "");
    dispatch(updateTabContent({ tabId, content: value || "" }));
  };

  const handleDatabaseChange = (value) => {
    setSelectedDatabase(value);
  };

  const handleExtensionChange = (value) => {
    setSelectedExtensionId(value);
  };

  const handleRun = async () => {
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

    try {
      const response = await axios.post(
        "http://varddev.tech:8000/api/charts/",
        requestData,
        {
          headers: {
            Authorization: `Token ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Ответ от сервера:", response.data);
      setResult(response.data.result);
      setShowSQL(false);
    } catch (error) {
      console.error("Не удалось выполнить запрос:", error);
      if (error.response) {
        console.error("Данные ответа:", error.response.data);
      }
    }
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
            onChange={handleDatabaseChange}
            placeholder="Select a database"
            style={{ width: 200 }}
            loading={loading}
          >
            {databases.map((db) => (
              <Option key={db.id} value={db.id}>
                {db.name}
              </Option>
            ))}
          </Select>
          <Select
            className={queryStyles.extensionSelect}
            value={selectedExtensionId}
            onChange={handleExtensionChange}
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
            {loading ? <Spin /> : <pre>{result}</pre>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Query;
