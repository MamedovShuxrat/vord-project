import React, { useState } from 'react'
import CommonStyles from '../../components/CommonStyles/common.module.scss'
import styles from './ProfilePage.module.scss'

import Chat from '../../components/Chat/Chat'
const ProfilePage = () => {
    const [username, setUsername] = useState('')
    const [useremail, setUseremail] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')

    const handleAvatarChange = () => {
    }

    const handleUsernameChange = () => {
    }

    const handleChangePassword = () => {
    }

    return (
        <div className={CommonStyles.sectionWrapper} >
            <div className={styles.profilePage}>
                <h2>Profile Settings</h2>
                <div className={styles.avatarSection}>
                    <div className={styles.avatarContainer}>
                        <img src="https://via.placeholder.com/150" alt="Avatar" className={styles.avatarImage} />
                        <button onClick={handleAvatarChange} className={styles.changeButton}>Change Avatar</button>
                    </div>
                </div>
                <div className={styles.usernameSection}>
                    <input type="text" placeholder="User name" value={username} onChange={(e) => setUsername(e.target.value)} className={styles.inputField} />
                    <button onClick={handleUsernameChange} className={styles.changeButton}>Edit</button>
                </div>

                <div className={styles.usernameSection}>
                    <input type="text" placeholder="User email" value={useremail} onChange={(e) => setUseremail(e.target.value)} className={styles.inputField} />
                    <button onClick={handleUsernameChange} className={styles.changeButton}>Edit</button>
                </div>

                <div className={styles.passwordSection}>
                    <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className={styles.inputField} />
                    <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={styles.inputField} />
                    <button onClick={handleChangePassword} className={styles.changeButton}>Change Password</button>
                </div>
            </div>
            <div className={CommonStyles.chatWrapper}>
                <Chat />
            </div>
        </div>
    )
}

export default ProfilePage  
