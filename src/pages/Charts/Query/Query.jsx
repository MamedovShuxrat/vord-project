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
  const [userId, setUserId] = useState(null); // Для хранения текущего user_id

  // Получение токена доступа из localStorage
  const accessToken = JSON.parse(localStorage.getItem("userToken"));

  // Проверка наличия данных в tabContents с использованием optional chaining
  const tabContent = useSelector(
    (state) => state.charts.tabContents?.[tabId] || ""
  );

  const [localQueryText, setLocalQueryText] = useState(tabContent);

  useEffect(() => {
    setLocalQueryText(tabContent);
  }, [tabContent]);

  // Получение user_id текущего пользователя
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get("http://varddev.tech:8000/api/user/", {
          headers: {
            Authorization: `Token ${accessToken}`,
            "Content-Type": "application/json"
          }
        });
        setUserId(response.data.id); // Сохраняем user_id
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
      }
    };

    fetchUserId();
  }, [accessToken]);

  useEffect(() => {
    if (!userId) return; // Ждем, пока userId не будет установлен

    // Функция для получения списка баз данных, принадлежащих текущему пользователю
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

        // Фильтрация баз данных по текущему user_id
        const userDatabases = response.data.filter(
          (db) => db.user_id === userId
        );

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
    </div>
  );
};

export default Query;
