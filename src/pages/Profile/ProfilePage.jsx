import React, { useState, useEffect, useRef } from "react";
import styles from "./ProfilePage.module.scss";
import Chat from "../../components/Chat/ui/Chat";
import commonStyles from "../../assets/styles/commonStyles/common.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { uploadAvatar } from "./api";
import profileImg from "../../assets/images/common/illustration.jpg";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [username, setUsername] = useState(user?.username || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatar, setAvatar] = useState(user?.avatarUrl || profileImg);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAvatarChanged, setIsAvatarChanged] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?.name) {
      setUsername(user.name);
    }
    if (user?.avatar) {
      setAvatar(user.avatar);
    }
  }, [user]);
  console.log(user);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        setIsAvatarChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = async () => {
    if (selectedFile) {
      try {
        await uploadAvatar(selectedFile, setAvatar, dispatch);
        setIsAvatarChanged(false);
      } catch (error) {
        console.error(error)
      }
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
  };


  console.log(avatar);

  return (
    <div className={commonStyles.sectionWrapper}>
      <div className={styles.profilePage}>
        <h2>Profile Settings</h2>
        <form  >
          <div className={styles.avatarSection}>
            <div className={styles.avatarContainer}>
              <img src={avatar} alt="Avatar" className={styles.avatarImage} />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
              />
              {!isAvatarChanged ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className={styles.changeButton}
                >
                  Change Avatar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveAvatar}
                  className={styles.changeButton}
                >
                  Save Avatar
                </button>
              )}
            </div>
            <div className={styles.usernameSection}>
              <input
                type="text"
                placeholder="User name"
                value={username}
                onChange={handleUsernameChange}
                className={styles.inputField}
              />
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
            </div>
            <button type="submit" className={styles.changeButton}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
      <div className={commonStyles.chatWrapper}>
        <Chat />
      </div>
    </div>
  );
};

export default ProfilePage;
