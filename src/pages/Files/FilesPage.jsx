// src/pages/FilesPage.js
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
  FileOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import commonStyles from "../../assets/styles/commonStyles/common.module.scss";
import MenuForFolder from "../Files/FilesView/menu/MenuForFolder";
import { findFolderById } from "../../core/helpers/findFolderById";
import Chat from "../../components/Chat/ui/Chat";
import {
  addFolderToAPI,
  addFileToAPI,
  fetchFilesForFolder,
  deleteFolderFromAPI,
  updateFolderName as updateFolderAPI,
  deleteFileFromAPI
} from "../Files/api/index";

const FilesPage = () => {
  const dispatch = useDispatch();
  const folders = useSelector((state) => state.folders.folders);
  const userId = useSelector((state) => state.user.user?.id);
  const token = useSelector((state) => state.user.token);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([{ id: null }]);
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

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const folderId = currentFolderId === null ? "" : currentFolderId;
        const filesData = await fetchFilesForFolder(folderId, token);
        setFilesByFolder((prevFiles) => ({
          ...prevFiles,
          [folderId]: filesData
        }));
      } catch (error) {
        console.error("Ошибка при загрузке файлов:", error);
      }
    };

    if (token) {
      fetchFiles();
    }
  }, [currentFolderId, token]);

  const handleContextMenuClick = (action, folder) => {
    if (!folder || !folder.id) {
      console.error("Папка не найдена для выполнения действия.");
      return;
    }

    if (action === "renameFolder") {
      setFolderToRename(folder);
      setRenameModalVisible(true);
    } else if (action === "deleteFolder") {
      handleDeleteFolder(folder.id);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      await deleteFolderFromAPI(folderId, token);
      dispatch(removeFolder({ folderId }));
      toast.success("Folder deleted successfully");

      if (currentFolderId === folderId) {
        setCurrentFolderId(null);
        setBreadcrumb([{ id: null }]);
      }
    } catch (error) {
      console.error("Ошибка при удалении папки:", error);
      toast.error("Error deleting folder");
    }
  };

  const handleRenameFolder = async () => {
    if (!folderToRename || !folderToRename.id) {
      console.error("Нет папки для переименования");
      return;
    }

    try {
      await updateFolderAPI(folderToRename.id, newFolderName, token);

      dispatch(
        updateFolderName({
          folderId: folderToRename.id,
          newName: newFolderName
        })
      );

      setFolderToRename(null);
      setRenameModalVisible(false);
      setNewFolderName("");
      toast.success("Folder renamed successfully");
    } catch (error) {
      console.error("Ошибка при переименовании папки:", error);
      toast.error("Error renaming folder");
    }
  };

  const renderFolders = (foldersList) => {
    return foldersList.map((folder) => (
      <div key={folder.id}>
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

  const renderFiles = (currentFolderId) => {
    const folderId = currentFolderId === null ? "" : currentFolderId;
    const files = filesByFolder[folderId] || [];

    return files.map((file) => (
      <div key={file.id} className={commonStyles.files__fileItem}>
        <div className={commonStyles.fileItem__container}>
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
          <DeleteOutlined
            className={commonStyles.deleteIcon}
            onClick={() => handleDeleteFile(file.id)}
          />
        </div>
      </div>
    ));
  };

  const renderContent = (currentFolderId) => {
    let subfolders = [];
    const folderId = currentFolderId === null ? "" : currentFolderId;
    const files = filesByFolder[folderId] || [];

    if (currentFolderId === null) {
      subfolders = folders.filter((folder) => folder.parent === null);
    } else {
      const currentFolder = findFolderById(folders, currentFolderId);
      subfolders = currentFolder?.subfolders || [];
    }

    if (subfolders.length === 0 && files.length === 0) {
      return <div>No files available</div>;
    }

    return (
      <>
        {renderFolders(subfolders)}
        {renderFiles(currentFolderId)}
      </>
    );
  };

  const handleFolderClick = (folder) => {
    setCurrentFolderId(folder.id);
    setBreadcrumb((prev) => {
      const newBreadcrumb = [...prev];
      const index = newBreadcrumb.findIndex((item) => item.id === folder.id);
      if (index !== -1) {
        return newBreadcrumb.slice(0, index + 1);
      } else {
        return [...newBreadcrumb, { id: folder.id, name: folder.name }];
      }
    });
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
      const parentId =
        currentFolderId !== null && currentFolderId !== undefined
          ? currentFolderId
          : null;
      const newFolder = await addFolderToAPI(
        folderNameInput,
        parentId,
        userId,
        token
      );

      if (!newFolder) {
        throw new Error("Ошибка при создании папки");
      }

      newFolder.subfolders = newFolder.subfolders || [];
      dispatch(addFolder({ parentId: parentId, folder: newFolder }));

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
      const fileData = { file, name: file.name };
      const uploadedFile = await addFileToAPI(
        fileData,
        currentFolderId,
        userId,
        token
      );
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

  const handleDeleteFile = async (fileId) => {
    try {
      await deleteFileFromAPI(fileId, token);

      setFilesByFolder((prevFiles) => {
        const folderId = currentFolderId === null ? "" : currentFolderId;
        const updatedFiles = prevFiles[folderId]?.filter(
          (file) => file.id !== fileId
        );
        return {
          ...prevFiles,
          [folderId]: updatedFiles
        };
      });
      toast.success("File deleted successfully");
    } catch (error) {
      console.error("Ошибка при удалении файла:", error);
      toast.error("Error deleting file");
    }
  };

  return (
    <div className={commonStyles.sectionWrapper}>
      <div className={commonStyles.files__page}>
        <div className={commonStyles.files__header}>
          <div className={commonStyles.breadcrumb}>
            {breadcrumb.map((item, index) => {
              const folderName =
                item.id === null
                  ? "Files"
                  : findFolderById(folders, item.id)?.name || "Unknown";

              return (
                <span key={item.id}>
                  <span
                    className={commonStyles.breadcrumbLink}
                    onClick={() => handleBreadcrumbClick(item)}
                  >
                    {folderName}
                  </span>
                  {index < breadcrumb.length - 1 && " / "}
                </span>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "24px"
            }}
          >
            <div className={commonStyles.folderTitleContainer}>
              {currentFolderId === null ? (
                <h1 className={commonStyles.folderTitle}>Files</h1>
              ) : (
                <div className={commonStyles.folder__titleWithMenu}>
                  <h1 className={commonStyles.folderTitle}>
                    {findFolderById(folders, currentFolderId)?.name ||
                      "Unknown"}
                  </h1>
                  <MoreOutlined
                    className={commonStyles.folderMenuIcon}
                    onClick={() => {
                      setMenuVisible(true);
                    }}
                  />
                </div>
              )}
            </div>
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

        {menuVisible && (
          <div ref={menuRef} className={commonStyles.contextMenuContainer}>
            <MenuForFolder
              handleContextMenuClick={(action) =>
                handleContextMenuClick(
                  action,
                  folders.find((f) => f.id === currentFolderId)
                )
              }
            />
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
          {renderContent(currentFolderId)}
        </div>
      </div>
      <div className={commonStyles.sectionChatWrapper}>
        <Chat />
      </div>
    </div>
  );
};

export default FilesPage;
