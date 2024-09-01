import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";
import {
  addConnection,
  updateConnection,
  setConnections,
  submitFormData,
  fetchUserDatabases
} from "../../core/store/connectionsSlice";
import { useDotsMenu } from "../../components/utils/useDotsMenu";
import useTabNavigation from "../../components/utils/useTabNavigation";
import { renderImageOrIcon } from "../../components/utils/renderImageOrIcon";
import useSearch from "../../components/utils/useSearch";

import commonStyles from "../../assets/styles/commonStyles/common.module.scss";
import SearchBlock from "../../components/SearchBlock/SearchBlock";
import Chat from "../../components/Chat/ui/Chat";
import CreateDataBaseCard from "../../components/CreateDataBaseCard/CreateDataBaseCard";

import arrowSvg from "../../assets/images/icons/common/arrow.svg";
import dotsSvg from "../../assets/images/icons/common/dots_three.svg";

const ConnectionsPage = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const connections = useSelector((state) => state.connections.connections);
  const userToken = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const status = useSelector((state) => state.connections.status);
  const error = useSelector((state) => state.connections.error);

  const [activeTab, setActiveTab] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isNewConnection, setIsNewConnection] = useState(false); // Новый стейт

  useEffect(() => {
    if (!userToken) {
      console.log("User is not logged in, clearing connections.");
      dispatch(setConnections([]));
    } else {
      console.log("User is logged in, fetching connections.");
      dispatch(fetchUserDatabases());
    }
  }, [dispatch, userToken]);

  const {
    dotsChange,
    handleRenameSQLTabs,
    handleDeleteTabs,
    handleDotsChange,
    wrapperRef
  } = useDotsMenu();

  const { handleLeftButtonClick, handleRightButtonClick } = useTabNavigation(
    connections,
    activeTab,
    setActiveTab
  );

  const onSelectTabsItem = (id) => {
    setActiveTab(id);
    const connection = connections.find((tab) => tab.id === id);
    setIsConnected(connection?.isNew ? false : true); // Изменяет `isConnected` в зависимости от состояния соединения
    setIsNewConnection(connection?.isNew || false); // Устанавливает флаг `isNewConnection`
  };

  const addNewSQLTab = (newMySQLValue) => {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    const newTab = {
      id: uuid(),
      img: randomColor,
      connection_name: newMySQLValue,
      w: "20px",
      h: "20px",
      formData: {},
      isNew: true // Добавляем флаг, чтобы идентифицировать новое соединение
    };
    dispatch(addConnection(newTab));
    setActiveTab(newTab.id);
    setIsNewConnection(true);
    setIsConnected(false);
  };

  const activeItemRef = useRef(null);

  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start"
      });
    }
  }, [activeTab]);

  const handleFormDataChange = (id, newFormData) => {
    console.log("Handling Form Data Change: ", newFormData);
    dispatch(updateConnection({ id, formData: newFormData }));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSubmit = async (formData) => {
    try {
      await dispatch(submitFormData({ formData, activeTab })).unwrap();
      console.log("Data submitted successfully!");
      setIsNewConnection(false); // После успешной отправки формы меняем состояние на false
    } catch (error) {
      console.error("Failed to submit data: ", error);
    }
  };

  return (
    <div className={commonStyles.sectionWrapper}>
      <div>
        <div className={commonStyles.searchBlock}>
          <SearchBlock
            onSearch={handleSearch}
            placeholder="Search Connection"
            addNewTab={addNewSQLTab}
          />
          {status === "loading" ? (
            <p>Loading...</p>
          ) : status === "failed" ? (
            <p>Error: {error}</p>
          ) : (
            <div className={commonStyles.tabsWrapper}>
              {connections
                .filter(
                  (item) =>
                    item.connection_name &&
                    item.connection_name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                )
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectTabsItem(item.id)}
                    className={`${commonStyles.tabsItem} ${
                      activeTab === item.id ? commonStyles.active : ""
                    }`}
                  >
                    {renderImageOrIcon(item)}
                    <span className={commonStyles.tabsName}>
                      {item.connection_name}
                    </span>
                    <button
                      className={commonStyles.tabsDots}
                      onClick={() => handleDotsChange(item.id)}
                    >
                      <img
                        style={{
                          transform: dotsChange[item.id]
                            ? "rotate(360deg)"
                            : "none"
                        }}
                        src={dotsSvg}
                        alt={`${item.connection_name}_pic`}
                      />
                      {dotsChange[item.id] && (
                        <div
                          ref={wrapperRef}
                          className={commonStyles.dotsChangeWrapper}
                        >
                          <span
                            onClick={() => handleRenameSQLTabs(item.id)}
                            className={commonStyles.dotsChangeRename}
                          >
                            Rename
                          </span>
                          <span
                            onClick={() => handleDeleteTabs(item.id)}
                            className={commonStyles.dotsChangeDelete}
                          >
                            Delete
                          </span>
                        </div>
                      )}
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      <div className={commonStyles.sectionMainContent}>
        <div className={commonStyles.tabsTopBlock}>
          <button
            className={commonStyles.tabsLeft}
            onClick={handleLeftButtonClick}
          >
            <img src={arrowSvg} alt="arrow-pic" />
          </button>
          <div className={commonStyles.tabsTopBlockWrapper}>
            <div className={commonStyles.tabsTopWrapper}>
              {connections.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectTabsItem(item.id)}
                  className={`${commonStyles.tabsTopItem} ${
                    activeTab === item.id ? commonStyles.active : ""
                  }`}
                  ref={activeTab === item.id ? activeItemRef : null}
                >
                  <span
                    className={`${commonStyles.tabsName} ${commonStyles.tabsTopName}`}
                  >
                    {item.connection_name}
                  </span>
                  <button className={commonStyles.tabsTopDots}>
                    <img src={dotsSvg} alt={`${item.connection_name}_pic`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button
            className={`${commonStyles.tabsRight}`}
            onClick={handleRightButtonClick}
          >
            <img src={arrowSvg} alt="arrow-pic" />
          </button>
          <div className={commonStyles.sectionChatWrapper}>
            <Chat />
          </div>
        </div>
        {activeTab && connections.find((tab) => tab.id === activeTab) && (
          <CreateDataBaseCard
            formData={{
              ...connections.find((tab) => tab.id === activeTab).formData,
              connectionName: connections.find((tab) => tab.id === activeTab)
                .connection_name
            }}
            onFormDataChange={(newFormData) =>
              handleFormDataChange(activeTab, newFormData)
            }
            onSubmit={handleSubmit}
            isConnected={isConnected}
            setIsConnected={setIsConnected}
            isNewConnection={isNewConnection} // Передаем в компонент
          />
        )}
      </div>
    </div>
  );
};

export default ConnectionsPage;
