import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './sidebar.module.scss'
import SidebarItem from './SidebarItem'


const Sidebar = () => {

    const [activeSideItem, setActiveSideItem] = useState(null)

    const onSelectSideItem = (id) => {
        setActiveSideItem(id)
    }

    const dashboardTopMenu = [
        {
            id: 1,
            img: './icons/dashboard/dashboards.svg',
            name: 'Dashboard',
            w: '32px',
            h: '32px'
        },
        {
            id: 2,
            img: './icons/dashboard/connections.svg',
            name: 'Connections',
            w: '26px',
            h: '21px'
        },
        {
            id: 3,
            img: './icons/dashboard/files.svg',
            name: 'Files',
            w: '22px',
            h: '29px'
        },
        {
            id: 4,
            img: './icons/dashboard/charts.svg',
            name: 'Charts',
            w: '32px',
            h: '28px'
        },
        {
            id: 5,
            img: './icons/dashboard/wiki.svg',
            name: 'Wiki',
            w: '28px',
            h: '25px'
        },
    ]

    const dashboardBottomMenu = [
        {
            id: 6,
            img: './icons/dashboard/best_practices.svg',
            name: 'Best Practices',
            w: '28px',
            h: '25px'
        },
        {
            id: 7,
            img: './icons/dashboard/community.svg',
            name: 'Community',
            w: '30px',
            h: '25px'
        }

    ]
    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarTopMenu}>
                {dashboardTopMenu.map((item) =>
                    <Link key={`top_${item.id}`} to={`${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className={styles.sidebarItemWrapper}>
                        <SidebarItem
                            className={activeSideItem === item.id ? styles.active : ''}
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
                    <Link key={`bottom_${item.id}`} to={`${item.name.toLowerCase().replace(/\s+/g, '_')}`}
                        className={styles.sidebarItemWrapper}>
                        <SidebarItem
                            className={activeSideItem === item.id ? styles.active : ''}
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