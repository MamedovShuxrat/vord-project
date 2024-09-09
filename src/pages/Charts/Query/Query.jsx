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
import { runQuery, fetchQueryResult, updateQueryData } from "../api/index";

const { Option } = Select;

const EXTENSIONS = [
  { id: 1, extension: false, name: "json api" },
  { id: 3, extension: "xlsx", name: "excel xlsx" },
  { id: 5, extension: "csv", name: "csv" },
  { id: 6, extension: "json", name: "json" }
];

const Query = ({ tabId }) => {
  const dispatch = useDispatch();
  const { databases = [], loading } = useSelector((state) => state.charts);
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [selectedExtensionId, setSelectedExtensionId] = useState(null);
  const [showSQL, setShowSQL] = useState(true);
  const [chartId, setChartId] = useState(null);
  const [resultData, setResultData] = useState(null); // Состояние для результата

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

  // Функция для выполнения запроса
  const handleRunOrUpdate = async () => {
    console.log("handleRunOrUpdate triggered");

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

    console.log("Request data prepared:", requestData);

    try {
      let response;
      if (chartId) {
        console.log("Updating existing chart with ID:", chartId);
        response = await updateQueryData(accessToken, chartId, requestData);
        console.log("Data updated successfully:", response);
        message.success("Data updated successfully.");
      } else {
        console.log("Running new query");
        response = await runQuery(accessToken, requestData);
        console.log("Query run successfully, response:", response);
        setChartId(response.id);
        message.success("Data loaded successfully.");
      }

      setShowSQL(false);

      // Получаем данные из clientdata
      console.log(
        "Fetching query result from clientdata:",
        response.clientdata
      );
      const resultResponse = await fetchQueryResult(
        accessToken,
        response.clientdata
      );
      console.log("Query result fetched successfully:", resultResponse);
      console.log("Check resultResponse:", resultResponse);
      console.log(
        "Check resultResponse.data.result:",
        resultResponse?.data?.result
      );

      if (!resultResponse || !resultResponse[0]) {
        console.error("No data in result response.");
        setResultData([]);
      } else if (!resultResponse[0].data || !resultResponse[0].data.result) {
        console.error("No result field in data:", resultResponse[0].data);
        setResultData([]);
      } else {
        console.log("Result data found:", resultResponse[0].data.result);
        setResultData(resultResponse[0].data.result);
      }

      console.log("Result data set:", resultResponse?.data?.result);
    } catch (error) {
      console.error("Failed to load or update data:", error);
      message.error("Failed to load or update data.");
    }
  };

  const handleEditorChange = (value) => {
    setLocalQueryText(value || "");
    dispatch(updateTabContent({ tabId, content: value || "" }));
  };

  return (
    <div className={queryStyles.queryContainer}>
      <div className={queryStyles.tabsActions}>
        <div className={queryStyles.actionsBlock}>
          <button className={queryStyles.runButton} onClick={handleRunOrUpdate}>
            {chartId ? "Update" : "Run"}
          </button>
          <Select
            className={queryStyles.databaseSelect}
            value={selectedDatabase}
            onChange={(value) => setSelectedDatabase(value)}
            placeholder="Select a database"
            style={{ width: 200 }}
            loading={loading}
          >
            {databases.map((db) => (
              <Option key={db.id} value={db.id}>
                {db.connection_name}
              </Option>
            ))}
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
            {loading ? (
              <Spin />
            ) : resultData && Array.isArray(resultData) ? (
              resultData.length > 0 ? (
                resultData.map((item, index) => (
                  <pre key={index}>{JSON.stringify(item, null, 2)}</pre>
                ))
              ) : (
                "No results found."
              )
            ) : (
              "No results"
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Query;
