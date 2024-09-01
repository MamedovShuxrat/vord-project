import { useState, useCallback, useEffect, useRef } from "react";

export const useClickToggle = (id, initialValue = false) => {
    const [isOpen, setIsOpen] = useState({ [id]: initialValue });
    const ref = useRef(null);

    const toggle = useCallback(() => {
        setIsOpen((prevState) => ({ ...prevState, [id]: !prevState[id] }));
    }, [id]);

    const close = useCallback(() => {
        setIsOpen((prevState) => ({ ...prevState, [id]: false }));
    }, [id]);

    const handleClickOutside = useCallback((event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsOpen((prevState) => ({ ...prevState, [id]: false }));
        }
    }, [id, ref]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);

    return { isOpen: isOpen[id], toggle, close, ref };
};