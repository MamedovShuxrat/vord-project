import React, { useState } from 'react'
import styles from './connection.module.scss'
import SearchBlock from '../../components/searchBlock/SearchBlock';
import Chat from '../../components/chat/Chat';

const Connections = () => {
    const [activeTab, setActiveTabs] = useState(null)
    const onSelectTabsItem = (id) => {
        setActiveTabs(id)
    }
    const connectionTabs = [
        {
            id: 'magazine1',
            img: './icons/connection/database-red.svg',
            MySQL: 'Magazine',
            w: '20px',
            h: '20px'
        },

        {
            id: 'home2',
            img: './icons/connection/database-green.svg',
            MySQL: 'Home',
            w: '20px',
            h: '20px'
        },

        {
            id: 'untilted3',
            img: './icons/connection/database-black.svg',
            MySQL: 'Untilted',
            w: '20px',
            h: '20px'
        },
    ]
    return (
        <div className={styles.connections} >
            <div className="searchContent">
                <div className={styles.searchBlock}>
                    <SearchBlock placeholder='Search Connection' />
                    <div className={styles.tabsWrapper}>
                        {connectionTabs.map((item) => <div key={item.id}
                            onClick={() => onSelectTabsItem(item.id)}
                            className={`${styles.tabsItem} ${activeTab === item.id ? styles.active : ''}`}>
                            <img width={item.w} height={item.h} src={item.img} alt={`${item.MySQL}_pic`} />
                            <span className={styles.tabsName}>MySQL: {item.MySQL}</span>
                            <button className={styles.tabsDots}>
                                <img src='./icons/connection/dots_three.svg' alt={`${item.MySQL}_pic`} />
                            </button>
                        </div>)}
                    </div>
                </div>
            </div>
            <div className={styles.mainContent}>
                <div className={styles.tabsTopBlock}>
                    <div className={styles.tabsTopBlockWrapper}>
                        <button className={styles.tabsLeft}>
                            <img src='./icons/connection/arrow.svg' alt='arrow-pic' />
                        </button>
                        <div className={styles.tabsTopWrapper}>
                            {connectionTabs.map((item) => <div key={item.id}
                                onClick={() => onSelectTabsItem(item.id)}
                                className={`${styles.tabsTopItem} ${activeTab === item.id ? styles.active : ''}`}>
                                <span className={`${styles.tabsName} ${styles.tabsTopName}`}> {item.MySQL}</span>
                                <button className={styles.tabsTopDots}>
                                    <img src='./icons/connection/dots_three.svg' alt={`${item.MySQL}_pic`} />
                                </button>
                            </div>)}
                        </div>
                        <button className={`${styles.tabsLeft} ${styles.tabsRight}`}>
                            <img src='./icons/connection/arrow.svg' alt='arrow-pic' />
                        </button>
                    </div>
                    <div className={styles.chatWrapper}>
                        <Chat />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Connections