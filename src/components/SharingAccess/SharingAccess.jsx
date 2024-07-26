import React, { useState, useRef, useEffect } from "react";
import styles from "./sharing.module.scss";
import checkbox from "../CreateDataBaseCard/createDataBaseCard.module.scss";
import SimpleInput from "../ui/Inputs/SimpleInput";

import userAvatarImg from "../../assets/images/icons/common/user-avatar.svg";
import arrowDownSvg from "../../assets/images/icons/shared/iconDown.svg";
import linkSvg from "../../assets/images/icons/shared/link.svg";
import lockSvg from "../../assets/images/icons/shared/lock.svg";

const SharingAccess = () => {
  const [isUserBlockOpen, setIsUserBlockOpen] = useState(false);
  const [isRestrictedBlockOpen, setIsRestrictedBlockOpen] = useState(false);
  const userBlockRef = useRef(null);
  const restrickedBlockRef = useRef(null);

  const toggleUserBlock = () => {
    setIsUserBlockOpen(!isUserBlockOpen);
    setIsRestrictedBlockOpen(false);
  };

  const toggleRestrictedBlock = () => {
    setIsRestrictedBlockOpen(!isRestrictedBlockOpen);
    setIsUserBlockOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userBlockRef.current &&
        !userBlockRef.current.contains(event.target) &&
        restrickedBlockRef.current &&
        !restrickedBlockRef.current.contains(event.target)
      ) {
        setIsUserBlockOpen(false);
        setIsRestrictedBlockOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.access}>
      <h3 className={styles.accessTitle}>
        <span>File name/</span>Connection/Chart name
      </h3>
      <SimpleInput placeholder="Add user" className="dataBaseInput" />
      <div className={styles.addRole}>
        <div className={styles.addRoleName}>
          <span>Add role</span>
          <img
            style={{
              transform: `rotate(${isUserBlockOpen ? "180deg" : "0deg"})`
            }}
            onClick={toggleUserBlock}
            src={arrowDownSvg}
            alt="Icon-down"
          />
          {isUserBlockOpen && (
            <div className={styles.addRoleDndMenu} ref={userBlockRef}>
              <span className={styles.addRoleDndItem}>Reader</span>
              <span className={styles.addRoleDndItem}>Editor</span>
              <span className={styles.addRoleDndItem}>Commentator</span>
            </div>
          )}
        </div>
        <label
          className={checkbox.connectCheckBoxWrapper}
          htmlFor="connectHost"
        >
          <input
            type="checkbox"
            id="connectConfirm"
            name="Confirm"
            className={checkbox.checkboxInput}
          />
          <span className={checkbox.connectTitle}>Confirm</span>
        </label>
      </div>
      <div className={styles.userBlock}>
        <div className={styles.userTitle}> Users who have access</div>
        <div className={styles.usersWrapper}>
          <div className={styles.userItem}>
            <div className={styles.userBg}>
              <img
                width={20}
                height={20}
                src={userAvatarImg}
                alt="user avatar"
              />
            </div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>John Smith</p>
              <p className={styles.userMail}>johnsmith23@gmail.com</p>
            </div>
            <div className={styles.addRoleName}>
              <span>Owner</span>
            </div>
          </div>
          <div className={styles.userItem}>
            <div className={styles.userBg}>
              <img
                width={20}
                height={20}
                src={userAvatarImg}
                alt="user avatar"
              />
            </div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>John Smith</p>
              <p className={styles.userMail}>johnsmith23@gmail.com</p>
            </div>
            <div className={styles.addRoleName}>
              <span>Owner</span>
            </div>
          </div>
          <div className={styles.userItem}>
            <div className={styles.userBg}>
              <img
                width={20}
                height={20}
                src={userAvatarImg}
                alt="user avatar"
              />
            </div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>John Smith</p>
              <p className={styles.userMail}>johnsmith23@gmail.com</p>
            </div>
            <div className={styles.addRoleName}>
              <span>Owner</span>
            </div>
          </div>
          <div className={styles.userItem}>
            <div className={styles.userBg}>
              <img
                width={20}
                height={20}
                src={userAvatarImg}
                alt="user avatar"
              />
            </div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>John Smith</p>
              <p className={styles.userMail}>johnsmith23@gmail.com</p>
            </div>
            <div className={styles.addRoleName}>
              <span>Owner</span>
            </div>
          </div>
          <div className={styles.userItem}>
            <div className={styles.userBg}>
              <img
                width={20}
                height={20}
                src={userAvatarImg}
                alt="user avatar"
              />
            </div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>John Smith</p>
              <p className={styles.userMail}>johnsmith23@gmail.com</p>
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
            <img src={lockSvg} alt="locked" />
            <span>Access is restricted</span>
            <img
              style={{
                transform: `rotate(${isRestrictedBlockOpen ? "180deg" : "0deg"})`
              }}
              onClick={toggleRestrictedBlock}
              src={arrowDownSvg}
              alt="Icon-down"
            />
            {isRestrictedBlockOpen && (
              <div className={styles.addRoleDndMenu} ref={restrickedBlockRef}>
                <span className={styles.addRoleDndItem}>
                  Access is restricted
                </span>
                <span className={styles.addRoleDndItem}>
                  Everyone who has a link
                </span>
                <span className={styles.addRoleDndItem}>Publish</span>
              </div>
            )}
          </div>
          <div className={styles.addRoleRectrictedinfo}>
            Only users with access can open content from this link
          </div>
        </div>
        <div className={styles.accessBtnWrapper}>
          <button className={styles.accessBtnItem}>
            <img src={linkSvg} alt="link" /> Copy link
          </button>
          <button className={styles.accessBtnItem}>Done</button>
        </div>
      </div>
    </div>
  );
};

export default SharingAccess;
