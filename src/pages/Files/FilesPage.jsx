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
import {
  addFolderToAPI,
  addFileToAPI,
  fetchFilesForFolder,
  deleteFolderFromAPI,
  updateFolderName as updateFolderAPI
} from "../Files/api/index";

const FilesPage = () => {
  const dispatch = useDispatch();
  const folders = useSelector((state) => state.folders.folders);
  const userId = useSelector((state) => state.user.user?.id);
  const token = useSelector((state) => state.user.token);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([{ id: null, name: "Files" }]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [folderToRename, setFolderToRename] = useState(null);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [newFolderModalVisible, setNewFolderModalVisible] = useState(false);
  const [folderNameInput, setFolderNameInput] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [filesByFolder, setFilesByFolder] = useState({});

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

  // Загрузка файлов для текущей папки
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        // Если `currentFolderId` равно null, используем пустую строку для корневой папки
        const folderId = currentFolderId === null ? "" : currentFolderId;
        const filesData = await fetchFilesForFolder(folderId, token);
        console.log("Файлы для папки:", folderId, filesData); // Логируем данные для проверки
        setFilesByFolder((prevFiles) => ({
          ...prevFiles,
          [folderId]: filesData // Сохраняем файлы для корневой папки
        }));
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, [currentFolderId, token]);

  // Функция для обработки действий в контекстном меню
  const handleContextMenuClick = (action) => {
    setMenuVisible(false); // Закрываем меню сразу после нажатия на любую кнопку

    if (action === "renameFolder") {
      setRenameModalVisible(true); // Открываем модалку для переименования
    } else if (action === "deleteFolder") {
      handleDeleteFolder(currentFolderId); // Удаляем текущую папку
    }
  };
  // Функция удаления папки
  const handleDeleteFolder = async (folderId) => {
    try {
      await deleteFolderFromAPI(folderId, token); // Удаляем папку с сервера
      dispatch(removeFolder({ folderId })); // Удаляем папку из состояния без необходимости перезагрузки страницы
      toast.success("Folder deleted successfully");

      // Если папка удалена, и она является текущей, вернемся на уровень выше
      if (currentFolderId === folderId) {
        setCurrentFolderId(null); // Переходим в корневую папку после удаления
        setBreadcrumb([{ id: null, name: "Files" }]); // Обновляем "хлебные крошки"
      }
    } catch (error) {
      console.error("Error deleting folder:", error);
      toast.error("Error deleting folder");
    }
  };

  // Функция переименования папки
  const handleRenameFolder = async () => {
    try {
      await updateFolderAPI(folderToRename.id, newFolderName, token);
      dispatch(
        updateFolderName({ id: folderToRename.id, name: newFolderName })
      ); // Обновляем имя папки в состоянии
      setRenameModalVisible(false); // Закрываем модальное окно
      setFolderToRename(null);
      toast.success("Folder renamed successfully");
    } catch (error) {
      console.error("Error renaming folder:", error);
      toast.error("Error renaming folder");
    }
  };

  // Рендер папок
  const renderFolders = (folders) => {
    return folders.map((folder) => (
      <div key={folder.id}>
        {" "}
        {/* Добавляем уникальный ключ */}
        <div
          className={commonStyles.files__fileItem}
          onClick={() => handleFolderClick(folder)}
        >
          <img src={folderIcon} alt={folder.name} />
          <span style={{ textAlign: "center" }}>{folder.name}</span>
        </div>
      </div>
    ));
  };

  // Рендер файлов для текущей папки
  const renderFiles = (currentFolderId) => {
    // Убедись, что folderId корректен (пустая строка для корневой папки)
    const folderId = currentFolderId === null ? "" : currentFolderId;
    const files = filesByFolder[folderId] || [];

    if (files.length === 0) {
      console.log("Нет файлов для рендеринга в папке:", folderId);
      // return (
      //   <div>Нет файлов для рендеринга в папке: {folderId || "Корневая"}</div>
      // );
    }

    return files.map((file) => (
      <div key={file.id} className={commonStyles.files__fileItem}>
        <img
          src={fileIcon}
          alt={file.name}
          className={commonStyles.files__icon}
        />
        <a href={file.download_link} target="_blank" rel="noopener noreferrer">
          {file.name}
        </a>
      </div>
    ));
  };

  // Основная проверка на наличие файлов и папок
  const renderContent = (currentFolderId) => {
    let subfolders = [];
    const files = filesByFolder[currentFolderId] || [];

    // Проверка для корневой папки (Files)
    if (currentFolderId === null) {
      // Фильтруем только папки без родителя
      subfolders = folders.filter((folder) => folder.parent === null);
    } else {
      // Для других папок получаем подпапки
      const currentFolder = folders.find((f) => f.id === currentFolderId) || {};
      subfolders = currentFolder?.subfolders || [];
    }

    // Если нет ни файлов, ни подпапок
    if (subfolders.length === 0 && files.length === 0) {
      return <div>No files available</div>;
    }

    // Рендерим подпапки и файлы
    return (
      <>
        {renderFolders(subfolders)}
        {renderFiles(currentFolderId)}
      </>
    );
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
      const parentId = currentFolderId ? currentFolderId : null;
      const newFolder = await addFolderToAPI(folderNameInput, parentId, userId);

      if (!newFolder) {
        throw new Error("Ошибка при создании папки");
      }

      newFolder.subfolders = newFolder.subfolders || [];
      if (currentFolderId === null) {
        dispatch(addFolder({ parentId: null, folder: newFolder }));
      } else {
        const currentFolder = folders.find((f) => f.id === currentFolderId);
        if (currentFolder && currentFolder.subfolders) {
          dispatch(
            addFolder({ parentId: currentFolder.id, folder: newFolder })
          );
        }
      }

      setNewFolderModalVisible(false);
      setFolderNameInput("");

      toast.success("Folder created successfully!");
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Error creating folder.");
    }
  };

  const handleUpload = async ({ file }) => {
    try {
      const fileData = { file, name: file.name };
      const uploadedFile = await addFileToAPI(
        fileData,
        currentFolderId, // Передаем ID текущей папки
        userId
      );
      setFilesByFolder((prevFiles) => ({
        ...prevFiles,
        [currentFolderId]: [...(prevFiles[currentFolderId] || []), uploadedFile] // Обновляем файлы для текущей папки
      }));
      toast.success("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file");
    }
  };

  const currentFolder =
    currentFolderId === null
      ? folders
      : folders.find((f) => f.id === currentFolderId)?.subfolders || [];

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
          <Upload customRequest={handleUpload} showUploadList={false}>
            <Button icon={<UploadOutlined />}>Upload File</Button>
          </Upload>
        </div>
      </div>
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
              onClick={() => setMenuVisible(true)}
            />
          </div>
        )}
      </div>
      {menuVisible && (
        <div ref={menuRef} className={commonStyles.contextMenuContainer}>
          <MenuForFolder handleContextMenuClick={handleContextMenuClick} />
        </div>
      )}
      <Modal
        title="Rename Folder"
        open={renameModalVisible}
        onOk={handleRenameFolder}
        onCancel={() => setRenameModalVisible(false)}
      >
        <Input
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="Enter new folder name"
        />
      </Modal>
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
      <div className={commonStyles.files__grid}>
        {renderContent(currentFolderId)}{" "}
        {/* Проверяем на наличие файлов и подпапок */}
      </div>
    </div>
  );
};

export default FilesPage;
