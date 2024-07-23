import React, { useState } from "react"
import { Link } from "react-router-dom"
import styles from "./sidebar.module.scss"
import SidebarItem from "./SidebarItem"

import dashboardsSvg from "../../assets/images/icons/sidebar/dashboards.svg"
import connectionSvg from "../../assets/images/icons/sidebar/connections.svg"
import filesSvg from "../../assets/images/icons/sidebar/files.svg"
import chartsSvg from "../../assets/images/icons/sidebar/charts.svg"
import wikiSvg from "../../assets/images/icons/sidebar/wiki.svg"
import bestPracticesSvg from "../../assets/images/icons/sidebar/best_practices.svg"
import communitySvg from "../../assets/images/icons/sidebar/community.svg"



const dashboardTopMenu = [
    {
        id: 1,
        img: dashboardsSvg,
        name: "Dashboard",
        w: "40px",
        h: "40px"
    },
    {
        id: 2,
        img: connectionSvg,
        name: "Connections",
        w: "40px",
        h: "40px"
    },
    {
        id: 3,
        img: filesSvg,
        name: "Files",
        w: "40px",
        h: "40px"
    },
    {
        id: 4,
        img: chartsSvg,
        name: "Charts",
        w: "40px",
        h: "40px"
    },
    {
        id: 5,
        img: wikiSvg,
        name: "Wiki",
        w: "40px",
        h: "40px"
    },
]

const dashboardBottomMenu = [
    {
        id: 6,
        img: bestPracticesSvg,
        name: "Best Practices",
        w: "40px",
        h: "40px"
    },
    {
        id: 7,
        img: communitySvg,
        name: "Community",
        w: "40px",
        h: "40px"
    }

]
const Sidebar = () => {

    const [activeSideItem, setActiveSideItem] = useState(null)

    const onSelectSideItem = (id) => {
        setActiveSideItem(id)
    }

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarTopMenu}>
                {dashboardTopMenu.map((item) =>
                    <Link key={`top_${item.id}`} to={`${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className={styles.sidebarItemWrapper}>
                        <SidebarItem
                            className={activeSideItem === item.id ? styles.active : ""}
                            onClick={() => onSelectSideItem(item.id)}>
                            <img
                                width={item.w}
                                height={item.h}
                                src={item.img}
                                alt={`${item.name}_logo`}
                                className={styles.dashboardImg} />
                            <p className={styles.dashboardName}>{item.name}</p>
                        </SidebarItem>
                    </Link>
                )}
            </div>
            <div className={styles.sidebarBottomMenu}>
                {dashboardBottomMenu.map((item) =>
                    <Link key={`bottom_${item.id}`} to={`${item.name.toLowerCase().replace(/\s+/g, "_")}`}
                        className={styles.sidebarItemWrapper}>
                        <SidebarItem
                            className={activeSideItem === item.id ? styles.active : ""}
                            onClick={() => onSelectSideItem(item.id)}>
                            <img
                                width={item.w}
                                height={item.h}
                                src={item.img}
                                alt={`${item.name}_logo`}
                                className={styles.dashboardImg} />
                            <p className={styles.dashboardName}>{item.name}</p>
                        </SidebarItem>
                    </Link>

                )}
                <span className={styles.sidebarVersion}>Vers.: 111.1 </span>
            </div>
        </aside>
    )
}

export default Sidebar