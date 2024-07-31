import React, { useState } from "react";
import SearchBlock from "../../components/SearchBlock/SearchBlock";
import Chat from "../../components/Chat/Chat";
import commonStyles from "../../assets/styles/commonStyles/common.module.scss";
import useSearch from "../../components/utils/useSearch";
import arrowSvg from "../../assets/images/icons/common/arrow.svg";
import arrowRightSvg from "../../assets/images/icons/common/arrow-right.svg";
import { v4 as uuid } from "uuid";

import folder from "../../assets/images/icons/common/folder.svg";
import dotsSvg from "../../assets/images/icons/common/dots_three.svg";

const ChartsPage = () => {
  const [foldersTab, setFoldersTab] = useState([
    {
      id: uuid(),
      name: "charts 1",
      icon: folder,
      isOpen: false,
      subfolder: [
        {
          id: uuid(),
          name: "charts test",
          icon: folder,
          isOpen: false,
          subfolders: []
        }
      ]
    },
    {
      id: uuid(),
      name: "charts 2",
      icon: folder,
      isOpen: false,
      subfolder: [
        {
          id: uuid(),
          name: "charts 3",
          icon: folder,
          isOpen: false,
          subfolders: [
            {
              id: uuid(),
              name: "charts 4",
              icon: folder,
              isOpen: false,
              subfolders: []
            },
            {
              id: uuid(),
              name: "charts 5",
              icon: folder,
              isOpen: false,
              subfolders: []
            }
          ]
        }
      ]
    }
  ]);
  const { searchTerm, setSearchTerm } = useSearch()

  const [folderIconRotate, setFolderIconRotate] = useState("0deg");

  const handleFolderRotate = () => {
    setFolderIconRotate((prevRotate) =>
      prevRotate === "0deg" ? "90deg" : "0deg"
    );
  };
  const handleSearch = (term) => {
    setSearchTerm(term);
  };


  const renderSubFolders = (subfolders) => {
    return subfolders.map((subfolder) => (
      <li
        style={{ margin: "20px" }}
        key={subfolder.id}
        className={commonStyles.folderItem}
      >
        <img
          onClick={() => handleFolderRotate(subfolder.id)}
          className={commonStyles.FolderArrowRight}
          style={{
            transform: `rotate(${subfolder.isOpen ? "90deg" : "0deg"})`
          }}
          src={arrowRightSvg}
          alt="arrow-down"
        />
        <img src={subfolder.icon} alt="folder" />
        <span>{subfolder.name}</span>
        <button className={commonStyles.tabsDots}>
          <img src={dotsSvg} alt="_pic" />
        </button>
        {subfolder.isOpen && renderSubFolders(subfolder.subfolders)}
      </li>
    ));
  };
  return (
    <div className={commonStyles.sectionWrapper}>
      <div>
        <div className={commonStyles.searchBlock}>
          <SearchBlock
            placeholder="Search Charts"
            onSearch={handleSearch} />
          <div className={commonStyles.tabsWrapper}>
            <ul className={commonStyles.folderWrapper}>
              {foldersTab.filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((folder) => (
                <div key={folder.id} className={commonStyles.folderItems}>
                  <div className={commonStyles.folderItem}>
                    <img
                      onClick={() => handleFolderRotate(folder.id)}
                      className={commonStyles.FolderArrowRight}
                      style={{
                        transform: `rotate(${folder.isOpen ? "90deg" : "0deg"})`
                      }}
                      src={arrowRightSvg}
                      alt="arrow-down"
                    />
                    <img src={folder.icon} alt="folder" />
                    <span>{folder.name}</span>
                    <button className={commonStyles.tabsDots}>
                      <img src={dotsSvg} alt="_pic" />
                    </button>
                  </div>
                  {folder.isOpen && (
                    <div className={commonStyles.folderItem}>
                      {renderSubFolders(folder.subfolder)}
                    </div>
                  )}
                </div>
              ))}
              {/* <li className={commonStyles.folderItem}>
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
              </li> */}
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
