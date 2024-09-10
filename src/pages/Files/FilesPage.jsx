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
  deleteFolderFromAPI
} from "../Files/api/index";

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
  const [fileList, setFileList] = useState([]);

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
        const filesData = await fetchFilesForFolder(currentFolderId, token);
        setFileList(filesData); // Обновляем список файлов
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, [currentFolderId, token]);

  // Рендер папок
  const renderFolders = (folders) => {
    return folders.map((folder) => (
      <div key={folder.id}>
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

  // Рендер файлов
  const renderFiles = (files) => {
    return files.map((file) => (
      <div key={file.id} className={commonStyles.files__fileItem}>
        <img
          src={fileIcon}
          alt={file.name}
          className={commonStyles.files__icon}
        />
        <span>{file.name}</span>
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
        currentFolderId,
        userId
      );
      setFileList([...fileList, uploadedFile]); // Обновляем список файлов
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
          <MenuForFolder handleContextMenuClick={() => {}} />
        </div>
      )}
      <Modal
        title="Rename Folder"
        open={renameModalVisible}
        onOk={() => setRenameModalVisible(false)}
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
        {renderFolders(currentFolder)} {/* Отображение папок */}
        {renderFiles(fileList)} {/* Отображение файлов */}
      </div>
    </div>
  );
};

export default FilesPage;
