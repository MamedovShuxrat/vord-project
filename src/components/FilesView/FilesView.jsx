// src/components/FilesView/FilesView.jsx
import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import {
  addFolder,
  addFile,
  toggleFolderOpen,
  removeFile,
  removeFolder,
  updateFileName
} from "../../core/store/foldersSlice";
import { v4 as uuid } from "uuid";
import arrowRightSvg from "../../assets/images/icons/common/arrow-right.svg";
import dotsSvg from "../../assets/images/icons/common/dots_three.svg";
import folderIcon from "../../assets/images/icons/common/folder.svg";
import fileIcon from "../../assets/images/icons/common/file.svg";
import styles from "./filesView.module.scss";
import MenuForFolder from "./menu/MenuForFolder";
import MenuForFiles from "./menu/MenuForFiles";
import toast from "react-hot-toast";

const FileView = ({ foldersTab, handleItemClick, removeTab }) => {
  const dispatch = useDispatch();
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

  const handleFolderRotate = (folderID) => {
    dispatch(toggleFolderOpen({ folderId: folderID }));
  };

  const handleAddFolder = (parentId) => {
    const newFolder = {
      id: uuid(),
      name: `New Folder`,
      icon: folderIcon,
      isOpen: false,
      subfolders: [],
      files: []
    };
    dispatch(addFolder({ parentId, folder: newFolder }));
    toast.success("Папка добавлена успешно");
  };

  const handleAddFile = (parentId) => {
    const newFile = {
      id: uuid(),
      name: `New File`,
      icon: fileIcon
    };
    dispatch(addFile({ parentId, file: newFile }));
    toast.success("Файл добавлен успешно");
  };

  const handleDeleteFolder = (id) => {
    dispatch(removeFolder({ folderId: id }));
    setSelectedItem(null);
    toast.success("Папка удалена успешно");
  };

  const handleDeleteFile = (id) => {
    dispatch(removeFile({ fileId: id }));
    removeTab(id);
  };

  const handleRename = (id, newName) => {
    dispatch(updateFileName({ fileId: id, newName }));
  };

  const handleContextMenuClick = (action) => {
    if (contextMenu.type === "folder") {
      if (action === "addFolder") {
        handleAddFolder(contextMenu.id);
      } else if (action === "addFile") {
        handleAddFile(contextMenu.id);
      } else if (action === "deleteFolder") {
        handleDeleteFolder(contextMenu.id);
      }
    } else if (contextMenu.type === "file") {
      if (action === "rename") {
        setIsRenaming(true);
        setSelectedItem(contextMenu.id);
        setNewName(
          foldersTab
            .flatMap((folder) =>
              folder.files.concat(
                folder.subfolders.flatMap((subfolder) => subfolder.files)
              )
            )
            .find((file) => file.id === contextMenu.id)?.name || ""
        );
      } else if (action === "delete") {
        handleDeleteFile(contextMenu.id);
      }
    }
    setContextMenu({ id: null, type: null, visible: false, x: 0, y: 0 });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && isRenaming && newName.trim()) {
      handleRename(selectedItem, newName);
      setIsRenaming(false);
    }
  };

  const handleFileClick = (id, name) => {
    setSelectedItem(id);
    handleItemClick(id, name, "file");
  };

  const renderSubFolders = (subfolders = [], files = [], level = 0) => {
    return (
      <ul className={styles.subFolderList}>
        {subfolders.map((subfolder) =>
          subfolder ? (
            <li
              key={subfolder.id}
              className={`${styles.folderItem} ${
                selectedItem === subfolder.id ? styles.selectedItem : ""
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
                  onClick={() => handleFolderRotate(subfolder.id)}
                  className={styles.FolderArrowRight}
                  style={{
                    transform: `rotate(${subfolder.isOpen ? "90deg" : "0deg"})`
                  }}
                  src={arrowRightSvg}
                  alt="arrow-down"
                />
                <img src={subfolder.icon} alt="folder" />
                <span className={styles.folderName}>{subfolder.name}</span>
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
          ) : null
        )}
        {files.map((file) =>
          file ? (
            <li
              key={file.id}
              className={`${styles.folderItem} ${
                selectedItem === file.id ? styles.selectedItem : ""
              }`}
              style={{ paddingLeft: `${level * 20}px` }}
            >
              <div
                className={styles.fileHeader}
                onClick={() => handleFileClick(file.id, file.name)}
              >
                <img src={file.icon} alt="file" />
                {isRenaming && selectedItem === file.id ? (
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => setIsRenaming(false)}
                    autoFocus
                  />
                ) : (
                  <span className={styles.fileName}>{file.name}</span>
                )}
                <button
                  className={styles.tabsDots}
                  onClick={(e) => handleContextMenu(e, file.id, "file")}
                >
                  <img src={dotsSvg} alt="_pic" />
                </button>
              </div>
            </li>
          ) : null
        )}
      </ul>
    );
  };

  return (
    <div className={styles.fileViewWrapper}>
      <div className={styles.folderWrapper}>
        {foldersTab.map((folder) =>
          folder ? (
            <div key={folder.id} className={styles.folderItems}>
              <div
                className={`${styles.folderHeader} ${
                  selectedItem === folder.id ? styles.selectedItem : ""
                }`}
                onClick={() =>
                  handleItemClick(folder.id, folder.name, "folder")
                }
              >
                <img
                  onClick={() => handleFolderRotate(folder.id)}
                  className={styles.FolderArrowRight}
                  style={{
                    transform: `rotate(${folder.isOpen ? "90deg" : "0deg"})`
                  }}
                  src={arrowRightSvg}
                  alt="arrow-down"
                />
                <img src={folder.icon} alt="folder" />
                <span className={styles.folderName}>{folder.name}</span>
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
          ) : null
        )}
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

FileView.propTypes = {
  foldersTab: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      isOpen: PropTypes.bool,
      subfolders: PropTypes.array,
      files: PropTypes.array
    })
  ).isRequired,
  handleItemClick: PropTypes.func.isRequired,
  removeTab: PropTypes.func.isRequired
};

export default FileView;
