import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import SearchBlock from "../../components/SearchBlock/SearchBlock";
import Chat from "../../components/Chat/Chat";
import FileView from "../../components/FilesView/FilesView";

import commonStyles from "../../assets/styles/commonStyles/common.module.scss";

import arrowSvg from "../../assets/images/icons/common/arrow.svg";
import dotsSvg from "../../assets/images/icons/common/dots_three.svg";
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
          files: []
        }
      ],
      files: []
    }
  ]);

  const [activeTab, setActiveTabs] = useState(null);
  const [openTabs, setOpenTabs] = useState([]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const onSelectTabsItem = (id) => {
    setActiveTabs(id);
  };

  const handleItemClick = (id, name, type) => {
    if (type === "file") {
      setActiveTabs(id);
      if (!openTabs.some((tab) => tab.id === id)) {
        setOpenTabs([...openTabs, { id, name, type }]);
      }
    }
  };

  const updateTabName = (id, newName) => {
    setOpenTabs((prevTabs) =>
      prevTabs.map((tab) => (tab.id === id ? { ...tab, name: newName } : tab))
    );
  };

  const removeTab = (id) => {
    setOpenTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== id));
    if (activeTab === id) {
      setActiveTabs(null);
    }
  };

  return (
    <div className={commonStyles.sectionWrapper}>
      <div>
        <div className={commonStyles.searchBlock}>
          <SearchBlock onSearch={handleSearch} placeholder="Search Files" />
          <div className={commonStyles.tabsWrapper}>
            <FileView
              foldersTab={foldersTab}
              setFoldersTab={setFoldersTab}
              handleItemClick={handleItemClick}
              updateTabName={updateTabName}
              removeTab={removeTab}
            />
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
              {openTabs.map((item) => (
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
