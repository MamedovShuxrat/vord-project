import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addFolder,
  setActiveTab,
  openTab,
  closeAllTabs,
  closeTab
} from "../../core/store/foldersSlice";
import { v4 as uuid } from "uuid";
import SearchBlock from "../../components/SearchBlock/SearchBlock";
import Chat from "../../components/Chat/ui/Chat";
import FileView from "../../components/FilesView/FilesView";
import MenuForView from "../../components/FilesView/menu/MenuForView";
import commonStyles from "../../assets/styles/commonStyles/common.module.scss";
import arrowSvg from "../../assets/images/icons/common/arrow.svg";
import dotsSvg from "../../assets/images/icons/common/dots_three.svg";
import useSearch from "../../components/utils/useSearch";
import folderIcon from "../../assets/images/icons/common/folder.svg";

const FilesPage = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const dispatch = useDispatch();
  const folders = useSelector((state) => state.folders.folders);
  const openTabs = useSelector((state) => state.folders.openTabs);
  const activeTab = useSelector((state) => state.folders.activeTab);

  const [contextMenu, setContextMenu] = useState({
    id: null,
    visible: false,
    x: 0,
    y: 0
  });
  const contextMenuRef = useRef(null);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const onSelectTabsItem = (id) => {
    dispatch(setActiveTab(id));
  };

  const handleItemClick = (id, name, type) => {
    dispatch(openTab({ id, name, type }));
  };

  const removeTab = (id) => {
    dispatch(closeTab(id));
  };

  const handleContextMenuClick = (action) => {
    if (action === "closeAllTabs") {
      dispatch(closeAllTabs());
    } else if (action === "closeSelectedTab") {
      removeTab(contextMenu.id);
    }
    setContextMenu({ id: null, visible: false, x: 0, y: 0 });
  };

  const handleContextMenu = (e, id) => {
    e.preventDefault();
    const rect = e.target.getBoundingClientRect();
    setContextMenu({
      id,
      visible: true,
      x: rect.right - 200,
      y: rect.bottom + window.scrollY
    });
  };

  // Определение функции для добавления новой вкладки
  const addNewTab = (name = "Untitled") => {
    const newFolder = {
      id: uuid(),
      name,
      icon: folderIcon, // Путь к иконке папки
      isOpen: true,
      subfolders: [],
      files: []
    };
    dispatch(addFolder({ parentId: null, folder: newFolder })); // Экшен для добавления новой папки
  };

  return (
    <div className={commonStyles.sectionWrapper}>
      <div>
        <div className={commonStyles.searchBlock}>
          <SearchBlock
            onSearch={handleSearch}
            placeholder="Search Files"
            addNewTab={addNewTab}
          />
          <div className={commonStyles.tabsWrapper}>
            <FileView
              foldersTab={folders}
              handleItemClick={handleItemClick}
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
                  className={`${commonStyles.tabsTopItem} ${
                    activeTab === item.id ? commonStyles.active : ""
                  }`}
                >
                  <span
                    className={`${commonStyles.tabsName} ${commonStyles.tabsTopName}`}
                    onClick={() => onSelectTabsItem(item.id)}
                  >
                    {item.name}
                  </span>
                  <button
                    className={commonStyles.tabsTopDots}
                    onClick={(e) => handleContextMenu(e, item.id)}
                  >
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
      {contextMenu.visible && (
        <div
          ref={contextMenuRef}
          className={commonStyles.contextMenuForView}
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <MenuForView handleContextMenuClick={handleContextMenuClick} />
        </div>
      )}
    </div>
  );
};

export default FilesPage;
