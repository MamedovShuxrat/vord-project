import React, { useState, useEffect, useRef } from "react";
import SearchBlock from "../../components/SearchBlock/SearchBlock";
import Chat from "../../components/Chat/ui/Chat";
import Query from "../../components/Query/Query";
import MenuForFileCharts from "./menu/MenuForFileCharts";
import MenuForQueryCharts from "./menu/MenuForQueryCharts";
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
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0
  });
  const [menuType, setMenuType] = useState(null);
  const [renamingTab, setRenamingTab] = useState(null);
  const [newTabName, setNewTabName] = useState("");
  const [renamingFile, setRenamingFile] = useState(null); // Новый стейт для ID файла, который переименовывается
  const [newFileName, setNewFileName] = useState(""); // Новый стейт для имени файла
  const menuRef = useRef(null);
  const tabsContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(null);
        setRenamingTab(null);
        setRenamingFile(null); // Сбросить переименовываемый файл при клике вне меню
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

  const addNewTab = (name, queryText = "") => {
    const newTab = {
      id: uuid(),
      name: name || `Query: Без названия ${foldersTab.length + 1}`,
      icon: folder,
      isOpen: true,
      subfolder: [
        { id: uuid(), name: "Chart: 1" },
        { id: uuid(), name: "Clean Data: 1" }
      ],
      queryText
    };
    setFoldersTab((prevTabs) => [...prevTabs, newTab]);
    setActiveTab(newTab.id);
  };

  const handleContextMenuClick = (action, id) => {
    if (menuType === "folder") {
      if (action === "duplicate") {
        duplicateTab(id);
      } else if (action === "delete") {
        deleteTab(id);
      } else if (action === "rename") {
        setRenamingTab(id);
        setNewTabName(foldersTab.find((tab) => tab.id === id).name);
      }
    } else if (menuType === "file") {
      if (action === "duplicate") {
        duplicateFile(id);
      } else if (action === "delete") {
        deleteFile(id);
      } else if (action === "rename") {
        startRenamingFile(id);
      }
    }
    setMenuVisible(null);
  };

  const duplicateTab = (id) => {
    const tabToDuplicate = foldersTab.find(
      (tab) => tab.id === id || tab.subfolder.some((file) => file.id === id)
    );
    if (tabToDuplicate) {
      addNewTab(`${tabToDuplicate.name} (Копия)`, tabToDuplicate.queryText);
    }
  };

  const deleteTab = (id) => {
    setFoldersTab((prevTabs) => prevTabs.filter((tab) => tab.id !== id));

    if (activeTab === id) {
      const remainingTabs = foldersTab.filter((tab) => tab.id !== id);
      setActiveTab(remainingTabs.length ? remainingTabs[0].id : null);
    }
  };

  const renameTab = (id, newName) => {
    setFoldersTab((prevTabs) =>
      prevTabs.map((tab) => (tab.id === id ? { ...tab, name: newName } : tab))
    );
    setRenamingTab(null);
  };

  const handleRenameKeyPress = (e, id) => {
    if (e.key === "Enter") {
      if (renamingTab) {
        renameTab(id, newTabName);
      } else if (renamingFile) {
        renameFile(id, newFileName);
      }
    }
  };

  const handleMenuClick = (e, id, type) => {
    const { top, left, height } = e.currentTarget.getBoundingClientRect();
    setMenuPosition({ top: top + height, left: left + 10 });
    setMenuVisible(id === menuVisible ? null : id);
    setMenuType(type);
  };

  const updateQueryText = (id, text) => {
    setFoldersTab((prevTabs) =>
      prevTabs.map((tab) => (tab.id === id ? { ...tab, queryText: text } : tab))
    );
  };

  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth"
      });
    }
  };

  const duplicateFile = (fileId) => {
    setFoldersTab((prevTabs) =>
      prevTabs.map((tab) => {
        const fileIndex = tab.subfolder.findIndex((file) => file.id === fileId);
        if (fileIndex !== -1) {
          const newFile = {
            ...tab.subfolder[fileIndex],
            id: uuid(),
            name: `${tab.subfolder[fileIndex].name} (Копия)`
          };
          const updatedSubfolder = [
            ...tab.subfolder.slice(0, fileIndex + 1),
            newFile,
            ...tab.subfolder.slice(fileIndex + 1)
          ];
          return { ...tab, subfolder: updatedSubfolder };
        }
        return tab;
      })
    );
  };

  const deleteFile = (fileId) => {
    setFoldersTab((prevTabs) =>
      prevTabs.map((tab) => ({
        ...tab,
        subfolder: tab.subfolder.filter((file) => file.id !== fileId)
      }))
    );
  };

  const startRenamingFile = (fileId) => {
    setRenamingFile(fileId);
    const currentFile = foldersTab
      .flatMap((folder) => folder.subfolder)
      .find((file) => file.id === fileId);
    setNewFileName(currentFile.name);
  };

  const renameFile = (fileId, newName) => {
    setFoldersTab((prevTabs) =>
      prevTabs.map((tab) => ({
        ...tab,
        subfolder: tab.subfolder.map((file) =>
          file.id === fileId ? { ...file, name: newName } : file
        )
      }))
    );
    setRenamingFile(null);
  };

  return (
    <div className={commonStyles.sectionWrapper}>
      <div>
        <div className={commonStyles.searchBlock}>
          <SearchBlock
            placeholder="Search Charts"
            onSearch={handleSearch}
            addNewTab={addNewTab}
            placeholderText="Введите название нового запроса"
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
                    >
                      <div className={commonStyles.folderHeader}>
                        <div className={commonStyles.folderInfo}>
                          <img
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFolderRotate(folder.id);
                            }}
                            className={commonStyles.FolderArrowRight}
                            style={{
                              transform: `rotate(${
                                folder.isOpen ? "90deg" : "0deg"
                              })`
                            }}
                            src={arrowRightSvg}
                            alt="arrow-down"
                          />
                          <img src={folder.icon} alt="folder" />
                          {renamingTab === folder.id ? (
                            <input
                              type="text"
                              value={newTabName}
                              onChange={(e) => setNewTabName(e.target.value)}
                              onKeyDown={(e) =>
                                handleRenameKeyPress(e, folder.id)
                              }
                              onBlur={() => renameTab(folder.id, newTabName)}
                              className={commonStyles.renameInput}
                              autoFocus
                            />
                          ) : (
                            <span>{folder.name}</span>
                          )}
                        </div>
                        <button
                          className={commonStyles.tabsDots}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuClick(e, folder.id, "folder");
                          }}
                        >
                          <img src={dotsSvg} alt="_pic" />
                        </button>
                      </div>
                    </div>
                    {folder.isOpen && (
                      <div className={commonStyles.folderSubItems}>
                        {folder.subfolder.map((file) => (
                          <div key={file.id} className={commonStyles.fileItem}>
                            {renamingFile === file.id ? (
                              <input
                                type="text"
                                value={newFileName}
                                onChange={(e) => setNewFileName(e.target.value)}
                                onKeyDown={(e) =>
                                  handleRenameKeyPress(e, file.id)
                                }
                                onBlur={() => renameFile(file.id, newFileName)}
                                className={commonStyles.renameInput}
                                autoFocus
                              />
                            ) : (
                              <span>{file.name}</span>
                            )}
                            <button
                              className={commonStyles.tabsDots}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenuClick(e, file.id, "file");
                              }}
                            >
                              <img src={dotsSvg} alt="_pic" />
                            </button>
                          </div>
                        ))}
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
          <button
            className={commonStyles.tabsLeft}
            onClick={() => scrollTabs("left")}
          >
            <img src={arrowSvg} alt="arrow-pic" />
          </button>
          <div
            className={commonStyles.tabsTopBlockWrapper}
            ref={tabsContainerRef}
          >
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
                    onClick={(e) => handleMenuClick(e, folder.id, "folder")}
                  >
                    <img src={dotsSvg} alt={`query_pic`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button
            className={commonStyles.tabsRight}
            onClick={() => scrollTabs("right")}
          >
            <img src={arrowSvg} alt="arrow-pic" />
          </button>
          <div className={commonStyles.chatWrapper}>
            <Chat />
          </div>
        </div>
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
      {menuVisible && (
        <div
          className={commonStyles.menuWrapper}
          ref={menuRef}
          style={{
            position: "fixed",
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            zIndex: 1000
          }}
        >
          {menuType === "folder" ? (
            <MenuForQueryCharts
              handleContextMenuClick={(action) =>
                handleContextMenuClick(action, menuVisible)
              }
            />
          ) : (
            <MenuForFileCharts
              handleContextMenuClick={(action) =>
                handleContextMenuClick(action, menuVisible)
              }
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ChartsPage;
