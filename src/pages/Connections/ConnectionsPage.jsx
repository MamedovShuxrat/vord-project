import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";
import {
  addConnection,
  updateConnection,
  setConnections,
  submitFormData
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
  const userToken = useSelector((state) => state.user.token); // Получаем токен пользователя
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userToken) {
      console.log("User is not logged in, clearing connections.");
      dispatch(setConnections([])); // Установите пустой массив, если пользователь не авторизован
      return;
    }

    const storedConnections = JSON.parse(localStorage.getItem("connections"));
    if (storedConnections) {
      dispatch(setConnections(storedConnections));
      console.log("Loaded connections from localStorage: ", storedConnections);
    } else {
      console.log("No stored connections found.");
    }
  }, [dispatch, userToken]); // Добавили userToken в зависимости, чтобы обновлять при изменении токена

  const [activeTab, setActiveTab] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

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
  };

  const addNewSQLTab = (newMySQLValue) => {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    const newTab = {
      id: uuid(),
      img: randomColor,
      MySQL: newMySQLValue,
      w: "20px",
      h: "20px",
      formData: {}
    };
    dispatch(addConnection(newTab));
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
    console.log("Handling Form Data Change: ", newFormData); // Лог для проверки
    dispatch(updateConnection({ id, formData: newFormData }));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSubmit = async (formData) => {
    await dispatch(submitFormData({ formData, activeTab }));
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
          <div className={commonStyles.tabsWrapper}>
            {connections
              .filter((item) =>
                item.MySQL.toLowerCase().includes(searchTerm.toLowerCase())
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
                    MySQL: {item.MySQL}
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
                      alt={`${item.MySQL}_pic`}
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
                    {item.MySQL}
                  </span>
                  <button className={commonStyles.tabsTopDots}>
                    <img src={dotsSvg} alt={`${item.MySQL}_pic`} />
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
                .MySQL
            }}
            onFormDataChange={(newFormData) =>
              handleFormDataChange(activeTab, newFormData)
            }
            onSubmit={handleSubmit}
            isConnected={isConnected}
            setIsConnected={setIsConnected}
          />
        )}
      </div>
    </div>
  );
};

export default ConnectionsPage;
