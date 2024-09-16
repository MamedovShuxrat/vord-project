import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import SearchBlock from "../../components/SearchBlock/SearchBlock";
import Chat from "../../components/Chat/ui/Chat";
import Query from "./Query/Query";
import Chart from "../../pages/Charts/ui/Chart";
import CleanData from "../../pages/Charts/ui/CleanData";
import MenuForFileCharts from "./menu/MenuForFileCharts";
import MenuForQueryCharts from "./menu/MenuForQueryCharts";
import MenuForView from "../../pages/Files/FilesView/menu/MenuForView";
import commonStyles from "../../assets/styles/commonStyles/common.module.scss";
import useSearch from "../../components/utils/useSearch";
import arrowSvg from "../../assets/images/icons/common/arrow.svg";
import arrowRightSvg from "../../assets/images/icons/common/arrow-right.svg";
import folder from "../../assets/images/icons/common/folder.svg";
import dotsSvg from "../../assets/images/icons/common/dots_three.svg";
import {
  addFolder,
  removeFolder,
  updateFolder,
  toggleFolderOpen,
  addFileToFolder,
  removeFileFromFolder,
  renameFileInFolder,
  updateFileText,
  setActiveTab,
  openFile,
  closeFile,
  updateTabContent
} from "../../core/store/chartsSlice";

const ChartsPage = () => {
  const dispatch = useDispatch();
  const foldersTab = useSelector((state) => state.charts.foldersTab);
  const activeTab = useSelector((state) => state.charts.activeTab);
  const openedFiles = useSelector((state) => state.charts.openedFiles);
  const connections = useSelector((state) => state.connections.connections);
  console.log(connections);

  const fetchConnections = () => {
    return Promise.resolve(connections.map(conn => conn.connection_name));
  };

  const { searchTerm, setSearchTerm } = useSearch();
  const [menuVisible, setMenuVisible] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [menuType, setMenuType] = useState(null);
  const [renamingTab, setRenamingTab] = useState(null);
  const [newTabName, setNewTabName] = useState("");
  const [renamingFile, setRenamingFile] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const menuRef = useRef(null);
  const tabsContainerRef = useRef(null);
  const [databases, setDatabases] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // console.log("Trying to access localStorage for connections");
    const storedConnections = localStorage.getItem("connections");
    // console.log("Raw connections data from localStorage:", storedConnections);

    if (storedConnections) {
      const parsedConnections = JSON.parse(storedConnections);
      // console.log("Parsed connections from localStorage:", parsedConnections);
      setDatabases(parsedConnections); // Сохраняем базы данных в состояние
    } else {
      // console.warn("No connections found in localStorage.");
    }
    setLoading(false); // Завершаем загрузку
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(null);
        setRenamingTab(null);
        setRenamingFile(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFolderRotate = (id) => {
    dispatch(toggleFolderOpen(id));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const addNewTab = (name, queryText = "") => {
    const tempChartId = uuid(); // Временный ID
    const newTabId = uuid(); // ID для вкладки

    const newTab = {
      id: newTabId,
      name: name || `Query: Без названия ${foldersTab.length + 1}`,
      icon: folder,
      isOpen: true,
      subfolder: [
        { id: uuid(), name: "Chart: 1", type: "chart", tempChartId }, // Временный ID чарта
        { id: uuid(), name: "Clean Data: 1", type: "cleanData" }
      ],
      queryText
    };

    dispatch(addFolder(newTab));
    dispatch(setActiveTab(newTabId));

    dispatch(updateTabContent({ tabId: newTabId, content: queryText }));
  };

  const closeRelatedTabs = (id) => {
    const relatedFiles = openedFiles.filter((file) => {
      const folder = findFolderByFileId(file.id);
      return file.id === id || (folder && folder.id === id);
    });

    relatedFiles.forEach((file) => {
      dispatch(closeFile(file.id));
    });

    if (
      activeTab === id ||
      relatedFiles.some((file) => file.id === activeTab)
    ) {
      dispatch(setActiveTab(null));
    }
  };

  // Новая функция для закрытия всех вкладок (и папок, и файлов)
  const closeAllTabs = () => {
    foldersTab.forEach((folder) => dispatch(closeFile(folder.id)));
    openedFiles.forEach((file) => dispatch(closeFile(file.id)));
    dispatch(setActiveTab(null));
  };

  const handleContextMenuClick = (action, id) => {
    if (menuType === "folder") {
      if (action === "duplicate") {
        duplicateTab(id);
      } else if (action === "delete") {
        dispatch(removeFolder(id));
        closeRelatedTabs(id);
      } else if (action === "rename") {
        setRenamingTab(id);
        setNewTabName(foldersTab.find((tab) => tab.id === id).name);
      }
    } else if (menuType === "file") {
      if (action === "duplicate") {
        duplicateFile(id);
      } else if (action === "delete") {
        const folder = findFolderByFileId(id);
        if (folder) {
          dispatch(
            removeFileFromFolder({
              folderId: folder.id,
              fileId: id
            })
          );
        }
        closeRelatedTabs(id);
      } else if (action === "rename") {
        startRenamingFile(id);
      }
    } else if (menuType === "view") {
      // Логика для меню "view"
      if (action === "closeAllTabs") {
        closeAllTabs();
      } else if (action === "closeSelectedTab") {
        if (activeTab) {
          dispatch(closeFile(activeTab));
          dispatch(setActiveTab(null));
        }
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

  const renameTab = (id, newName) => {
    dispatch(updateFolder({ id, newName }));
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
    dispatch(updateFileText({ fileId: id, newText: text }));
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
    const folder = findFolderByFileId(fileId);
    const fileIndex = folder.subfolder.findIndex((file) => file.id === fileId);
    if (fileIndex !== -1) {
      const newFile = {
        ...folder.subfolder[fileIndex],
        id: uuid(),
        name: `${folder.subfolder[fileIndex].name} (Копия)`
      };
      dispatch(addFileToFolder({ folderId: folder.id, file: newFile }));
    }
  };

  const findFolderByFileId = (fileId) => {
    return foldersTab.find((tab) =>
      tab.subfolder.some((file) => file.id === fileId)
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
    const folder = findFolderByFileId(fileId);
    dispatch(renameFileInFolder({ folderId: folder.id, fileId, newName }));
    setRenamingFile(null);
  };

  const handleFileClick = (file) => {
    dispatch(openFile(file));
  };

  return (
    <div className={commonStyles.sectionWrapper}>
      <div>
        <div className={commonStyles.searchBlock}>
          <SearchBlock
            placeholder="Search Charts"
            onSearch={handleSearch}
            addNewTab={addNewTab}
            fetchConnections={fetchConnections}
            placeholderText="Введите название нового запроса"
          />
          <div className={commonStyles.tabsWrapper}>
            <ul className={commonStyles.folderWrapper}>
              {foldersTab
                .filter((item) =>
                  item.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((folder) => (
                  <div key={folder.id} className={commonStyles.tabsItems}>
                    <div
                      className={`${commonStyles.folderItem} ${activeTab === folder.id ? commonStyles.activeTab : ""
                        }`}
                      onClick={() => dispatch(setActiveTab(folder.id))}
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
                              transform: `rotate(${folder.isOpen ? "90deg" : "0deg"
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
                          <div
                            key={file.id}
                            className={commonStyles.fileItem}
                            onClick={() => handleFileClick(file)}
                          >
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
                  className={`${commonStyles.tabsTopItem} ${activeTab === folder.id ? commonStyles.active : ""
                    }`}
                  onClick={() => dispatch(setActiveTab(folder.id))}
                >
                  <span
                    className={`${commonStyles.tabsName} ${commonStyles.tabsTopName}`}
                  >
                    {folder.name}
                  </span>
                  <button
                    className={commonStyles.tabsTopDots}
                    onClick={(e) => handleMenuClick(e, folder.id, "view")}
                  >
                    <img src={dotsSvg} alt={`query_pic`} />
                  </button>
                </div>
              ))}
              {openedFiles.map((file) => (
                <div
                  key={file.id}
                  className={`${commonStyles.tabsTopItem} ${activeTab === file.id ? commonStyles.active : ""
                    }`}
                  onClick={() => dispatch(setActiveTab(file.id))}
                >
                  <span
                    className={`${commonStyles.tabsName} ${commonStyles.tabsTopName}`}
                  >
                    {file.name}
                  </span>
                  <button
                    className={commonStyles.tabsTopDots}
                    onClick={(e) => handleMenuClick(e, file.id, "view")}
                  >
                    <img src={dotsSvg} alt={`file_pic`} />
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
                    tabId={folder.id}
                    databases={databases}
                    loading={loading}
                    chartId={folder.id}
                  />
                </div>
              )
          )}
          {openedFiles.map(
            (file) =>
              activeTab === file.id && (
                <div key={file.id}>
                  {file.type === "chart" && (
                    <Chart
                      tabId={file.id}
                      chartId={file.tempChartId || file.chartId}
                    />
                  )}
                  {file.type === "cleanData" && <CleanData tabId={file.id} />}
                </div>
              )
          )}
        </div>
      </div>
      {menuVisible && (
        <div
          ref={menuRef}
          className={commonStyles.menuWrapper}
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
          ) : menuType === "file" ? (
            <MenuForFileCharts
              handleContextMenuClick={(action) =>
                handleContextMenuClick(action, menuVisible)
              }
            />
          ) : (
            <MenuForView
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
