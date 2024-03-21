import React, { useState } from 'react'
import styles from './sidebar.module.scss'
import SidebarItem from './SidebarItem'


const Sidebar = () => {

    const [activeSideItem, setActiveSideItem] = useState(null)
    console.log(activeSideItem);
    const onSelectSideItem = (id) => {
        setActiveSideItem(id)
    }


    const dashboardTopMenu = [
        {
            id: 1,
            img: './icons/dashboards.svg',
            name: 'Dashboard',
            w: '32px',
            h: '32px'
        },
        {
            id: 2,
            img: './icons/connections.svg',
            name: 'Connections',
            w: '26px',
            h: '21px'
        },
        {
            id: 3,
            img: './icons/files.svg',
            name: 'Files',
            w: '22px',
            h: '29px'
        },
        {
            id: 4,
            img: './icons/charts.svg',
            name: 'Charts',
            w: '32px',
            h: '28px'
        },
        {
            id: 5,
            img: './icons/wiki.svg',
            name: 'Wiki',
            w: '28px',
            h: '25px'
        },
    ]

    const dashboardBottomMenu = [
        {
            id: 6,
            img: './icons/best_practices.svg',
            name: 'Best Practices',
            w: '28px',
            h: '25px'
        },
        {
            id: 7,
            img: './icons/community.svg',
            name: 'Community',
            w: '30px',
            h: '25px'
        }

    ]
    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebarTopMenu}>
                {dashboardTopMenu.map((item, index) =>
                    <SidebarItem key={`top_${item}_${index}`}
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
                )}
            </div>
            <div className={styles.sidebarBottomMenu}>
                {dashboardBottomMenu.map((item, index) =>
                    <SidebarItem key={`bottom_${item}_${index}`}
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

                )}
                <span className={styles.sidebarVersion}>Vers.: 111.1 </span>
            </div>
        </div>
    )
}

export default Sidebar