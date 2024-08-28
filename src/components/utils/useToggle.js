import { useState, useCallback, useEffect, useRef } from "react";

export const useToggle = (initialValue = false) => {
    const [isOpen, setIsOpen] = useState(initialValue);
    const ref = useRef(null);

    const toggle = useCallback(() => {
        setIsOpen((prevState) => !prevState);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleClickOutside = useCallback((event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            close();
        }
    }, [close]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);

    return { isOpen, toggle, close, ref };
};
