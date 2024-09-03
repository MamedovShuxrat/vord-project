import { useState, useCallback, useEffect, useRef } from "react";

export const useToggleByID = (initialValue = false) => {
    const [isOpen, setIsOpen] = useState({});
    const ref = useRef(null);

    const toggle = useCallback((id) => {
        setIsOpen((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    }, []);

    const close = useCallback((id) => {
        setIsOpen((prevState) => ({
            ...prevState,
            [id]: false,
        }));
    }, []);

    const handleClickOutside = useCallback((event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsOpen({});
        }
    }, []);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);

    return { isOpen, toggle, close, ref };
};

