import React from "react";
import styles from "../filesView.module.scss";

const MenuForView = ({ handleContextMenuClick }) => {
  return (
    <div className={styles.contextMenuForView}>
      <button
        className={styles.contextMenu__row}
        onClick={() => handleContextMenuClick("closeAllTabs")}
      >
        Close all tabs
      </button>
      <button
        className={styles.contextMenu__row}
        onClick={() => handleContextMenuClick("closeSelectedTab")}
      >
        Close selected tab
      </button>
    </div>
  );
};

export default MenuForView;
