import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addFolder, openFolder } from "../../core/store/foldersSlice";
import { v4 as uuid } from "uuid";
import folderIcon from "../../assets/images/icons/common/folder.svg";
import fileIcon from "../../assets/images/icons/common/file.svg";
import commonStyles from "../../assets/styles/commonStyles/common.module.scss";

const FilesPage = () => {
  const dispatch = useDispatch();
  const folders = useSelector((state) => state.folders.folders);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([{ id: null, name: "Files" }]);

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
    dispatch(addFolder({ parentId: currentFolderId, folder: newFolder }));
  };

  const currentFolder =
    currentFolderId === null
      ? folders
      : folders.find((folder) => folder.id === currentFolderId)?.subfolders ||
        [];

  return (
    <div className={commonStyles.filesPage}>
      <div className={commonStyles.filesHeader}>
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

        <div className={commonStyles.filesHeader}>
          <button
            className={commonStyles.addFolderButton}
            onClick={addNewFolder}
          >
            + Add Folder
          </button>
        </div>
      </div>

      <div className={commonStyles.filesGrid} style={{ height: "100vh" }}>
        {currentFolder.map((item) => (
          <div
            key={item.id}
            className={commonStyles.fileItem}
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
