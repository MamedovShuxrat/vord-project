import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { renameConnection, deleteConnection, } from "../../core/store/connectionsSlice.js";
import toast from "react-hot-toast";

export const useDotsMenu = () => {
    const [dotsChange, setDotsChange] = useState({});
    const wrapperRef = useRef(null);
    const dispatch = useDispatch();

    const handleRenameSQLTabs = (itemId) => {
        const newName = prompt("Enter the name of the new MySQL");
        if (newName) {
            dispatch(renameConnection({ id: itemId, newName }));
        }
    };

    const handleDeleteTabs = (itemId) => {
        dispatch(deleteConnection(itemId));
        toast("MySQL is deleted!", { icon: "🚨" });
    };

    const handleDotsChange = (itemId) => {
        setDotsChange((prevState) => ({
            ...prevState,
            [itemId]: !prevState[itemId],
        }));
    };

    const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setDotsChange({});
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
        handleDeleteTabs,
        handleDotsChange,
        wrapperRef,
    };
};
