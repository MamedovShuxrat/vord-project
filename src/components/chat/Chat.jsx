import React from 'react'
import styles from './chat.module.scss'

const Chat = () => {
    return (
        <div className={styles.chat}>
            <div className="chatHeader">
                <div className={styles.chatNameWrapper}>
                    <span>Chat</span>
                    <img width={20} height={20} src="./icons/chat/chat.svg" alt="chat svg" />
                </div>
            </div>
        </div>
    )
}

export default Chat