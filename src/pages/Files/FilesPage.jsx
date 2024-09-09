import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  addFolder,
  removeFolder,
  updateFolderName,
  loadFoldersFromAPI
} from "../../core/store/foldersSlice";
import { Upload, Button, Modal, Input } from "antd";
import { UploadOutlined, MoreOutlined } from "@ant-design/icons";
import folderIcon from "../../assets/images/icons/common/folder.svg";
import fileIcon from "../../assets/images/icons/common/file.svg";
import commonStyles from "../../assets/styles/commonStyles/common.module.scss";
import MenuForFolder from "../Files/FilesView/menu/MenuForFolder";
import { addFolderToAPI } from "../Files/api/index";

const FilesPage = () => {
  const dispatch = useDispatch();
  const folders = useSelector((state) => state.folders.folders);
  const userId = useSelector((state) => state.user.user?.id);
  const token = useSelector((state) => state.user.token);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([{ id: null, name: "Files" }]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0
  });
  const [folderToRename, setFolderToRename] = useState(null);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [newFolderModalVisible, setNewFolderModalVisible] = useState(false);
  const [folderNameInput, setFolderNameInput] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const menuRef = useRef(null);

  useEffect(() => {
    if (token) {
      dispatch(loadFoldersFromAPI(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  // Рекурсивная функция для поиска текущей папки
  const findCurrentFolder = (folderList, folderId) => {
    for (const folder of folderList) {
      if (folder.id === folderId) {
        return folder;
      }
      if (folder.subfolders && folder.subfolders.length > 0) {
        const found = findCurrentFolder(folder.subfolders, folderId);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const renderFolders = (folders) => {
    return folders.map((folder) => (
      <div key={folder.id}>
        <div onClick={() => handleFolderClick(folder)}>
          <img src={folderIcon} alt={folder.name} />
          <span>{folder.name}</span>
        </div>
      </div>
    ));
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
    setNewFolderModalVisible(true);
  };

  const handleCreateNewFolder = async () => {
    try {
      // Создание папки через API
      const parentId = currentFolderId ? currentFolderId : null;
      const newFolder = await addFolderToAPI(folderNameInput, parentId, userId);

      // Проверим, что папка создана
      if (!newFolder) {
        throw new Error("Ошибка при создании папки");
      }

      // Убедимся, что subfolders всегда массив
      newFolder.subfolders = newFolder.subfolders || [];

      // Добавляем папку в Redux store
      if (currentFolderId === null) {
        // Добавление папки в корень
        dispatch(addFolder({ parentId: null, folder: newFolder }));
      } else {
        const currentFolder = findCurrentFolder(folders, currentFolderId);

        // Проверяем, существует ли текущая папка и имеет ли она массив subfolders
        if (currentFolder && Array.isArray(currentFolder.subfolders)) {
          dispatch(
            addFolder({ parentId: currentFolder.id, folder: newFolder })
          );
        } else {
          console.error("Текущая папка не найдена или структура некорректна");
        }
      }

      // Закрытие модального окна
      setNewFolderModalVisible(false);

      // Сброс инпута
      setFolderNameInput("");

      // Вызов тостера
      toast.success("Folder created successfully!");
    } catch (error) {
      // Обработка ошибки и отображение тостера
      console.error("Error creating folder:", error);
      toast.error("Error creating folder.");
    }
  };

  const currentFolder =
    currentFolderId === null
      ? folders
      : findCurrentFolder(folders, currentFolderId)?.subfolders || [];

  // const handleFileUpload = (file) => {
  //   console.log("File uploaded:", file);
  //   return false;
  // };

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
          {/* <Upload beforeUpload={handleFileUpload} showUploadList={false}> */}
          <Upload showUploadList={false}>
            <Button icon={<UploadOutlined />}>Upload File</Button>
          </Upload>
        </div>
      </div>

      {/* Отображение названия папки или корневого каталога */}
      <div className={commonStyles.folderTitleContainer}>
        {currentFolderId === null ? (
          <h1 className={commonStyles.folderTitle}>Files</h1>
        ) : (
          <div className={commonStyles.folder__titleWithMenu}>
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
          ref={menuRef} // Добавляем ref для меню
          className={commonStyles.contextMenuContainer}
          style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
        >
          <MenuForFolder handleContextMenuClick={handleContextMenuClick} />
        </div>
      )}

      {/* Модальное окно для переименования папки */}
      <Modal
        title="Rename Folder"
        open={renameModalVisible}
        onOk={handleRename}
        onCancel={() => setRenameModalVisible(false)}
      >
        <Input
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="Enter new folder name"
        />
      </Modal>

      {/* Модальное окно для создания новой папки */}
      <Modal
        title="Create New Folder"
        open={newFolderModalVisible}
        onOk={handleCreateNewFolder}
        onCancel={() => setNewFolderModalVisible(false)}
      >
        <Input
          value={folderNameInput}
          onChange={(e) => setFolderNameInput(e.target.value)}
          placeholder="Enter folder name"
        />
      </Modal>

      {/* Отображение содержимого текущей папки */}
      <div className={commonStyles.files__grid}>
        {renderFolders(currentFolder)}
      </div>
    </div>
  );
};

export default FilesPage;
