import React from "react";
import styles from "../charts.module.scss";

const MenuForQuery = ({ handleContextMenuClick }) => {
  return (
    <div className={styles.contextMenu}>
      <div className={styles.contextMenu__row}>
        <button onClick={() => handleContextMenuClick("duplicate")}>
          Duplicate
        </button>
      </div>
      <div className={styles.contextMenu__row}>
        <button onClick={() => handleContextMenuClick("delete")}>Delete</button>
      </div>
      <div className={styles.contextMenu__row}>
        <button onClick={() => handleContextMenuClick("run")}>Run</button>
      </div>
      <div className={styles.contextMenu__row}>
        <button onClick={() => handleContextMenuClick("clear")}>Clear</button>
      </div>
    </div>
  );
};

export default MenuForQuery;
