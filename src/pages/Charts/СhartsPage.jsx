import React, { useState, useEffect, useRef } from "react";
import SearchBlock from "../../components/SearchBlock/SearchBlock";
import Chat from "../../components/Chat/Chat";
import Query from "../../components/Query/Query";
import MenuForDataSource from "./menu/MenuForDataSourse";
import MenuForQuery from "./menu/MenuForQuery";
import commonStyles from "../../assets/styles/commonStyles/common.module.scss";
import useSearch from "../../components/utils/useSearch";
import arrowSvg from "../../assets/images/icons/common/arrow.svg";
import arrowRightSvg from "../../assets/images/icons/common/arrow-right.svg";
import { v4 as uuid } from "uuid";
import folder from "../../assets/images/icons/common/folder.svg";
import dotsSvg from "../../assets/images/icons/common/dots_three.svg";

const ChartsPage = () => {
  const [foldersTab, setFoldersTab] = useState([]);
  const { searchTerm, setSearchTerm } = useSearch();
  const [activeTab, setActiveTab] = useState(null);
  const [menuVisible, setMenuVisible] = useState(null);
  const [queryMenuVisible, setQueryMenuVisible] = useState(null);
  const [queryMenuPosition, setQueryMenuPosition] = useState({
    top: 0,
    left: 0
  });
  const menuRef = useRef(null);
  const queryMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (menuRef.current && !menuRef.current.contains(event.target)) ||
        (queryMenuRef.current && !queryMenuRef.current.contains(event.target))
      ) {
        setMenuVisible(null);
        setQueryMenuVisible(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFolderRotate = (id) => {
    setFoldersTab((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === id ? { ...tab, isOpen: !tab.isOpen } : tab
      )
    );
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const addNewTab = (name) => {
    const newTab = {
      id: uuid(),
      name: name || `Query: Untitled ${foldersTab.length + 1}`,
      icon: folder,
      isOpen: true,
      subfolder: [],
      queryText: "" // Добавляем поле для хранения текста запроса
    };
    setFoldersTab((prevTabs) => [...prevTabs, newTab]);
    setActiveTab(newTab.id);
  };

  const handleContextMenuClick = (action) => {
    console.log("Action:", action);
    setMenuVisible(null);
    setQueryMenuVisible(null);
  };

  const handleQueryMenuClick = (e, folderId) => {
    const { top, left, height } = e.currentTarget.getBoundingClientRect();
    setQueryMenuPosition({ top: top + height, left: left + 10 });
    setQueryMenuVisible(folderId === queryMenuVisible ? null : folderId);
  };

  const updateQueryText = (id, text) => {
    setFoldersTab((prevTabs) =>
      prevTabs.map((tab) => (tab.id === id ? { ...tab, queryText: text } : tab))
    );
  };

  return (
    <div className={commonStyles.sectionWrapper}>
      <div>
        <div className={commonStyles.searchBlock}>
          <SearchBlock
            placeholder="Search Charts"
            onSearch={handleSearch}
            addNewTab={addNewTab} // Кнопка для добавления новой вкладки
          />
          <div className={commonStyles.tabsWrapper}>
            <ul className={commonStyles.folderWrapper}>
              {foldersTab
                .filter((item) =>
                  item.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((folder) => (
                  <div key={folder.id} className={commonStyles.folderItems}>
                    <div
                      className={`${commonStyles.folderItem} ${
                        activeTab === folder.id ? commonStyles.activeTab : ""
                      }`}
                      onClick={() => setActiveTab(folder.id)}
                      style={{ position: "relative" }}
                    >
                      <img
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFolderRotate(folder.id);
                        }}
                        className={commonStyles.FolderArrowRight}
                        style={{
                          transform: `rotate(${folder.isOpen ? "90deg" : "0deg"})`
                        }}
                        src={arrowRightSvg}
                        alt="arrow-down"
                      />
                      <img src={folder.icon} alt="folder" />
                      <span>{folder.name}</span>
                      <button
                        className={commonStyles.tabsDots}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuVisible(
                            folder.id === menuVisible ? null : folder.id
                          );
                        }}
                      >
                        <img src={dotsSvg} alt="_pic" />
                      </button>
                      {menuVisible === folder.id && (
                        <div className={commonStyles.menuWrapper} ref={menuRef}>
                          <MenuForDataSource
                            handleContextMenuClick={handleContextMenuClick}
                          />
                        </div>
                      )}
                    </div>
                    {folder.isOpen && (
                      <div className={commonStyles.folderItem}>
                        {/* Здесь можно отобразить дополнительные элементы или подпапки */}
                      </div>
                    )}
                  </div>
                ))}
            </ul>
          </div>
        </div>
      </div>
      <div className={commonStyles.sectionMainContent}>
        <div className={commonStyles.tabsTopBlock}>
          <button className={commonStyles.tabsLeft}>
            <img src={arrowSvg} alt="arrow-pic" />
          </button>
          <div className={commonStyles.tabsTopBlockWrapper}>
            <div className={commonStyles.tabsTopWrapper}>
              {foldersTab.map((folder) => (
                <div
                  key={folder.id}
                  className={`${commonStyles.tabsTopItem} ${
                    activeTab === folder.id ? commonStyles.activeTab : ""
                  }`}
                  onClick={() => setActiveTab(folder.id)}
                >
                  <span
                    className={`${commonStyles.tabsName} ${commonStyles.tabsTopName}`}
                  >
                    {folder.name}
                  </span>
                  <button
                    className={commonStyles.tabsTopDots}
                    onClick={(e) => handleQueryMenuClick(e, folder.id)}
                  >
                    <img src={dotsSvg} alt={`query_pic`} />
                  </button>
                  {queryMenuVisible === folder.id && (
                    <div
                      className={commonStyles.menuWrapper}
                      ref={queryMenuRef}
                      style={{
                        position: "absolute",
                        top: `${queryMenuPosition.top}px`,
                        left: `${queryMenuPosition.left}px`,
                        zIndex: 1000
                      }}
                    >
                      <MenuForQuery
                        handleContextMenuClick={handleContextMenuClick}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <button className={`${commonStyles.tabsRight}`}>
            <img src={arrowSvg} alt="arrow-pic" />
          </button>
          <div className={commonStyles.chatWrapper}>
            <Chat />
          </div>
        </div>

        {/* Отображаем компонент Query внутри активной вкладки */}
        <div className={commonStyles.queryContent}>
          {foldersTab.map(
            (folder) =>
              activeTab === folder.id && (
                <div key={folder.id}>
                  <Query
                    queryText={folder.queryText}
                    setQueryText={(text) => updateQueryText(folder.id, text)}
                  />
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartsPage;
