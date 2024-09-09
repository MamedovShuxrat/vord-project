import React, { useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import {
  renameConnection,
  updateConnectionOnServer,
  deleteConnection
} from "../../../core/store/connectionsSlice";
import toast from "react-hot-toast";
import commonStyles from "../../../assets/styles/commonStyles/common.module.scss";

const RenameDeleteMenu = ({ itemId, currentName, onCloseMenu }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(currentName);
  const dispatch = useDispatch();

  const handleRenameClick = () => {
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    dispatch(deleteConnection(itemId));
    toast.success("Connection deleted successfully!");
    onCloseMenu(); // Закрыть меню после удаления
  };

  const handleSaveRename = () => {
    const trimmedName = newName.trim();
    if (trimmedName !== "" && trimmedName !== currentName) {
      // Сначала обновляем локальное состояние
      dispatch(renameConnection({ id: itemId, newName: trimmedName }));

      // Отправляем запрос на сервер для обновления соединения
      dispatch(updateConnectionOnServer({ id: itemId, newName: trimmedName }))
        .unwrap()
        .then(() => {
          toast.success("Connection renamed successfully!");
          setIsEditing(false);
          onCloseMenu(); // Закрыть меню после успешного переименования
        })
        .catch((error) => {
          toast.error(`Failed to rename connection: ${error}`);
        });
    } else if (trimmedName === currentName) {
      // Если имя не изменилось, просто закрыть режим редактирования
      setIsEditing(false);
      onCloseMenu();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSaveRename();
    }
  };

  const handleBlur = () => {
    if (isEditing) {
      handleSaveRename();
    }
  };

  return (
    <div className={commonStyles.dotsChangeWrapper}>
      {isEditing ? (
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={handleKeyPress}
          onBlur={handleBlur}
          className={commonStyles.renameInput}
          autoFocus
        />
      ) : (
        <>
          <span
            onClick={handleRenameClick}
            className={commonStyles.dotsChangeRename}
          >
            Rename
          </span>
          <span
            onClick={handleDeleteClick}
            className={commonStyles.dotsChangeDelete}
          >
            Delete
          </span>
        </>
      )}
    </div>
  );
};

export default RenameDeleteMenu;

RenameDeleteMenu.propTypes = {
  itemId: PropTypes.any.isRequired, // Убедитесь, что используете правильный тип данных
  currentName: PropTypes.string.isRequired,
  onCloseMenu: PropTypes.func.isRequired
};
