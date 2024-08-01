import React, { useState, useRef, useEffect } from "react";
import { v4 as uuid } from "uuid";
import SearchBlock from "../../components/SearchBlock/SearchBlock";
import Chat from "../../components/Chat/Chat";

import commonStyles from "../../assets/styles/commonStyles/common.module.scss";

import arrowSvg from "../../assets/images/icons/common/arrow.svg";
import arrowRightSvg from "../../assets/images/icons/common/arrow-right.svg";
import dotsSvg from "../../assets/images/icons/common/dots_three.svg";
import folderIcon from "../../assets/images/icons/common/folder.svg";
import fileIcon from "../../assets/images/icons/common/file.svg";
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
              icon: fileIcon
            }
          ]
        }
      ],
      files: []
    }
  ]);

  const [activeTab, setActiveTabs] = useState(null);
  const [contextMenu, setContextMenu] = useState({
    id: null,
    visible: false,
    x: 0,
    y: 0
  });
  const [selectedItem, setSelectedItem] = useState(null);

  const contextMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target)
      ) {
        setContextMenu({ id: null, visible: false, x: 0, y: 0 });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenuRef]);

  const onSelectTabsItem = (id) => {
    setActiveTabs(id);
  };

  const handleFolderRotate = (folderID, folders) => {
    return folders.map((folder) => {
      if (folder.id === folderID) {
        return { ...folder, isOpen: !folder.isOpen };
      }

      if (folder.subfolders.length > 0) {
        return {
          ...folder,
          subfolders: handleFolderRotate(folderID, folder.subfolders)
        };
      }

      return folder;
    });
  };

  const handleAddFolder = (parentId, folders) => {
    return folders.map((folder) => {
      if (folder.id === parentId) {
        const newFolder = {
          id: uuid(),
          name: `New Folder`,
          icon: folderIcon,
          isOpen: false,
          subfolders: [],
          files: []
        };
        return { ...folder, subfolders: [...folder.subfolders, newFolder] };
      }
      if (folder.subfolders.length > 0) {
        return {
          ...folder,
          subfolders: handleAddFolder(parentId, folder.subfolders)
        };
      }
      return folder;
    });
  };

  const handleAddFile = (parentId, folders) => {
    return folders.map((folder) => {
      if (folder.id === parentId) {
        const newFile = {
          id: uuid(),
          name: `New File`,
          icon: fileIcon
        };
        return { ...folder, files: [...folder.files, newFile] };
      }
      if (folder.subfolders.length > 0) {
        return {
          ...folder,
          subfolders: handleAddFile(parentId, folder.subfolders)
        };
      }
      return folder;
    });
  };

  const handleContextMenu = (e, id) => {
    e.preventDefault();
    const rect = e.target.getBoundingClientRect();
    setContextMenu({ id, visible: true, x: rect.right + 15, y: rect.top });
  };

  const handleContextMenuClick = (action) => {
    if (action === "addFolder") {
      setFoldersTab((prevFolders) =>
        handleAddFolder(contextMenu.id, prevFolders)
      );
    } else if (action === "addFile") {
      setFoldersTab((prevFolders) =>
        handleAddFile(contextMenu.id, prevFolders)
      );
    }
    setContextMenu({ id: null, visible: false, x: 0, y: 0 });
  };

  const handleItemClick = (id) => {
    setSelectedItem(id);
  };

  const renderSubFolders = (subfolders = [], files = [], level = 0) => {
    return (
      <>
        {subfolders.map((subfolder) => (
          <li
            key={subfolder.id}
            className={`${commonStyles.folderItem} ${selectedItem === subfolder.id ? commonStyles.selectedItem : ""}`}
            style={{ paddingLeft: `${level * 20}px` }}
          >
            <div
              className={commonStyles.folderHeader}
              onClick={() => handleItemClick(subfolder.id)}
            >
              <img
                onClick={() =>
                  setFoldersTab((prevFolders) =>
                    handleFolderRotate(subfolder.id, prevFolders)
                  )
                }
                className={commonStyles.FolderArrowRight}
                style={{
                  transform: `rotate(${subfolder.isOpen ? "90deg" : "0deg"})`
                }}
                src={arrowRightSvg}
                alt="arrow-down"
              />
              <img src={subfolder.icon} alt="folder" />
              <span>{subfolder.name}</span>
              <button
                className={commonStyles.tabsDots}
                onClick={(e) => handleContextMenu(e, subfolder.id)}
              >
                <img src={dotsSvg} alt="_pic" />
              </button>
            </div>
            {subfolder.isOpen && (
              <ul className={commonStyles.subFolderList}>
                {renderSubFolders(
                  subfolder.subfolders,
                  subfolder.files,
                  level + 1
                )}
              </ul>
            )}
          </li>
        ))}
        {files.map((file) => (
          <li
            key={file.id}
            className={`${commonStyles.folderItem} ${selectedItem === file.id ? commonStyles.selectedItem : ""}`}
            style={{ paddingLeft: `${level * 20}px` }}
          >
            <div
              className={commonStyles.fileHeader}
              onClick={() => handleItemClick(file.id)}
            >
              <img src={file.icon} alt="file" />
              <span>{file.name}</span>
              <button
                className={commonStyles.tabsDots}
                onClick={(e) => handleContextMenu(e, file.id)}
              >
                <img src={dotsSvg} alt="_pic" />
              </button>
            </div>
          </li>
        ))}
      </>
    );
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className={commonStyles.sectionWrapper}>
      <div>
        <div className={commonStyles.searchBlock}>
          <SearchBlock onSearch={handleSearch} placeholder="Search Files" />
          <div className={commonStyles.tabsWrapper}>
            <div className={commonStyles.folderWrapper}>
              {foldersTab
                .filter((item) =>
                  item.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((folder) => (
                  <div key={folder.id} className={commonStyles.folderItems}>
                    <div
                      className={`${commonStyles.folderHeader} ${selectedItem === folder.id ? commonStyles.selectedItem : ""}`}
                      onClick={() => handleItemClick(folder.id)}
                      style={{ paddingLeft: "0px" }}
                    >
                      <img
                        onClick={() =>
                          setFoldersTab((prevFolders) =>
                            handleFolderRotate(folder.id, prevFolders)
                          )
                        }
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
                        onClick={(e) => handleContextMenu(e, folder.id)}
                      >
                        <img src={dotsSvg} alt="_pic" />
                      </button>
                    </div>
                    {folder.isOpen && (
                      <ul className={commonStyles.subFolderList}>
                        {renderSubFolders(folder.subfolders, folder.files, 1)}
                      </ul>
                    )}
                  </div>
                ))}
            </div>
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
                  className={`${commonStyles.tabsTopItem} ${activeTab === item.id ? commonStyles.active : ""}`}
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
      {contextMenu.visible && (
        <div
          ref={contextMenuRef}
          className={commonStyles.contextMenu}
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button onClick={() => handleContextMenuClick("addFolder")}>
            Add Folder
          </button>
          <button onClick={() => handleContextMenuClick("addFile")}>
            Add File
          </button>
        </div>
      )}
    </div>
  );
};

export default FilesPage;
