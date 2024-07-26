import React, { useState } from "react";
import SearchBlock from "../../components/SearchBlock/SearchBlock";
import Chat from "../../components/Chat/Chat";
import commonStyles from "../../assets/styles/commonStyles/common.module.scss";

import arrowSvg from "../../assets/images/icons/common/arrow.svg";
import arrowRightSvg from "../../assets/images/icons/common/arrow-right.svg";
import folderSvg from "../../assets/images/icons/common/folder.svg";
import dotsSvg from "../../assets/images/icons/common/dots_three.svg";

const ChartsPage = () => {
  const [folderIconRotate, setFolderIconRotate] = useState("0deg");
  const handleFolderRotate = () => {
    setFolderIconRotate((prevRotate) =>
      prevRotate === "0deg" ? "90deg" : "0deg"
    );
  };

  return (
    <div className={commonStyles.sectionWrapper}>
      <div>
        <div className={commonStyles.searchBlock}>
          <SearchBlock placeholder="Search Charts" />
          <div className={commonStyles.tabsWrapper}>
            <ul className={commonStyles.folderWrapper}>
              <li className={commonStyles.folderItem}>
                <img
                  onClick={handleFolderRotate}
                  className={commonStyles.FolderArrowRight}
                  style={{
                    transform: `rotate(${folderIconRotate})`
                  }}
                  src={arrowRightSvg}
                  alt="arrow-down"
                />
                <img src={folderSvg} alt="folder" />

                <span className> Query: Untitled </span>

                <button className={commonStyles.tabsDots}>
                  <img src={dotsSvg} alt="_pic" />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={commonStyles.sectionMainContent}>
        <div className={commonStyles.tabsTopBlock}>
          <button className={commonStyles.tabsLeft}>
            <img src={arrowSvg} alt="arrow-pic" />
          </button>
          <div className={commonStyles.tabsTopBlockWrapper}>
            <div className={commonStyles.tabsTopWrapper}>
              <div className={commonStyles.tabsTopItem}>
                <span
                  className={`${commonStyles.tabsName} ${commonStyles.tabsTopName}`}
                >
                  {" "}
                  Query
                </span>
                <button className={commonStyles.tabsTopDots}>
                  <img src={dotsSvg} alt={`query_pic`} />
                </button>
              </div>
            </div>
          </div>
          <button className={`${commonStyles.tabsRight}`}>
            <img src={arrowSvg} alt="arrow-pic" />
          </button>
          <div className={commonStyles.chatWrapper}>
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsPage;
