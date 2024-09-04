import React, { useState, useEffect, useRef } from "react";
import styles from "./sharing.module.scss";
import inputStyles from "../ui/Inputs/inputs.module.scss";

import { handleSendData, fetchInvitedUsers, updateUserRole } from "./api";
import { useToggleByID as useToggleByID } from "../utils/useToggleByID";
import { useClickToggle } from "../utils/useClickOutside";

import userAvatarImg from "../../assets/images/icons/common/user-avatar.svg";
import arrowDownSvg from "../../assets/images/icons/shared/iconDown.svg";
import linkSvg from "../../assets/images/icons/shared/link.svg";
import lockSvg from "../../assets/images/icons/shared/lock.svg";
import InvitedUsersLoader from "../utils/InvitedUsersLoader";

const ADDROLE = [
  {
    id: 1,
    name: "Reader",
  },
  {
    id: 3,
    name: "Commentator",
  },
  {
    id: 4,
    name: "Editor",
  },
]


const SharingAccess = () => {
  const ownerData = localStorage.getItem("userData");

  let ownerId = null;
  if (ownerData) {
    try {
      const owner = JSON.parse(ownerData);
      if (owner && owner.pk) {
        ownerId = owner.pk;
      } else {
        console.error("User data is missing the 'pk' property.");
      }
    } catch (error) {
      console.error("Failed to parse user data:", error);
    }
  } else {
    console.error("No user data found in localStorage.");
  }


  const getRoleName = (access) => {
    const role = ADDROLE.find((role) => role.id === access)
    return role ? role.name : "Unknown Role"
  }

  const [invitedUsers, setInvitedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null)
  const [email, setEmail] = useState("")
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [newRole, setNewRole] = useState({});
  const [selectedUserById, setSelectedUserById] = useState(null);
  const [selectedNewRole, setSelectedNewRole] = useState(null)

  useEffect(() => {
    if (ownerId) {
      loadInvitedUsers(ownerId);
    }
  }, [ownerId]);

  const loadInvitedUsers = async (ownerId) => {
    try {
      const users = await fetchInvitedUsers(ownerId);
      setInvitedUsers(users);
    } catch (error) {
      console.error(error.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  }

  const {
    isOpen: userAddRole,
    toggle: closeUserAddBlock,
    ref: userAddRoleRef,
  } = useClickToggle("userAddRole");

  const {
    isOpen: isUserBlockOpen,
    toggle: toggleUserBlock,
    ref: userBlockRef,
  } = useToggleByID();

  const {
    isOpen: isRestrictedBlockOpen,
    toggle: toggleRestrictedBlock,
    ref: restrickedBlockRef,
  } = useClickToggle("isRestrictedBlockOpen");


  const handleCheckboxChange = async (e) => {
    const checked = e.target.checked;
    setIsConfirmed(checked);

    if (checked) {
      await handleSendData(email, role, setIsConfirmed);
    }
    setRole(null)
    setEmail("")
    setIsConfirmed(false)
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailPattern.test(value));
  }

  const handleUpdateRole = async () => {
    try {
      if (!selectedUserById || !selectedNewRole) {
        throw new Error("Please select a user and a role");
      }

      await updateUserRole(selectedUserById, selectedNewRole, ownerId);
    } catch (error) {
      console.error("Error updating user role:", error);
    }

  };

  return (
    <div className={styles.access}>
      <h3 className={styles.accessTitle}>
        <span>File name/</span>Connection/Chart name
      </h3>
      <input
        type="email"
        placeholder="Add user"
        value={email}
        onChange={handleEmailChange}
        required
        className={`${inputStyles.dataBaseInput} ${isEmailValid ? inputStyles.validInput : inputStyles.invalidInput}`}
      />
      <div className={styles.addRole}>
        <div className={styles.addRoleName}>
          <span>Add role</span>
          <img
            style={{
              transform: `rotate(${userAddRole ? "180deg" : "0deg"})`
            }}
            onClick={closeUserAddBlock}
            src={arrowDownSvg}
            alt="Icon-down"
          />
          {role ? (
            <span className={styles.selectedRole}>
              {ADDROLE.find(item => item.id === role)?.name}
            </span>
          ) : (
            <span >Select role</span>
          )}
          {userAddRole && (
            <div className={styles.addRoleDndMenu} ref={userAddRoleRef}>
              {ADDROLE.map((item, key) => (
                <span
                  key={key}
                  className={styles.addRoleDndItem}
                  onClick={() => {
                    setRole(item.id)
                    closeUserAddBlock();
                  }}
                >
                  {item.name}
                </span>
              ))}
            </div>
          )}
        </div>
        <label className={styles.connectCheckBoxWrapper}>
          <input
            type="checkbox"
            name="Confirm"
            className={styles.checkboxInput}
            checked={isConfirmed}
            onChange={handleCheckboxChange}
          />
          <span className={styles.connectTitle}>Confirm</span>
          <span className={styles.iconCheck}></span>
        </label>
      </div>
      <div className={styles.userBlock}>

        <div className={styles.userTitle}> Users who have access</div>
        <div className={styles.usersWrapper}>
          {loading ? ([...Array(5)].map((_, key) => (
            <InvitedUsersLoader key={key} />
          ))
          ) : (
            invitedUsers.map(user => (
              <div key={user.id} className={styles.userItem}>
                <div className={styles.userBg}>
                  <img
                    width={20}
                    height={20}
                    src={user.avatarSrc ? user.avatarSrc : userAvatarImg}
                    alt={`${user.username}'s avatar`}
                  />
                </div>
                <div className={styles.userInfo}>
                  <p className={styles.userName}>{user.username}</p>
                  <p className={styles.userMail}>{user.email}</p>
                </div>
                <div className={styles.addRoleName}>
                  <span className={styles.selectedRole}>
                    {newRole[user.id]
                      ? ADDROLE.find(item => item.id === newRole[user.id])?.name
                      : getRoleName(user.access_type_id)}
                  </span>
                  {isUserBlockOpen[user.id] && (
                    <div className={styles.addRoleDndMenu} ref={userBlockRef}>
                      {ADDROLE.map((item, key) => (
                        <span
                          key={key}
                          className={styles.addRoleDndItem}
                          onClick={() => {
                            setNewRole({ [user.id]: item.id });
                            toggleUserBlock(user.id)
                            setSelectedNewRole(item.id)
                            setSelectedUserById(user.id)
                          }}
                        >
                          {item.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <img
                    style={{
                      transform: `rotate(${isUserBlockOpen[user.id] ? "180deg" : "0deg"})`,
                    }}
                    onClick={() => toggleUserBlock(user.id)}
                    src={arrowDownSvg}
                    alt="Icon-down"
                  />
                </div>
              </div>
            ))
          )}
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
          <button className={styles.accessBtnItem} onClick={handleUpdateRole} >Done</button>
        </div>
      </div>
    </div>
  );


};



export default SharingAccess;
