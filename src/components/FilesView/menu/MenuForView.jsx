import React from "react";
import PropTypes from "prop-types";
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

MenuForView.propTypes = {
  handleContextMenuClick: PropTypes.func.isRequired
};

export default MenuForView;
