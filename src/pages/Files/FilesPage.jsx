import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import SearchBlock from "../../components/SearchBlock/SearchBlock";
import Chat from "../../components/Chat/Chat";

import commonStyles from "../../assets/styles/commonStyles/common.module.scss";

import arrowSvg from "../../assets/images/icons/common/arrow.svg";
import arrowRightSvg from "../../assets/images/icons/common/arrow-right.svg";
import dotsSvg from "../../assets/images/icons/common/dots_three.svg";
import folder from "../../assets/images/icons/common/folder.svg";

const FilesPage = () => {
  const [foldersTab, setFoldersTab] = useState([
    {
      id: uuid(),
      name: "Untitled",
      icon: folder,
      isOpen: false,
      subfolder: [
        {
          id: uuid(),
          name: "Untitled2",
          icon: folder,
          isOpen: false,
          subfolders: []
        }
      ]
    },
    {
      id: uuid(),
      name: "Untitled2",
      icon: folder,
      isOpen: false,
      subfolder: [
        {
          id: uuid(),
          name: "Untitled3",
          icon: folder,
          isOpen: false,
          subfolders: [
            {
              id: uuid(),
              name: "Untitled5",
              icon: folder,
              isOpen: false,
              subfolders: []
            },
            {
              id: uuid(),
              name: "Untitled4",
              icon: folder,
              isOpen: false,
              subfolders: []
            }
          ]
        }
      ]
    }
  ]);
  const [activeTab, setActiveTabs] = useState(null);
  const onSelectTabsItem = (id) => {
    setActiveTabs(id);
  };

  const handleFolderRotate = (folderID) => {
    setFoldersTab((prevFolder) =>
      prevFolder.map((folder) => {
        if (folder.id === folderID) {
          return { ...folder, isOpen: !folder.isOpen };
        }

        if (folder.subfolder.length > 0) {
          return {
            ...folder,
            subfolder: folder.subfolder.map((subfolder) => ({
              ...subfolder,
              isOpen: !folder.isOpen
            }))
          };
        }

        return folder;
      })
    );
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
          <SearchBlock placeholder="Search Files" />
          <div className={commonStyles.tabsWrapper}>
            <div className={commonStyles.folderWrapper}>
              {foldersTab.map((folder) => (
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
            </div>
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
              {foldersTab.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectTabsItem(item.id)}
                  className={`${commonStyles.tabsTopItem} ${activeTab === item.id ? commonStyles.active : ""}`}
                >
                  <span
                    className={`${commonStyles.tabsName} ${commonStyles.tabsTopName}`}
                  >
                    {" "}
                    {item.name}
                  </span>
                  <button className={commonStyles.tabsTopDots}>
                    <img src={dotsSvg} alt={`${item.name}_pic`} />
                  </button>
                </div>
              ))}
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

export default FilesPage;
