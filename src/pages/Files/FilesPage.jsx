import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import SearchBlock from "../../components/SearchBlock/SearchBlock";
import Chat from "../../components/Chat/Chat";
import FileView from "../../components/FilesView/FilesView";

import commonStyles from "../../assets/styles/commonStyles/common.module.scss";

import arrowSvg from "../../assets/images/icons/common/arrow.svg"; // Импортируем arrowSvg
import dotsSvg from "../../assets/images/icons/common/dots_three.svg"; // Импортируем dotsSvg
import folderIcon from "../../assets/images/icons/common/folder.svg";
import useSearch from "../../components/utils/useSearch";

const FilesPage = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const [foldersTab, setFoldersTab] = useState([
    {
      id: uuid(),
      name: "Untitled",
      icon: folderIcon,
      isOpen: false,
      subfolders: [
        {
          id: uuid(),
          name: "Untitled",
          icon: folderIcon,
          isOpen: false,
          subfolders: [],
          files: [
            {
              id: uuid(),
              name: "Untitled",
              icon: folderIcon
            }
          ]
        }
      ],
      files: []
    }
  ]);

  const [activeTab, setActiveTabs] = useState(null); // Добавляем объявление activeTab

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const onSelectTabsItem = (id) => {
    // Добавляем объявление onSelectTabsItem
    setActiveTabs(id);
  };

  return (
    <div className={commonStyles.sectionWrapper}>
      <div>
        <div className={commonStyles.searchBlock}>
          <SearchBlock onSearch={handleSearch} placeholder="Search Files" />
          <div className={commonStyles.tabsWrapper}>
            <FileView foldersTab={foldersTab} setFoldersTab={setFoldersTab} />
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
              {foldersTab.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectTabsItem(item.id)}
                  className={`${commonStyles.tabsTopItem} ${
                    activeTab === item.id ? commonStyles.active : ""
                  }`}
                >
                  <span
                    className={`${commonStyles.tabsName} ${commonStyles.tabsTopName}`}
                  >
                    {" "}
                    {item.name}
                  </span>
                  <button className={commonStyles.tabsTopDots}>
                    <img src={dotsSvg} alt={`${item.name}_pic`} />
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
      </div>
    </div>
  );
};

export default FilesPage;
