import React from "react";
import styles from "./sidebar.module.scss";
import classNames from "classnames";

const SidebarItem = ({ children, className, onClick }) => {
  return (
    <div
      className={classNames(styles.sidebarItem, className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default SidebarItem;
