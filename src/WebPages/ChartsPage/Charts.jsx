import React, { useState } from 'react'
import SearchBlock from '../../components/SearchBlock/SearchBlock'
import Chat from '../../components/Chat/Chat'
import CommonStyles from '../../components/CommonStyles/common.module.scss'

const Charts = () => {
    const [folderIconRotate, setFolderIconRotate] = useState('0deg')
    const handleFolderRotate = () => {
        setFolderIconRotate((prevRotate) => (prevRotate === '0deg' ? '90deg' : '0deg'))
    }
    return (
        <div className={CommonStyles.sectionWrapper} >
            <div >
                <div className={CommonStyles.searchBlock}>
                    <SearchBlock placeholder='Search Charts' />
                    <div className={CommonStyles.tabsWrapper}>
                        <ul className={CommonStyles.folderWrapper} >
                            <li className={CommonStyles.folderItem}>
                                <img onClick={handleFolderRotate}
                                    className={CommonStyles.FolderArrowRight}
                                    style={{ transform: `rotate(${folderIconRotate})` }} src="./icons/files/arrow-right.svg" alt="arrow-down" />
                                <img src="./icons/files/folder.svg" alt="folder" />
                                <span className > Query: Untitled  </span>
                                <button className={CommonStyles.tabsDots}  >
                                    <img src='./icons/connection/dots_three.svg' alt='_pic' />
                                </button>

                            </li>

                        </ul>
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
                            тут список Query
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

export default Charts