import React, { useState } from "react";
import SearchBlock from "../../components/SearchBlock/SearchBlock";
import Chat from "../../components/Chat/Chat";
import Query from "../../components/Query/Query"; // Импортируем компонент Query
import commonStyles from "../../assets/styles/commonStyles/common.module.scss";
import useSearch from "../../components/utils/useSearch";
import arrowSvg from "../../assets/images/icons/common/arrow.svg";
import arrowRightSvg from "../../assets/images/icons/common/arrow-right.svg";
import { v4 as uuid } from "uuid";

import folder from "../../assets/images/icons/common/folder.svg";
import dotsSvg from "../../assets/images/icons/common/dots_three.svg";

const ChartsPage = () => {
  const [foldersTab, setFoldersTab] = useState([
    {
      id: uuid(),
      name: "Query: Untitled 1",
      icon: folder,
      isOpen: true,
      subfolder: []
    },
    {
      id: uuid(),
      name: "Query: Untitled 2",
      icon: folder,
      isOpen: false,
      subfolder: []
    }
  ]);

  const { searchTerm, setSearchTerm } = useSearch();
  const [activeTab, setActiveTab] = useState(foldersTab[0].id); // Отслеживаем активную вкладку

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

  return (
    <div className={commonStyles.sectionWrapper}>
      <div>
        <div className={commonStyles.searchBlock}>
          <SearchBlock placeholder="Search Charts" onSearch={handleSearch} />
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
                        onClick={(e) => e.stopPropagation()}
                      >
                        <img src={dotsSvg} alt="_pic" />
                      </button>
                    </div>
                    {folder.isOpen && (
                      <div className={commonStyles.folderItem}>
                        {/* Render subfolders here */}
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
                  <button className={commonStyles.tabsTopDots}>
                    <img src={dotsSvg} alt={`query_pic`} />
                  </button>
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
                  <Query />
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartsPage;
