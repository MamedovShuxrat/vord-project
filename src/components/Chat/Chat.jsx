import React, { useState, useEffect, useRef } from 'react'
import styles from './chat.module.scss'
import HeaderStyles from '../HeaderComponent/header.module.scss'
const Chat = () => {
    const [isOpened, setIsOpened] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [userMessages, setUserMessages] = useState([])

    useEffect(() => {
        const storedMessages = localStorage.getItem('userMessages')
        if (storedMessages) {
            setUserMessages(JSON.parse(storedMessages))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('userMessages', JSON.stringify(userMessages))
    }, [userMessages])


    const isOpenChat = () => {
        setIsOpened(!isOpened)
    }
    const fileInput = useRef(null)

    const handleFileClick = () => {
        fileInput.current.click()
    }

    const handleFileInputChange = (event) => {
        const files = event.target.files;
    }


    return (
        <div className={styles.chatWrapper}>
            <div className={styles.chat}>
                <div className={styles.chatHeader}>
                    <div onClick={isOpenChat} className={styles.chatNameWrapper}>
                        <span className={styles.chatName}>Chat</span>
                        <img width={20} height={20} src="./icons/chat/chat.svg" alt="chat svg" />
                    </div>
                    <div onClick={isOpenChat} className={styles.chatNotifyWrapper}>
                        <img width={20} height={20} src="./icons/chat/chat-purple.svg" alt="chat svg" />
                        <span className={styles.chatNotify}>{userMessages.length}</span>
                    </div>
                </div>
            </div>
            {isOpened &&
                <div className={styles.chatContent}>
                    <div className={styles.chatUserBlock}>
                        <img onClick={() => setIsOpened(false)} style={{ cursor: 'pointer' }} src="./icons/chat/arrow-left.svg" alt="arrow-left" />
                        <div className={HeaderStyles.user}>
                            <div className={styles.chatBg}  >
                                <img width={15} height={18} src="./icons/user-avatar.svg" alt="user avatar" />
                            </div>
                            <p className={HeaderStyles.userName}>{'user 1'}</p>
                        </div>
                    </div>
                    <div className={styles.chatMessageBlock}>
                        {userMessages.map((message, index) => (
                            <div className={styles.chatUserMessageWrapper} key={index}>
                                <div className={HeaderStyles.user}>
                                    <div className={`${HeaderStyles.user__avatar} ${styles.chatBg}`}>
                                        <img width={15} height={18} src="./icons/user-avatar.svg" alt="user avatar" />
                                    </div>
                                </div>
                                <span className={styles.chatUserMessage}>{message}</span>
                            </div>
                        ))}
                    </div>
                    <div className={styles.chatTextBlock}>
                        <button className={styles.chatFilesBtn} onClick={handleFileClick}>
                            <input type="file" ref={fileInput} style={{ display: 'none' }} onChange={handleFileInputChange} />
                            <img src="./icons/chat/files-btn.svg" alt="files btn" />
                        </button>
                        <input
                            className={styles.chatInput}
                            type="text"
                            placeholder='Text a message...'
                            value={inputValue}
                            onChange={(event) =>
                                setInputValue(event.target.value)
                            }
                        />
                        <button className={`${styles.chatSendBtn} ${inputValue.trim() !== '' ? '' : styles.chatBtnInactive}`}
                            onClick={() => {
                                if (inputValue.trim() !== '') {
                                    setUserMessages([...userMessages, inputValue])
                                    setInputValue('')
                                }
                            }}
                            disabled={inputValue.trim() === ''}>
                            <img src="./icons/chat/send-message.svg" alt="files btn" />
                        </button>
                    </div>
                </div>}
        </div>
    )
}

export default Chat