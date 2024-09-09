import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";
import {
  addConnection,
  updateConnection,
  setConnections,
  submitFormData,
  fetchUserDatabases,
  removeUserConnection
} from "../../core/store/connectionsSlice";
import { useDotsMenu } from "../../components/utils/useDotsMenu";
import useTabNavigation from "../../components/utils/useTabNavigation";
import { renderImageOrIcon } from "../../components/utils/renderImageOrIcon";
import useSearch from "../../components/utils/useSearch";
import RenameDeleteMenu from "../Connections/MenuForFolderConnections/MenuForFolderConnections"; // Подключаем компонент меню

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

  useEffect(() => {
    if (!userToken) {
      console.log("User is not logged in, clearing connections.");
      dispatch(setConnections([]));
    } else {
      console.log("User is logged in, fetching connections.");
      dispatch(fetchUserDatabases());
    }
  }, [dispatch, userToken]);

  const [activeTab, setActiveTab] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [menuVisible, setMenuVisible] = useState(null); // Состояние для отображения меню
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 }); // Позиция меню

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
      connection_name: newMySQLValue,
      w: "20px",
      h: "20px",
      formData: {}
    };

    // Проверка на дублирование соединений
    if (!connections.some((conn) => conn.connection_name === newMySQLValue)) {
      dispatch(addConnection(newTab));
    }

    setActiveTab(newTab.id); // Устанавливаем новый активный таб
    setIsConnected(false);
  };

  const handleDeleteConnection = (id) => {
    dispatch(removeUserConnection(id)); // Вызываем новый thunk для удаления соединения
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
    } catch (error) {
      console.error("Failed to submit data: ", error);
    }
  };

  const handleMenuClick = (e, itemId, itemName) => {
    const { top, left, height } = e.currentTarget.getBoundingClientRect();
    setMenuPosition({ top: top + height, left });
    setMenuVisible(menuVisible === itemId ? null : itemId);
  };

  const handleCloseMenu = () => {
    setMenuVisible(null);
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
                      onClick={(e) =>
                        handleMenuClick(e, item.id, item.connection_name)
                      }
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
                    </button>
                    {menuVisible === item.id && (
                      <div
                        ref={wrapperRef}
                        className={commonStyles.menuWrapper}
                        style={{
                          top: menuPosition.top,
                          left: menuPosition.left
                        }}
                      >
                        <RenameDeleteMenu
                          itemId={item.id}
                          currentName={item.connection_name}
                          onCloseMenu={handleCloseMenu}
                        />
                      </div>
                    )}
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
            isNewConnection={
              !connections.find((tab) => tab.id === activeTab).isFromBackend
            }
          />
        )}
      </div>
    </div>
  );
};

export default ConnectionsPage;
