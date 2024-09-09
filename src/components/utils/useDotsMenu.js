import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  renameConnection,
  deleteConnection
} from "../../core/store/connectionsSlice.js";
import toast from "react-hot-toast";

export const useDotsMenu = () => {
  const [dotsChange, setDotsChange] = useState({});
  const [editingConnectionId, setEditingConnectionId] = useState(null);
  const [newConnectionName, setNewConnectionName] = useState("");
  const wrapperRef = useRef(null);
  const dispatch = useDispatch();

  const handleRenameSQLTabs = (itemId, currentName) => {
    setEditingConnectionId(itemId);
    setNewConnectionName(currentName);
  };

  const handleSaveRename = (itemId) => {
    if (newConnectionName.trim() !== "") {
      dispatch(
        renameConnection({ id: itemId, newName: newConnectionName.trim() })
      );
      toast.success("Connection renamed successfully!");
    } else {
      toast.error("Connection name cannot be empty.");
    }
    setEditingConnectionId(null); // Сбросить состояние редактирования
  };

  const handleDeleteTabs = (itemId) => {
    dispatch(deleteConnection(itemId));
    toast("MySQL is deleted!", { icon: "🚨" });
  };

  const handleDotsChange = (itemId) => {
    setDotsChange((prevState) => ({
      ...prevState,
      [itemId]: !prevState[itemId]
    }));
  };

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setDotsChange({});
      setEditingConnectionId(null); // Сбросить состояние редактирования при клике вне элемента
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return {
    dotsChange,
    handleRenameSQLTabs,
    handleSaveRename,
    handleDeleteTabs,
    handleDotsChange,
    setNewConnectionName,
    newConnectionName,
    editingConnectionId,
    wrapperRef
  };
};
