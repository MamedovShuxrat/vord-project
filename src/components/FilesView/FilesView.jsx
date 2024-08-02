import React, { useState, useRef, useEffect } from "react";
import { v4 as uuid } from "uuid";
import arrowRightSvg from "../../assets/images/icons/common/arrow-right.svg";
import dotsSvg from "../../assets/images/icons/common/dots_three.svg";
import folderIcon from "../../assets/images/icons/common/folder.svg";
import fileIcon from "../../assets/images/icons/common/file.svg";
import styles from "./filesView.module.scss";
import MenuForFolder from "./menu/MenuForFolder";
import MenuForFiles from "./menu/MenuForFiles";

const FileView = ({
  foldersTab,
  setFoldersTab,
  handleItemClick,
  updateTabName,
  removeTab
}) => {
  const [contextMenu, setContextMenu] = useState({
    id: null,
    type: null,
    visible: false,
    x: 0,
    y: 0
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState("");

  const contextMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target)
      ) {
        setContextMenu({ id: null, type: null, visible: false, x: 0, y: 0 });
        setIsRenaming(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenuRef]);

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

  const handleDeleteFile = (fileId, folders) => {
    return folders.map((folder) => {
      folder.files = folder.files.filter((file) => file.id !== fileId);
      if (folder.subfolders.length > 0) {
        folder.subfolders = handleDeleteFile(fileId, folder.subfolders);
      }
      return folder;
    });
  };

  const handleContextMenu = (e, id, type) => {
    e.preventDefault();
    const rect = e.target.getBoundingClientRect();
    setContextMenu({
      id,
      type,
      visible: true,
      x: rect.right + 10,
      y: rect.top
    });
  };

  const handleContextMenuClick = (action) => {
    if (contextMenu.type === "folder") {
      if (action === "addFolder") {
        setFoldersTab((prevFolders) =>
          handleAddFolder(contextMenu.id, prevFolders)
        );
      } else if (action === "addFile") {
        setFoldersTab((prevFolders) =>
          handleAddFile(contextMenu.id, prevFolders)
        );
      }
    } else if (contextMenu.type === "file") {
      if (action === "rename") {
        setIsRenaming(true);
        setNewName(selectedItem.name);
      } else if (action === "delete") {
        setFoldersTab((prevFolders) =>
          handleDeleteFile(contextMenu.id, prevFolders)
        );
        setSelectedItem(null);
        removeTab(contextMenu.id);
      }
    }
    setContextMenu({ id: null, type: null, visible: false, x: 0, y: 0 });
  };

  const handleRename = (id, newName, folders) => {
    return folders.map((folder) => {
      if (folder.files.find((file) => file.id === id)) {
        folder.files = folder.files.map((file) =>
          file.id === id ? { ...file, name: newName } : file
        );
      }
      if (folder.subfolders.length > 0) {
        folder.subfolders = handleRename(id, newName, folder.subfolders);
      }
      return folder;
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && isRenaming && newName.trim()) {
      setFoldersTab((prevFolders) =>
        handleRename(selectedItem.id, newName, prevFolders)
      );
      updateTabName(selectedItem.id, newName);
      setIsRenaming(false);
    }
  };

  const handleFileClick = (id, name) => {
    setSelectedItem({ id, name });
    handleItemClick(id, name, "file");
  };

  const renderSubFolders = (subfolders = [], files = [], level = 0) => {
    return (
      <ul className={styles.subFolderList}>
        {subfolders.map((subfolder) => (
          <li
            key={subfolder.id}
            className={`${styles.folderItem} ${
              selectedItem && selectedItem.id === subfolder.id
                ? styles.selectedItem
                : ""
            }`}
          >
            <div
              className={styles.folderHeader}
              onClick={() =>
                handleItemClick(subfolder.id, subfolder.name, "folder")
              }
              style={{ paddingLeft: `${level * 20}px` }}
            >
              <img
                onClick={() =>
                  setFoldersTab((prevFolders) =>
                    handleFolderRotate(subfolder.id, prevFolders)
                  )
                }
                className={styles.FolderArrowRight}
                style={{
                  transform: `rotate(${subfolder.isOpen ? "90deg" : "0deg"})`
                }}
                src={arrowRightSvg}
                alt="arrow-down"
              />
              <img src={subfolder.icon} alt="folder" />
              <span>{subfolder.name}</span>
              <button
                className={styles.tabsDots}
                onClick={(e) => handleContextMenu(e, subfolder.id, "folder")}
              >
                <img src={dotsSvg} alt="_pic" />
              </button>
            </div>
            {subfolder.isOpen &&
              renderSubFolders(
                subfolder.subfolders,
                subfolder.files,
                level + 1
              )}
          </li>
        ))}
        {files.map((file) => (
          <li
            key={file.id}
            className={`${styles.folderItem} ${
              selectedItem && selectedItem.id === file.id
                ? styles.selectedItem
                : ""
            }`}
            style={{ paddingLeft: `${level * 20}px` }}
          >
            <div
              className={styles.fileHeader}
              onClick={() => handleFileClick(file.id, file.name)}
            >
              <img src={file.icon} alt="file" />
              {isRenaming && selectedItem && selectedItem.id === file.id ? (
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={() => setIsRenaming(false)}
                  autoFocus
                />
              ) : (
                <span>{file.name}</span>
              )}
              <button
                className={styles.tabsDots}
                onClick={(e) => handleContextMenu(e, file.id, "file")}
              >
                <img src={dotsSvg} alt="_pic" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={styles.fileViewWrapper}>
      <div className={styles.folderWrapper}>
        {foldersTab.map((folder) => (
          <div key={folder.id} className={styles.folderItems}>
            <div
              className={`${styles.folderHeader} ${
                selectedItem && selectedItem.id === folder.id
                  ? styles.selectedItem
                  : ""
              }`}
              onClick={() => handleItemClick(folder.id, folder.name, "folder")}
              style={{ paddingLeft: "0px" }}
            >
              <img
                onClick={() =>
                  setFoldersTab((prevFolders) =>
                    handleFolderRotate(folder.id, prevFolders)
                  )
                }
                className={styles.FolderArrowRight}
                style={{
                  transform: `rotate(${folder.isOpen ? "90deg" : "0deg"})`
                }}
                src={arrowRightSvg}
                alt="arrow-down"
              />
              <img src={folder.icon} alt="folder" />
              <span>{folder.name}</span>
              <button
                className={styles.tabsDots}
                onClick={(e) => handleContextMenu(e, folder.id, "folder")}
              >
                <img src={dotsSvg} alt="_pic" />
              </button>
            </div>
            {folder.isOpen &&
              renderSubFolders(folder.subfolders, folder.files, 1)}
          </div>
        ))}
      </div>
      {contextMenu.visible && (
        <div
          ref={contextMenuRef}
          className={styles.contextMenu}
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          {contextMenu.type === "folder" ? (
            <MenuForFolder handleContextMenuClick={handleContextMenuClick} />
          ) : (
            <MenuForFiles handleContextMenuClick={handleContextMenuClick} />
          )}
        </div>
      )}
    </div>
  );
};

export default FileView;
