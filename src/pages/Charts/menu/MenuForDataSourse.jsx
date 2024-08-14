import React from "react";
import styles from "../charts.module.scss";

const MenuForDataSource = ({ handleContextMenuClick }) => {
  return (
    <div className={styles.contextMenu}>
      <div className={styles.contextMenu__row}>
        <button onClick={() => handleContextMenuClick("addDataset")}>
          Add Dataset
        </button>
      </div>
      <div className={styles.contextMenu__row}>
        <button onClick={() => handleContextMenuClick("addFile")}>
          Add File
        </button>
      </div>
      <div className={styles.contextMenu__row}>
        <button onClick={() => handleContextMenuClick("addQuery")}>
          Add Query
        </button>
      </div>
      <div className={styles.contextMenu__row}>
        <button onClick={() => handleContextMenuClick("addFolder")}>
          Add Folder
        </button>
      </div>
    </div>
  );
};

export default MenuForDataSource;
