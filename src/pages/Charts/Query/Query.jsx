import React, { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import SearchBlock from "../../../components/SearchBlock/SearchBlock";
import queryStyles from "./query.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { updateTabContent } from "../../../core/store/chartsSlice";
import { Select, Spin } from "antd";
import axios from "axios";

const { Option } = Select;

const Query = ({ tabId }) => {
  const dispatch = useDispatch();
  const [databases, setDatabases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState(null);

  // Получение токена доступа и данных пользователя из localStorage
  const accessToken = JSON.parse(localStorage.getItem("userToken"));
  const userData = JSON.parse(localStorage.getItem("userData")); // Данные пользователя
  const userId = userData ? userData.pk : null; // Извлекаем user_id из данных пользователя

  console.log("Access Token:", accessToken);
  console.log("User Data from localStorage:", userData);
  console.log("Extracted User ID:", userId);

  // Проверка наличия данных в tabContents с использованием optional chaining
  const tabContent = useSelector(
    (state) => state.charts.tabContents?.[tabId] || ""
  );

  const [localQueryText, setLocalQueryText] = useState(tabContent);

  useEffect(() => {
    setLocalQueryText(tabContent);
  }, [tabContent]);

  // Функция для получения списка баз данных, принадлежащих текущему пользователю
  useEffect(() => {
    if (!userId) {
      console.warn("User ID is not available. Skipping fetch.");
      return; // Ждем, пока userId не будет установлен
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

        console.log("Fetched Databases Response:", response.data);

        // Фильтрация баз данных по текущему user_id
        const userDatabases = response.data.filter(
          (db) => db.user_id === userId
        );

        console.log("Filtered Databases for User:", userDatabases);

        // Извлечение названий баз данных из отфильтрованного списка
        setDatabases(userDatabases.map((db) => db.connection_name));
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

  return (
    <div className={queryStyles.queryContainer}>
      <div className={queryStyles.tabsActions}>
        <div className={queryStyles.actionsBlock}>
          <button className={queryStyles.runButton}>Run</button>
          <Select
            className={queryStyles.databaseSelect}
            value={selectedDatabase}
            onChange={handleDatabaseChange}
            placeholder="Select a database"
            style={{ width: 200 }}
            loading={loading}
          >
            {databases.map((dbName) => (
              <Option key={dbName} value={dbName}>
                {dbName}
              </Option>
            ))}
          </Select>
        </div>
        {/* <SearchBlock
          placeholder="Search connection"
          onSearch={() => {}}
          showAddButton={false}
        /> */}
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
