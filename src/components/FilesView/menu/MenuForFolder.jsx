import React from "react";
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
    </div>
  );
};

export default MenuForFolder;
