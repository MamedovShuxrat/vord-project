import React, { useState, useEffect } from "react";
import styles from "./ProfilePage.module.scss";
import Chat from "../../components/Chat/ui/Chat";
import commonStyles from "../../assets/styles/commonStyles/common.module.scss";
import { setUser } from "../../core/store/userSlice"
import profileImg from "../../assets/images/common/illustration.jpg";
import { useDispatch, useSelector } from "react-redux";

const ProfilePage = () => {

  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user);
  const [username, setUsername] = useState(user?.username || "user name");

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user?.username]);

  const [useremail, setUseremail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleAvatarChange = () => { };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
    dispatch(setUser({ ...user, username: e.target.value }))
  };

  const handleChangePassword = () => { };

  return (
    <div className={commonStyles.sectionWrapper}>
      <div className={styles.profilePage}>
        <h2>Profile Settings</h2>
        <div className={styles.avatarSection}>
          <div className={styles.avatarContainer}>
            <img src={profileImg} alt="Avatar" className={styles.avatarImage} />
            <button
              onClick={handleAvatarChange}
              className={styles.changeButton}
            >
              Change Avatar
            </button>
          </div>
        </div>
        <div className={styles.usernameSection}>
          <input
            type="text"
            placeholder={username}
            value={username}
            onChange={handleUsernameChange}
            className={styles.inputField}
          />
          <button
            onClick={handleUsernameChange}
            className={styles.changeButton}
          >
            Edit
          </button>
        </div>

        <div className={styles.usernameSection}>
          <input
            type="text"
            placeholder="User email"
            value={useremail}
            onChange={(e) => setUseremail(e.target.value)}
            className={styles.inputField}
          />
          <button
            onClick={handleUsernameChange}
            className={styles.changeButton}
          >
            Edit
          </button>
        </div>

        <div className={styles.passwordSection}>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className={styles.inputField}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.inputField}
          />
          <button
            onClick={handleChangePassword}
            className={styles.changeButton}
          >
            Change Password
          </button>
        </div>
      </div>
      <div className={commonStyles.chatWrapper}>
        <Chat />
      </div>
    </div>
  );
};

export default ProfilePage;
