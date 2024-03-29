import React, { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'

import styles from './connection.module.scss'
import SearchBlock from '../../components/SearchBlock/SearchBlock'
import Chat from '../../components/Chat/Chat'
import CreateDataBaseCard from '../../components/CreateDataBaseCard/CreateDataBaseCard'
import RandomColorIcon from '../../Elements/CreateDynamicSvgIcon/RandomColorIcon'

const Connections = () => {
    const [connectionTabs, setConnectionTabs] = useState([
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
        }
    ])

    useEffect(() => {
        if (connectionTabs !== null) {
            localStorage.setItem('connectionTabs', JSON.stringify(connectionTabs))
        }
    }, [connectionTabs])

    useEffect(() => {
        const storedConnectionTabs = localStorage.getItem('connectionTabs')
        if (storedConnectionTabs) {
            setConnectionTabs(JSON.parse(storedConnectionTabs))
        }
    }, [])

    const [activeTab, setActiveTabs] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    const handleSearch = (term) => {
        setSearchTerm(term)
    }

    const handleLeftButtonClick = () => {
        const currentIndex = connectionTabs.findIndex(item => item.id === activeTab)
        const newIndex = (currentIndex - 1 + connectionTabs.length) % connectionTabs.length
        const newActiveTabId = connectionTabs[newIndex].id
        setActiveTabs(newActiveTabId)
    }

    const handleRightButtonClick = () => {
        const currentIndex = connectionTabs.findIndex(item => item.id === activeTab)
        const newIndex = (currentIndex + 1) % connectionTabs.length
        const newActiveTabId = connectionTabs[newIndex].id
        setActiveTabs(newActiveTabId)
    }

    const onSelectTabsItem = (id) => {
        setActiveTabs(id)
    }


    const renderImageOrIcon = (item) => {
        const isSvg = item.img.includes('.svg')
        if (isSvg) {
            return <img width={item.w} height={item.h} src={item.img} alt={`${item.MySQL}_pic`} />
        } else {
            return <RandomColorIcon color={item.img} width={item.w} height={item.h} />
        }
    }

    const addNewTab = (newMySQLValue) => {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16)
        const newTab = {
            id: uuid(),
            img: randomColor,
            MySQL: newMySQLValue,
            w: '20px',
            h: '20px'
        }
        setConnectionTabs([...connectionTabs, newTab])
    }

    return (
        <div className={styles.sectionWrapper} >
            <div className={styles.searchContent}>
                <div className={styles.searchBlock}>
                    <SearchBlock onSearch={handleSearch} placeholder='Search Connection' addNewTab={addNewTab} />
                    <div className={styles.tabsWrapper}>
                        {connectionTabs
                            .filter(item => item.MySQL.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((item) => (
                                <div key={item.id}
                                    onClick={() => onSelectTabsItem(item.id)}
                                    className={`${styles.tabsItem} ${activeTab === item.id ? styles.active : ''}`}
                                >
                                    {renderImageOrIcon(item)}
                                    <span className={styles.tabsName}>MySQL: {item.MySQL}</span>
                                    <button className={styles.tabsDots}>
                                        <img src='./icons/connection/dots_three.svg' alt={`${item.MySQL}_pic`} />
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
            <div className={styles.mainContent}>
                <div className={styles.tabsTopBlock}>
                    <button className={styles.tabsLeft} onClick={handleLeftButtonClick}>
                        <img src='./icons/connection/arrow.svg' alt='arrow-pic' />
                    </button>
                    <div className={styles.tabsTopBlockWrapper}>
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
                    </div>
                    <button className={`${styles.tabsRight}`} onClick={handleRightButtonClick}>
                        <img src='./icons/connection/arrow.svg' alt='arrow-pic' />
                    </button>
                    <div className={styles.chatWrapper}>
                        <Chat />
                    </div>
                </div>
                <CreateDataBaseCard />
            </div>
        </div>
    )
}

export default Connections