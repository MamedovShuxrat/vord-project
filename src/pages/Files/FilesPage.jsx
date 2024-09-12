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
import {
  UploadOutlined,
  MoreOutlined,
  FolderOutlined,
  FileOutlined
} from "@ant-design/icons";
import folderIcon from "../../assets/images/icons/common/folder.svg";
import fileIcon from "../../assets/images/icons/common/file.svg";
import commonStyles from "../../assets/styles/commonStyles/common.module.scss";
import MenuForFolder from "../Files/FilesView/menu/MenuForFolder";
import Chat from "../../components/Chat/ui/Chat";
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
      console.log("Загружаем папки с токеном:", token);
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
        const folderId = currentFolderId === null ? "" : currentFolderId;
        console.log("Загружаем файлы для папки с ID:", folderId);
        const filesData = await fetchFilesForFolder(folderId, token);
        console.log("Полученные файлы для папки:", folderId, filesData);
        setFilesByFolder((prevFiles) => ({
          ...prevFiles,
          [folderId]: filesData // Сохраняем файлы для папки
        }));
      } catch (error) {
        console.error("Ошибка при загрузке файлов:", error);
      }
    };

    fetchFiles();
  }, [currentFolderId, token]);

  // Обработка контекстного меню (при нажатии на "Rename")
  const handleContextMenuClick = (action, folder) => {
    if (!folder || !folder.id) {
      console.error("Папка не найдена для выполнения действия.");
      return;
    }

    console.log("Действие контекстного меню:", action, "Папка:", folder);

    if (action === "renameFolder") {
      setFolderToRename(folder);
      setRenameModalVisible(true); // Открываем модалку для переименования
    } else if (action === "deleteFolder") {
      handleDeleteFolder(folder.id); // Удаляем папку
    }
  };

  // Функция удаления папки
  const handleDeleteFolder = async (folderId) => {
    try {
      console.log("Удаляем папку с ID:", folderId);
      await deleteFolderFromAPI(folderId, token); // Удаляем папку с сервера
      dispatch(removeFolder({ folderId })); // Удаляем папку из состояния без необходимости перезагрузки страницы
      toast.success("Folder deleted successfully");

      // Если папка удалена, и она является текущей, вернемся на уровень выше
      if (currentFolderId === folderId) {
        setCurrentFolderId(null); // Переходим в корневую папку после удаления
        setBreadcrumb([{ id: null, name: "Files" }]); // Обновляем "хлебные крошки"
      }
    } catch (error) {
      console.error("Ошибка при удалении папки:", error);
      toast.error("Error deleting folder");
    }
  };

  // Функция для переименования папки
  const handleRenameFolder = async () => {
    if (!folderToRename || !folderToRename.id) {
      console.error("Нет папки для переименования");
      return;
    }

    try {
      await updateFolderAPI(folderToRename.id, newFolderName, token);

      // После успешного обновления на сервере, обновляем состояние через Redux
      dispatch(
        updateFolderName({
          folderId: folderToRename.id,
          newName: newFolderName
        })
      );

      // Обновляем отображение в интерфейсе (ререндер компонента)
      const updatedFolders = folders.map((folder) =>
        folder.id === folderToRename.id
          ? { ...folder, name: newFolderName } // Обновляем название папки
          : folder
      );

      // Обновляем состояние
      setFolderToRename(null); // Сбрасываем выбранную папку
      setFilesByFolder((prevFiles) => ({
        ...prevFiles,
        [currentFolderId]: updatedFolders // Обновляем папки в текущей папке
      }));

      setRenameModalVisible(false); // Закрываем модальное окно
      toast.success("Folder renamed successfully");
    } catch (error) {
      console.error("Error renaming folder:", error);
      toast.error("Error renaming folder");
    }
  };

  // Рендер папок
  const renderFolders = (folders) => {
    console.log("Отображаем папки:", folders);
    return folders.map((folder) => (
      <div key={folder.id}>
        {" "}
        {/* Добавляем уникальный ключ */}
        <div
          className={commonStyles.files__fileItem}
          onClick={() => handleFolderClick(folder)}
        >
          <FolderOutlined
            style={{ fontSize: "64px", color: "rgba(207, 170, 229)" }}
          />
          <span>{folder.name}</span>
        </div>
      </div>
    ));
  };

  // Рендер файлов для текущей папки
  const renderFiles = (currentFolderId) => {
    const folderId = currentFolderId === null ? "" : currentFolderId;
    const files = filesByFolder[folderId] || [];

    if (files.length === 0) {
      return <div>No files available: {folderId || "Files"}</div>;
    }

    return files.map((file) => (
      <div key={file.id} className={commonStyles.files__fileItem}>
        <FileOutlined
          style={{ fontSize: "64px", color: "rgba(207, 170, 229)" }}
        />
        <a
          href={file.download_link}
          target="_blank"
          rel="noopener noreferrer"
          title={file.name}
          className={commonStyles.files__name}
        >
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

    console.log(
      "Папки для отображения:",
      subfolders,
      "Файлы для отображения:",
      files
    );

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
    console.log("Открываем папку:", folder);
    setCurrentFolderId(folder.id);
    setBreadcrumb((prev) => [...prev, { id: folder.id, name: folder.name }]);
  };

  const handleBreadcrumbClick = (breadcrumbItem) => {
    console.log("Переход по крошкам:", breadcrumbItem);
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
      console.log(
        "Создаем новую папку с именем:",
        folderNameInput,
        "и parentId:",
        parentId
      );
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
      console.error("Ошибка при создании папки:", error);
      toast.error("Error creating folder.");
    }
  };

  const handleUpload = async ({ file }) => {
    try {
      console.log("Загружаем файл:", file.name);
      const fileData = { file, name: file.name };
      const uploadedFile = await addFileToAPI(
        fileData,
        currentFolderId,
        userId
      );
      console.log("Файл успешно загружен:", uploadedFile);
      setFilesByFolder((prevFiles) => ({
        ...prevFiles,
        [currentFolderId === null ? "" : currentFolderId]: [
          ...(prevFiles[currentFolderId === null ? "" : currentFolderId] || []),
          uploadedFile
        ]
      }));
      toast.success("File uploaded successfully");
    } catch (error) {
      console.error("Ошибка при загрузке файла:", error);
      toast.error("Error uploading file");
    }
  };

  const currentFolder =
    currentFolderId === null
      ? folders
      : folders.find((f) => f.id === currentFolderId)?.subfolders || [];

  return (
    <div className={commonStyles.sectionWrapper}>
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
                onClick={() => {
                  console.log("Открываем меню для папки:", currentFolderId);
                  setMenuVisible(true);
                }}
              />
            </div>
          )}
        </div>
        {menuVisible && (
          <div ref={menuRef} className={commonStyles.contextMenuContainer}>
            <MenuForFolder
              handleContextMenuClick={
                (action) =>
                  handleContextMenuClick(
                    action,
                    folders.find((f) => f.id === currentFolderId)
                  ) // Передаем папку, а не currentFolder
              }
            />
          </div>
        )}
        <Modal
          title="Rename Folder"
          open={renameModalVisible}
          onOk={handleRenameFolder} // Переименовываем папку по нажатию кнопки "Ок"
          onCancel={() => setRenameModalVisible(false)} // Закрываем модальное окно
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
        </div>
      </div>
      <div className={commonStyles.sectionChatWrapper}>
        <Chat />
      </div>
    </div>
  );
};

export default FilesPage;
