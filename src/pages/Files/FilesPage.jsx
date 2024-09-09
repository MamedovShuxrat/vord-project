import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addFolder,
  removeFolder,
  updateFolderName
} from "../../core/store/foldersSlice";
import { v4 as uuid } from "uuid";
import { Upload, Button, Modal, Input } from "antd";
import { UploadOutlined, MoreOutlined } from "@ant-design/icons";
import folderIcon from "../../assets/images/icons/common/folder.svg";
import fileIcon from "../../assets/images/icons/common/file.svg";
import commonStyles from "../../assets/styles/commonStyles/common.module.scss";
import MenuForFolder from "../Files/FilesView/menu/MenuForFolder";

const FilesPage = () => {
  const dispatch = useDispatch();
  const folders = useSelector((state) => state.folders.folders);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([{ id: null, name: "Files" }]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0
  });
  const [folderToRename, setFolderToRename] = useState(null);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // Рекурсивная функция для поиска текущей папки
  const findCurrentFolder = (folderList, folderId) => {
    for (const folder of folderList) {
      if (folder.id === folderId) {
        return folder;
      }
      if (folder.subfolders.length > 0) {
        const found = findCurrentFolder(folder.subfolders, folderId);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const handleFolderClick = (folder) => {
    setCurrentFolderId(folder.id);
    setBreadcrumb((prev) => [...prev, { id: folder.id, name: folder.name }]);
  };

  const handleBreadcrumbClick = (breadcrumbItem) => {
    setCurrentFolderId(breadcrumbItem.id);
    const index = breadcrumb.findIndex((item) => item.id === breadcrumbItem.id);
    setBreadcrumb(breadcrumb.slice(0, index + 1));
  };

  const addNewFolder = () => {
    const newFolder = {
      id: uuid(),
      name: "New Folder",
      icon: folderIcon,
      subfolders: [],
      files: []
    };

    if (currentFolderId === null) {
      dispatch(addFolder({ parentId: null, folder: newFolder }));
    } else {
      const currentFolder = findCurrentFolder(folders, currentFolderId);
      if (currentFolder) {
        dispatch(addFolder({ parentId: currentFolder.id, folder: newFolder }));
      }
    }
  };

  const currentFolder =
    currentFolderId === null
      ? folders
      : findCurrentFolder(folders, currentFolderId)?.subfolders || [];

  const handleFileUpload = (file) => {
    console.log("File uploaded:", file);
    return false;
  };

  // Контекстное меню для папок
  const handleContextMenuClick = (action) => {
    if (action === "renameFolder") {
      setRenameModalVisible(true);
      setNewFolderName(breadcrumb[breadcrumb.length - 1].name);
      setFolderToRename(breadcrumb[breadcrumb.length - 1].id);
    } else if (action === "deleteFolder") {
      const folderId = breadcrumb[breadcrumb.length - 1].id;
      dispatch(removeFolder({ folderId }));
      setBreadcrumb(breadcrumb.slice(0, -1));
      setCurrentFolderId(breadcrumb[breadcrumb.length - 2]?.id || null);
    }
    setMenuVisible(false);
  };

  const handleMenuClick = (event) => {
    event.stopPropagation();
    const rect = event.target.getBoundingClientRect();
    setContextMenuPosition({ x: rect.right, y: rect.top });
    setMenuVisible(true);
  };

  const handleRename = () => {
    if (folderToRename) {
      dispatch(
        updateFolderName({ folderId: folderToRename, newName: newFolderName })
      );
      setBreadcrumb((prevBreadcrumb) =>
        prevBreadcrumb.map((item) =>
          item.id === folderToRename ? { ...item, name: newFolderName } : item
        )
      );
    }
    setRenameModalVisible(false);
    setFolderToRename(null);
  };

  return (
    <div className={commonStyles.files__page}>
      <div className={commonStyles.files__header}>
        <div className={commonStyles.breadcrumb}>
          {breadcrumb.map((item, index) => (
            <span key={item.id}>
              <span
                className={commonStyles.breadcrumbLink}
                onClick={() => handleBreadcrumbClick(item)}
              >
                {item.name}
              </span>
              {index < breadcrumb.length - 1 && " / "}
            </span>
          ))}
        </div>

        <div className={commonStyles.files__actions}>
          <button
            className={commonStyles.addFolderButton}
            onClick={addNewFolder}
          >
            + Add Folder
          </button>

          <Upload beforeUpload={handleFileUpload} showUploadList={false}>
            <Button icon={<UploadOutlined />}>Upload File</Button>
          </Upload>
        </div>
      </div>

      {/* Отображение названия папки или корневого каталога */}
      <div className={commonStyles.folderTitleContainer}>
        {currentFolderId === null ? (
          <h1 className={commonStyles.folderTitle}>Files</h1>
        ) : (
          <div className={commonStyles.folderTitleWithMenu}>
            <h1 className={commonStyles.folderTitle}>
              {breadcrumb[breadcrumb.length - 1].name}
            </h1>
            <MoreOutlined
              className={commonStyles.folderMenuIcon}
              onClick={handleMenuClick}
            />
          </div>
        )}
      </div>

      {/* Контекстное меню для папки */}
      {menuVisible && (
        <div
          className={commonStyles.contextMenuContainer}
          style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
        >
          <MenuForFolder handleContextMenuClick={handleContextMenuClick} />
        </div>
      )}

      {/* Модальное окно для переименования папки */}
      <Modal
        title="Rename Folder"
        visible={renameModalVisible}
        onOk={handleRename}
        onCancel={() => setRenameModalVisible(false)}
      >
        <Input
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="Enter new folder name"
        />
      </Modal>

      {/* Отображение содержимого текущей папки */}
      <div className={commonStyles.files__grid}>
        {currentFolder.map((item) => (
          <div
            key={item.id}
            className={commonStyles.files__fileItem}
            onClick={() => handleFolderClick(item)}
          >
            <img src={item.icon || fileIcon} alt={item.name} />
            <div className={commonStyles.fileName}>{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilesPage;
