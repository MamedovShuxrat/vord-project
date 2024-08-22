import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sendMessage, fetchMessages, selectChat } from "../../../core/store/chatSlice";

import styles from "./chat.module.scss";
import HeaderStyles from "../../Header/header.module.scss";

import arrowLeftSvg from "../../../assets/images/icons/chat/arrow-left.svg";
import userAvatarImg from "../../../assets/images/icons/common/user-avatar.svg";
import filesBtnSvg from "../../../assets/images/icons/chat/files-btn.svg";
import messageBtnSvg from "../../../assets/images/icons/chat/send-message.svg";
import chatMessageSvg from "../../../assets/images/icons/chat/chat.svg";
import chatInfoSvg from "../../../assets/images/icons/chat/chat-purple.svg";


const ChatComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const messages = useSelector((state) => state.chat.messages);
  const selectedChatId = useSelector((state) => state.chat.selectedChatId);

  const [inputValue, setInputValue] = useState("");
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    if (selectedChatId) {
      // Загружаем сообщения для выбранного чата
      dispatch(fetchMessages({ chatId: selectedChatId }));
    }
  }, [selectedChatId, dispatch]);

  const isOpenChat = () => {
    setIsOpened(!isOpened);
  };

  const fileInput = useRef(null);

  const handleFileClick = () => {
    fileInput.current.click();
  };

  const handleFileInputChange = (event) => {
    // const files = event.target.files;
    // Можно обработать файлы тут, если нужно.
  };

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      dispatch(sendMessage({ chatId: selectedChatId, message: inputValue }));
      setInputValue("");
    }
  };

  return (
    <div className={styles.chatWrapper}>
      <div className={styles.chat}>
        <div className={styles.chatHeader}>
          <div onClick={isOpenChat} className={styles.chatNameWrapper}>
            <span className={styles.chatName}>Chat</span>
            <img width={20} height={20} src={chatMessageSvg} alt="chat svg" />
          </div>
          <div onClick={isOpenChat} className={styles.chatNotifyWrapper}>
            <img width={20} height={20} src={chatInfoSvg} alt="chat svg" />
            <span className={styles.chatNotify}>{messages.length}</span>
          </div>
        </div>
      </div>
      {isOpened && (
        <div className={styles.chatContent}>
          <div className={styles.chatUserBlock}>
            <img
              onClick={() => setIsOpened(false)}
              style={{ cursor: "pointer" }}
              src={arrowLeftSvg}
              alt="arrow-left"
            />
            <div className={HeaderStyles.user}>
              <div className={styles.chatBg}>
                <img
                  width={15}
                  height={18}
                  src={userAvatarImg}
                  alt="user avatar"
                />
              </div>
              {user && user.email && (
                <p className={HeaderStyles.userName}>{user.email}</p>
              )}
            </div>
          </div>
          <div className={styles.chatMessageBlock}>
            {messages.map((message, index) => (
              <div className={styles.chatUserMessageWrapper} key={index}>
                <div className={HeaderStyles.user}>
                  <div
                    className={`${HeaderStyles.user__avatar} ${styles.chatBg}`}
                  >
                    <img
                      width={15}
                      height={18}
                      src={userAvatarImg}
                      alt="user avatar"
                    />
                  </div>
                </div>
                <span className={styles.chatUserMessage}>{message}</span>
              </div>
            ))}
          </div>
          <div className={styles.chatTextBlock}>
            <button className={styles.chatFilesBtn} onClick={handleFileClick}>
              <input
                type="file"
                ref={fileInput}
                style={{ display: "none" }}
                onChange={handleFileInputChange}
              />
              <img src={filesBtnSvg} alt="files btn" />
            </button>
            <input
              className={styles.chatInput}
              type="text"
              placeholder="Введите сообщение"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
            />
            <button
              className={`${styles.chatSendBtn} ${inputValue.trim() !== "" ? "" : styles.chatBtnInactive}`}
              onClick={handleSendMessage}
              disabled={inputValue.trim() === ""}
            >
              <img src={messageBtnSvg} alt="send message btn" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


const Chat = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const chats = useSelector((state) => state.chat.chats) || []; // Устанавливаем значение по умолчанию, если chats нет
  const selectedChatId = useSelector((state) => state.chat.selectedChatId);

  const [isOpened, setIsOpened] = useState(false);

  const isOpenChat = () => {
    setIsOpened(!isOpened);
  };

  const handleChatSelect = (chatId) => {
    dispatch(selectChat(chatId));
  };

  return (
    <div className={styles.chatWrapper}>
      <div className={styles.chat}>
        <div className={styles.chatHeader}>
          <div onClick={isOpenChat} className={styles.chatNameWrapper}>
            <span className={styles.chatName}>Chats</span>
          </div>
        </div>
      </div>

      {isOpened && (
        <div className={styles.chatTabs}>
          {chats.length > 0 ? (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`${styles.chatTab} ${selectedChatId === chat.id ? styles.activeTab : ""}`}
                onClick={() => handleChatSelect(chat.id)}
              >
                {/* Устанавливаем новый заголовок для каждого чата */}
                Chat with {chat.owner.email}
              </div>
            ))
          ) : (
            <div>No chats available</div> // Сообщение, если чатов нет
          )}
        </div>
      )}

      {selectedChatId && (
        <div className={styles.chatContent}>
          <div className={styles.chatUserBlock}>
            <div className={HeaderStyles.user}>
              <div className={styles.chatBg}>
                <img
                  width={15}
                  height={18}
                  src={userAvatarImg}
                  alt="user avatar"
                />
              </div>
              <p className={HeaderStyles.userName}>
                Chat with {chats.find(chat => chat.id === selectedChatId)?.owner.email}
              </p>
            </div>
          </div>

          <ChatComponent selectedChatId={selectedChatId} />
        </div>
      )}
    </div>
  );
};

export default Chat;