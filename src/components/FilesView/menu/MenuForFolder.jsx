// src/components/FilesView/menu/MenuForFolder.jsx
import React from "react";
import PropTypes from "prop-types";
import styles from "../filesView.module.scss";

const MenuForFolder = ({ handleContextMenuClick }) => {
  return (
    <div className={styles.contextMenu}>
      <button
        className={styles.contextMenu__row}
        onClick={() => handleContextMenuClick("addFolder")}
      >
        Add Folder
      </button>
      <button
        className={styles.contextMenu__row}
        onClick={() => handleContextMenuClick("addFile")}
      >
        Add File
      </button>
      <button
        className={styles.contextMenu__row}
        onClick={() => handleContextMenuClick("deleteFolder")}
      >
        Delete Folder
      </button>
    </div>
  );
};

MenuForFolder.propTypes = {
  handleContextMenuClick: PropTypes.func.isRequired
};

export default MenuForFolder;
