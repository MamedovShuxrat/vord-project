import React from "react"
import Chat from "../../components/Chat/Chat"
import commonStyles from "../../assets/styles/commonStyles/common.module.scss"

const DashboardsPage = () => {
    return (
        <div className={commonStyles.sectionWrapper} >
            <div className={commonStyles.sectionMainContent}>
                <div className={commonStyles.tabsTopBlock}>
                    <div className={commonStyles.chatWrapper}>
                        <Chat />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardsPage