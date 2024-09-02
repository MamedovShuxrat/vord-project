import React, { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import queryStyles from "./query.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { updateTabContent } from "../../../core/store/chartsSlice";
import { Select, Spin, message } from "antd";
import axios from "axios";

const { Option } = Select;

const Query = ({ tabId }) => {
  const dispatch = useDispatch();
  const [databases, setDatabases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [selectedExtension, setSelectedExtension] = useState("json"); // Значение по умолчанию

  // Получение токена доступа и данных пользователя из localStorage
  const accessToken = JSON.parse(localStorage.getItem("userToken"));
  const userData = JSON.parse(localStorage.getItem("userData")); // Данные пользователя
  const userId = userData ? userData.pk : null; // Извлекаем user_id из данных пользователя

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
    setSelectedExtension(value);
  };

  const handleRun = async () => {
    if (!selectedDatabase || !localQueryText || !selectedExtension) {
      message.error(
        "Выберите базу данных, введите запрос и выберите расширение."
      );
      return;
    }

    const requestData = {
      clientdb_id: selectedDatabase,
      str_query: localQueryText,
      extension: selectedExtension
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
      // Обработка данных ответа
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
            value={selectedExtension}
            onChange={handleExtensionChange}
            placeholder="Select an extension"
            style={{ width: 150, marginLeft: 10 }}
          >
            <Option value="json">json</Option>
            <Option value="xlsx">excel xlsx</Option>
            <Option value="csv">csv</Option>
          </Select>
        </div>
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
    </div>
  );
};

export default Query;
