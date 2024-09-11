import React, { useState, useEffect, useRef } from "react";
import styles from "./ProfilePage.module.scss";
import Chat from "../../components/Chat/ui/Chat";
import commonStyles from "../../assets/styles/commonStyles/common.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { uploadAvatar, updateUsername, changePassword } from "./api";
import profileImg from "../../assets/images/common/illustration.jpg";
import { toast } from "react-hot-toast";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [username, setUsername] = useState(user?.username || "");
  const [initialUsername, setInitialUsername] = useState(user?.username || "")
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatar64 || profileImg);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAvatarChanged, setIsAvatarChanged] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?.name) {
      setUsername(user.name);
      setInitialUsername(user.name)
    }
    if (user?.avatar64) {
      setAvatar(user.avatar64);
    }
  }, [user]);

  useEffect(() => {
    setPasswordsMatch(newPassword1 === newPassword2 && newPassword1 !== "" && newPassword2 !== "");
  }, [newPassword1, newPassword2]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword1 || !newPassword2) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (!passwordsMatch) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      await changePassword(oldPassword, newPassword1, newPassword2,);
      setOldPassword("");
      setNewPassword1("");
      setNewPassword2("");
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

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
  const getAvatarSrc = (avatar64) => {
    if (avatar64 && avatar64.startsWith('data:image/')) {
      return avatar64;
    }
    if (avatar64) {
      return `data:image/png;base64,${avatar64}`;
    }
    return profileImg;
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


  const handleSaveUsername = async () => {
    if (username !== initialUsername) {
      try {
        await updateUsername(username, dispatch);
      } catch (error) {
        console.error("Error updating username:", error);
      }
    }
  };
  return (
    <div className={commonStyles.sectionWrapper}>
      <div className={styles.profilePage}>
        <h2>Profile Settings</h2>
        <form  >
          <div className={styles.avatarSection}>
            <div className={styles.avatarContainer}>
              <img src={getAvatarSrc(avatar)} alt="Avatar" className={styles.avatarImage} />
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
              {username !== initialUsername && (
                <button
                  type="button"
                  onClick={handleSaveUsername}
                  className={styles.changeButton}
                >
                  Save Username
                </button>
              )}
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
                value={newPassword1}
                onChange={(e) => setNewPassword1(e.target.value)}
                className={styles.inputField}
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
                className={styles.inputField}
              />
            </div>
            {passwordsMatch && (
              <button onClick={handlePasswordChange} type="submit" className={styles.changeButton}>
                Save New password
              </button>
            )}
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
