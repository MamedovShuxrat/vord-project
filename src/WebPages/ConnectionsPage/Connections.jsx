import React, { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'

import CommonStyles from '../../components/CommonStyles/common.module.scss'
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
    const [dotsChange, setDotsChange] = useState({})


    const handleDotsChange = (id) => {
        const updatedDotsChange = {};
        Object.keys(dotsChange).forEach(key => {
            updatedDotsChange[key] = false;
        });

        updatedDotsChange[id] = !dotsChange[id];
        setDotsChange(updatedDotsChange);
    }

    const handleRenameSQLTabs = (itemId) => {
        const itemToUpdate = connectionTabs.find(item => item.id === itemId);
        if (itemToUpdate) {
            itemToUpdate.MySQL = prompt("Enter the name of the new MySQL")
            setConnectionTabs([...connectionTabs]);
        }
    }

    const handleDeleteTabs = (itemId) => {
        const updatedTabs = connectionTabs.filter(item => item.id !== itemId);
        setConnectionTabs(updatedTabs);
    };


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

    const addNewSQLTab = (newMySQLValue) => {
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
        <div className={CommonStyles.sectionWrapper} >
            <div >
                <div className={CommonStyles.searchBlock}>
                    <SearchBlock onSearch={handleSearch} placeholder='Search Connection' addNewTab={addNewSQLTab} />
                    <div className={CommonStyles.tabsWrapper}>
                        {connectionTabs
                            .filter(item => item.MySQL.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((item) => (
                                <div key={item.id}
                                    onClick={() => onSelectTabsItem(item.id)}
                                    className={`${CommonStyles.tabsItem} ${activeTab === item.id ? CommonStyles.active : ''}`}
                                >
                                    {renderImageOrIcon(item)}
                                    <span className={CommonStyles.tabsName}>MySQL: {item.MySQL}</span>
                                    <button className={CommonStyles.tabsDots} onClick={() => handleDotsChange(item.id)}>
                                        <img style={{ transform: dotsChange[item.id] ? 'rotate(360deg)' : 'none' }} src='./icons/connection/dots_three.svg' alt={`${item.MySQL}_pic`} />
                                        {dotsChange[item.id] && <div className={CommonStyles.dotsChangeWrapper}>
                                            <span onClick={() => handleRenameSQLTabs(item.id)} className={CommonStyles.dotsChangeRename}>Rename</span>
                                            <span onClick={() => handleDeleteTabs(item.id)} className={CommonStyles.dotsChangeDelete}>Delete </span>
                                        </div>}
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
            <div className={CommonStyles.sectionMainContent}>
                <div className={CommonStyles.tabsTopBlock}>
                    <button className={CommonStyles.tabsLeft} onClick={handleLeftButtonClick}>
                        <img src='./icons/connection/arrow.svg' alt='arrow-pic' />
                    </button>
                    <div className={CommonStyles.tabsTopBlockWrapper}>
                        <div className={CommonStyles.tabsTopWrapper}>
                            {connectionTabs.map((item) => <div key={item.id}
                                onClick={() => onSelectTabsItem(item.id)}
                                className={`${CommonStyles.tabsTopItem} ${activeTab === item.id ? CommonStyles.active : ''}`}>
                                <span className={`${CommonStyles.tabsName} ${CommonStyles.tabsTopName}`}> {item.MySQL}</span>
                                <button className={CommonStyles.tabsTopDots}>
                                    <img src='./icons/connection/dots_three.svg' alt={`${item.MySQL}_pic`} />
                                </button>
                            </div>)}
                        </div>
                    </div>
                    <button className={`${CommonStyles.tabsRight}`} onClick={handleRightButtonClick}>
                        <img src='./icons/connection/arrow.svg' alt='arrow-pic' />
                    </button>
                    <div className={CommonStyles.sectionChatWrapper}>
                        <Chat />
                    </div>
                </div>
                <CreateDataBaseCard />
            </div>
        </div>
    )
}

export default Connections