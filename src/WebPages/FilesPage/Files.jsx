import React from 'react'
import SearchBlock from '../../components/SearchBlock/SearchBlock'
import Chat from '../../components/Chat/Chat'
import styles from '../ConnectionsPage/connection.module.scss'
const Files = () => {
    return (
        <div className={styles.sectionWrapper} >
            <div className={styles.searchContent}>
                <div className={styles.searchBlock}>
                    <SearchBlock placeholder='Search Files' />
                    <div className={styles.tabsWrapper}>
                        тут папки
                    </div>
                </div>

            </div>
            <div className={styles.mainContent}>
                <div className={styles.tabsTopBlock}>
                    <button className={styles.tabsLeft} >
                        <img src='./icons/connection/arrow.svg' alt='arrow-pic' />
                    </button>
                    <div className={styles.tabsTopBlockWrapper}>
                        <div className={styles.tabsTopWrapper}>
                            тут список папок
                        </div>
                    </div>
                    <button className={`${styles.tabsRight}`} >
                        <img src='./icons/connection/arrow.svg' alt='arrow-pic' />
                    </button>
                    <div className={styles.chatWrapper}>
                        <Chat />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Files