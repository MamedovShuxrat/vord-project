import React from "react";
import PropTypes from "prop-types";
import rename from "../../../../assets/images/icons/common/rename.svg";
import path from "../../../../assets/images/icons/common/path.svg";
import download from "../../../../assets/images/icons/common/download.svg";
import move from "../../../../assets/images/icons/common/move.svg";
import duplicate from "../../../../assets/images/icons/common/duplicate.svg";
import open from "../../../../assets/images/icons/common/open.svg";
import styles from "../filesView.module.scss";

const MenuForFiles = ({ handleContextMenuClick }) => {
  return (
    <div className={styles.contextMenu}>
      <div className={styles.contextMenu__row}>
        <img src={rename} alt={"rename icon"} />
        <button onClick={() => handleContextMenuClick("rename")}>Rename</button>
      </div>
      <div className={styles.contextMenu__row}>
        <img src={path} alt={"copy path"} />
        <button onClick={() => handleContextMenuClick("copyPath")}>
          Copy Path
        </button>
      </div>
      <div className={styles.contextMenu__row}>
        <img src={download} alt={"download"} />
        <button onClick={() => handleContextMenuClick("download")}>
          Download
        </button>
      </div>
      <div className={styles.contextMenu__row}>
        <img src={move} alt={"move"} />
        <button onClick={() => handleContextMenuClick("move")}>Move</button>
      </div>
      <div className={styles.contextMenu__row}>
        <img src={duplicate} alt={"duplicate"} />
        <button onClick={() => handleContextMenuClick("duplicate")}>
          Duplicate
        </button>
      </div>
      <div className={styles.contextMenu__row}>
        <img src={open} alt={"open in new tab"} />
        <button onClick={() => handleContextMenuClick("openInNewTab")}>
          Open in New Tab
        </button>
      </div>
      <button
        className={styles.contextMenu__row}
        onClick={() => handleContextMenuClick("share")}
      >
        Share
      </button>
      <button
        onClick={() => handleContextMenuClick("delete")}
        className={`${styles.deleteButton} ${styles.contextMenu__row}`}
      >
        Delete
      </button>
    </div>
  );
};

MenuForFiles.propTypes = {
  handleContextMenuClick: PropTypes.func.isRequired
};

export default MenuForFiles;
