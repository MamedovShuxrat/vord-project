import React, { useState } from 'react'
import styles from './sharing.module.scss'
import checkbox from '../CreateDataBaseCard/createDataBaseCard.module.scss'
import SimpleInput from '../Inputs/SimpleInput';

const SharingAccess = () => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className={styles.access}>
            <h3 className={styles.accessTitle}><span>File name/</span>Connection/Chart name</h3>
            <SimpleInput placeholder='Add user' className='dataBaseInput' />
            <div className={styles.addRole}>
                <div className={styles.addRoleName}>
                    <span>Add role</span>
                    <img style={{ transform: `rotate(${isOpen ? '180deg' : '0deg'})` }} onClick={() => setIsOpen(!isOpen)} src="./icons/shared/iconDown.svg" alt="Icon-down" />
                    {isOpen &&
                        <div className={styles.addRoleDndMenu}>
                            <span className={styles.addRoleDndItem} >Reader</span>
                            <span className={styles.addRoleDndItem} >Editor</span>
                            <span className={styles.addRoleDndItem} >Commentator</span>
                        </div>}
                </div>
                <label className={checkbox.connectCheckBoxWrapper} htmlFor="connectHost">
                    <input type="checkbox" id='connectConfirm' name="Confirm" className={checkbox.checkboxInput} />
                    <span className={checkbox.connectTitle}>Confirm</span>
                </label>
            </div>
            <div className={styles.userBlock}>
                <div className={styles.userTitle}> Users who have access</div>
                <div className={styles.usersWrapper}>
                    <div className={styles.userItem}>
                        <div className={styles.userBg}>
                            <img width={20} height={20} src="./icons/user-avatar.svg" alt="user avatar" />
                        </div>
                        <div className={styles.userInfo}>
                            <p className={styles.userName} >John Smith</p>
                            <p className={styles.userMail} >johnsmith23@gmail.com</p>
                        </div>
                        <div className={styles.addRoleName}>
                            <span>Owner</span>
                        </div>
                    </div>
                    <div className={styles.userItem}>
                        <div className={styles.userBg}>
                            <img width={20} height={20} src="./icons/user-avatar.svg" alt="user avatar" />
                        </div>
                        <div className={styles.userInfo}>
                            <p className={styles.userName} >John Smith</p>
                            <p className={styles.userMail} >johnsmith23@gmail.com</p>
                        </div>
                        <div className={styles.addRoleName}>
                            <span>Owner</span>
                        </div>
                    </div>
                    <div className={styles.userItem}>
                        <div className={styles.userBg}>
                            <img width={20} height={20} src="./icons/user-avatar.svg" alt="user avatar" />
                        </div>
                        <div className={styles.userInfo}>
                            <p className={styles.userName} >John Smith</p>
                            <p className={styles.userMail} >johnsmith23@gmail.com</p>
                        </div>
                        <div className={styles.addRoleName}>
                            <span>Owner</span>
                        </div>
                    </div>
                    <div className={styles.userItem}>
                        <div className={styles.userBg}>
                            <img width={20} height={20} src="./icons/user-avatar.svg" alt="user avatar" />
                        </div>
                        <div className={styles.userInfo}>
                            <p className={styles.userName} >John Smith</p>
                            <p className={styles.userMail} >johnsmith23@gmail.com</p>
                        </div>
                        <div className={styles.addRoleName}>
                            <span>Owner</span>
                        </div>
                    </div>
                    <div className={styles.userItem}>
                        <div className={styles.userBg}>
                            <img width={20} height={20} src="./icons/user-avatar.svg" alt="user avatar" />
                        </div>
                        <div className={styles.userInfo}>
                            <p className={styles.userName} >John Smith</p>
                            <p className={styles.userMail} >johnsmith23@gmail.com</p>
                        </div>
                        <div className={styles.addRoleName}>
                            <span>Owner</span>
                        </div>
                    </div>
                </div>

            </div>
            <div className={styles.restrictedBlock}>
                <h4 className={styles.restrictedTitle}>Shared accesss</h4>
                <div className={styles.addRoleRectricted}>
                    <div className={styles.addRoleRectrictedContent}>
                        <img src="./icons/shared/lock.svg" alt="locked" />
                        <span>Access is restricted</span>
                        <img style={{ transform: `rotate(${isOpen ? '180deg' : '0deg'})` }} onClick={() => setIsOpen(!isOpen)} src="./icons/shared/iconDown.svg" alt="Icon-down" />
                        {isOpen &&
                            <div className={styles.addRoleDndMenu}>
                                <span className={styles.addRoleDndItem} >Access is restricted</span>
                                <span className={styles.addRoleDndItem} >Everyone who has a link</span>
                                <span className={styles.addRoleDndItem} >Publish</span>
                            </div>}
                    </div>
                    <div className={styles.addRoleRectrictedinfo}>
                        Only users with access can open
                        content from this link
                    </div>
                </div>
                <div className={styles.accessBtnWrapper}>
                    <button className={styles.accessBtnItem}>
                        <img src="./icons/shared/link.svg" alt="link" /> Copy link</button>
                    <button className={styles.accessBtnItem}>Done</button>
                </div>
            </div>
        </div >
    )
}

export default SharingAccess