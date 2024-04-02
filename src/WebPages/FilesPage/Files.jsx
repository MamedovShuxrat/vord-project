import React, { useState } from 'react'
import { v4 as uuid } from 'uuid'
import SearchBlock from '../../components/SearchBlock/SearchBlock'
import Chat from '../../components/Chat/Chat'
import CommonStyles from '../../components/CommonStyles/common.module.scss'

const Files = () => {
  const [foldersTab, setFoldersTab] = useState([
    {
      id: uuid(),
      name: 'Untitled',
      icon: './icons/files/folder.svg',
      isOpen: false,
      subfolders: []
    },
    {
      id: uuid(),
      name: 'Untitled2',
      icon: './icons/files/folder.svg',
      isOpen: false,
      subfolders: [{
        id: uuid(),
        name: 'Untitled3',
        icon: './icons/files/folder.svg',
        isOpen: false,
        subfolders: [{
          id: uuid(),
          name: 'Untitled4',
          icon: './icons/files/folder.svg',
          isOpen: false,
          subfolders: [{
            id: uuid(),
            name: 'Untitled5',
            icon: './icons/files/folder.svg',
            isOpen: false,
            subfolders: []
          },]
        },]
      },]
    },
  ]);


  // const handleFolderRotate = (folderID) => {
  //   setFoldersTab(prevFolder => prevFolder.map(folder => {
  //     if (folder.id === folderID) {
  //       return { ...folder, isOpen: !folder.isOpen }
  //     }
  //     return folder
  //   }))
  // }
  const handleFolderRotate = (folderID) => {
    setFoldersTab((prevFolder) =>
      prevFolder.map((folder) => {
        if (folder.id === folderID) {
          return { ...folder, isOpen: !folder.isOpen };
        }

        if (folder.subfolders.length > 0) {
          return {
            ...folder,
            subfolders: folder.subfolders.map((subfolder) => ({
              ...subfolder,
              isOpen: !folder.isOpen,
            })),
          };
        }

        return folder;
      })
    );
  };

  const renderSubFolders = (subfolders) => {
    return subfolders.map((subfolder) => (
      <li key={subfolder.id} className={CommonStyles.folderItem}>
        <img
          onClick={() => handleFolderRotate(subfolder.id)}
          className={CommonStyles.FolderArrowRight}
          style={{ transform: `rotate(${subfolder.isOpen ? '90deg' : '0deg'})` }}
          src="./icons/files/arrow-right.svg"
          alt="arrow-down"
        />
        <img src={subfolder.icon} alt="folder" />
        <span>{subfolder.name}</span>
        <button className={CommonStyles.tabsDots}>
          <img src="./icons/connection/dots_three.svg" alt="_pic" />
        </button>
        {subfolder.isOpen && renderSubFolders(subfolder.subfolders)}
      </li>
    ));
  };

  return (
    <div className={CommonStyles.sectionWrapper} >
      <div >
        <div className={CommonStyles.searchBlock}>
          <SearchBlock placeholder='Search Files' />
          <div className={CommonStyles.tabsWrapper}>
            <div className={CommonStyles.folderWrapper}>
              {foldersTab.map(folder => (
                <div className={CommonStyles.folderItems}>
                  <div key={folder.id} className={CommonStyles.folderItem}>
                    <img onClick={() => handleFolderRotate(folder.id)} className={CommonStyles.FolderArrowRight} style={{ transform: `rotate(${folder.isOpen ? '90deg' : '0deg'})` }} src="./icons/files/arrow-right.svg" alt="arrow-down" />
                    <img src={folder.icon} alt="folder" />
                    <span>{folder.name}</span>
                    <button className={CommonStyles.tabsDots}>
                      <img src='./icons/connection/dots_three.svg' alt='_pic' />
                    </button>
                  </div>
                  {folder.isOpen && (
                    <div className={CommonStyles.folderItem}>
                      {renderSubFolders(folder.subfolders)}
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={CommonStyles.sectionMainContent}>
        <div className={CommonStyles.tabsTopBlock}>
          <button className={CommonStyles.tabsLeft} >
            <img src='./icons/connection/arrow.svg' alt='arrow-pic' />
          </button>
          <div className={CommonStyles.tabsTopBlockWrapper}>
            <div className={CommonStyles.tabsTopWrapper}>
              тут список папок
            </div>
          </div>
          <button className={`${CommonStyles.tabsRight}`} >
            <img src='./icons/connection/arrow.svg' alt='arrow-pic' />
          </button>
          <div className={CommonStyles.chatWrapper}>
            <Chat />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Files