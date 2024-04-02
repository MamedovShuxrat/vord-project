import React from 'react'
import CommonStyles from '../../components/CommonStyles/common.module.scss'
import SearchBlock from '../../components/SearchBlock/SearchBlock'
import Chat from '../../components/Chat/Chat'

const Dashboard = () => {
    return (
        <div className={CommonStyles.sectionWrapper} >
            <div className={CommonStyles.sectionMainContent}>
                <div className={CommonStyles.tabsTopBlock}>
                    <div className={CommonStyles.chatWrapper}>
                        <Chat />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard