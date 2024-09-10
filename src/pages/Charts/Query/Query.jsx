import React, { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import queryStyles from "./query.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { updateTabContent } from "../../../core/store/chartsSlice";
import { Select, Spin, message } from "antd";
import { runQuery, fetchQueryResult, updateQueryData } from "../api/index";
import { addVisualization } from "../../../core/store/chartvisualizationSlice";
import { v4 as uuid } from "uuid";

const { Option } = Select;

const EXTENSIONS = [
  { id: 1, extension: false, name: "json api" },
  { id: 3, extension: "xlsx", name: "excel xlsx" },
  { id: 5, extension: "csv", name: "csv" },
];

const Query = ({ tabId, databases, loading }) => {
  const dispatch = useDispatch();
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [selectedExtensionId, setSelectedExtensionId] = useState(null);
  const [showSQL, setShowSQL] = useState(true);
  const [chartUuid, setChartUuid] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [isFetching, setIsFetching] = useState(false); // состояние для отображения спиннера

  const accessToken = JSON.parse(localStorage.getItem("userToken"));

  const tabContent = useSelector(
    (state) => state.charts.tabContents?.[tabId] || ""
  );
  const [localQueryText, setLocalQueryText] = useState(tabContent);

  useEffect(() => {
    setLocalQueryText(tabContent);
  }, [tabContent]);

  useEffect(() => {
    if (resultData && resultData.length > 0) {
      setShowSQL(false); // Автоматически переключаемся на вкладку с результатами
    }
  }, [resultData]);

  const handleRunOrUpdate = async () => {
    if (!selectedDatabase || !localQueryText || selectedExtensionId === null) {
      message.error("Choose database, enter SQL query and choose extension.");
      return;
    }

    const requestData = {
      clientdb_id: selectedDatabase,
      str_query: localQueryText,
      extension: selectedExtensionId,
    };

    try {
      setIsFetching(true); // Устанавливаем isFetching в true при начале запроса

      let response;

      if (chartUuid) {
        response = await updateQueryData(accessToken, chartUuid, requestData);
        message.success("Data updated successfully.");
      } else {
        response = await runQuery(accessToken, requestData);
        setChartUuid(response.uuid);
        message.success("Data loaded successfully.");
      }

      const clientDataId = response?.clientdata?.id;
      if (!clientDataId) {
        throw new Error("Client data ID is missing.");
      }
      localStorage.setItem('lastChartId', clientDataId);

      const resultResponse = await fetchQueryResult(accessToken, clientDataId);
      const clientData = resultResponse?.data || [];


      if (clientData.length === 0) {
        setResultData([]);
        message.error("No data found in clientdata.");
      } else {
        setResultData(clientData);
        const columnNames = Object.keys(clientData[0]);

        // Сохраняем chartUuid и columnNames в localStorage

        localStorage.setItem('lastChartColumns', JSON.stringify(columnNames));

        // Дополнительно диспатчим сохранение столбцов для визуализации
        dispatch(addVisualization({
          chartUuid: response.uuid,
          visualization: { columnNames }
        }));
      }
    } catch (error) {
      message.error(`Failed to load or update data: ${error.message}`);
    } finally {
      setIsFetching(false); // Снимаем флаг загрузки после завершения запроса
    }
  };


  const handleUpdateClick = () => {
    setShowSQL(true);
    setLocalQueryText(tabContent);
  };

  const handleEditorChange = (value) => {
    setLocalQueryText(value || "");
    dispatch(updateTabContent({ tabId, content: value || "" }));
  };

  return (
    <div className={queryStyles.queryContainer}>
      <div className={queryStyles.tabsActions}>
        <div className={queryStyles.actionsBlock}>
          <button
            className={queryStyles.runButton}
            onClick={showSQL ? handleRunOrUpdate : handleUpdateClick}
          >
            {showSQL ? "Run" : "Update"}
          </button>
          <Select
            className={queryStyles.databaseSelect}
            value={selectedDatabase}
            onChange={(value) => setSelectedDatabase(value)}
            placeholder="Select a database"
            style={{ width: 200 }}
            loading={loading}
          >
            {(databases || []).map((db) => (
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
            {isFetching ? (
              // Показываем спиннер в самом окне результатов
              <Spin tip="Loading..." style={{ display: "block", margin: "0 auto" }} />
            ) : resultData && Array.isArray(resultData) ? (
              resultData.length > 0 ? (
                // В зависимости от выбранного расширения показываем разные форматы данных
                selectedExtensionId === 1 ? (
                  // JSON API - показываем как JSON
                  <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(resultData, null, 2)}
        </pre>
                ) : selectedExtensionId === 3 ? (
                  // Excel XLSX - показываем в виде таблицы
                  <table>
                    <thead>
                    <tr>
                      {Object.keys(resultData[0]).map((column) => (
                        <th key={column}>{column}</th>
                      ))}
                    </tr>
                    </thead>
                    <tbody>
                    {resultData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.values(row).map((value, colIndex) => (
                          <td key={colIndex}>{value}</td>
                        ))}
                      </tr>
                    ))}
                    </tbody>
                  </table>
                ) : selectedExtensionId === 5 ? (
                  // CSV - выводим как CSV строку
                  <pre style={{ whiteSpace: "pre-wrap" }}>
          {resultData
            .map((row) => Object.values(row).join(", "))
            .join("\n")}
        </pre>
                ) : (
                  "No valid extension selected."
                )
              ) : (
                "No results found."
              )
            ) : (
              <div>Проверка данных: {JSON.stringify(resultData)}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Query;
