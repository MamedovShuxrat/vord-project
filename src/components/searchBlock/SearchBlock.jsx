import React, { useState } from 'react'
import styles from './searchBlock.module.scss';
const SearchBlock = ({ onSearch, onFilter, onAdd, placeholder }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        onSearch(event.target.value);
    };
    return (
        <div className={styles.searchBar}>
            <input
                className={styles.searchInput}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={placeholder}
            />
            <button className={styles.searchFilterBtn} onClick={onFilter}>
                <img src="./icons/connection/filter.svg" alt="plus pic" />
            </button>
            <button className={styles.searchPlusBtn} onClick={onAdd}>
                <img width={12} height={12} src="./icons/connection/plus.svg" alt="plus pic" />
            </button>
        </div>
    )
}

export default SearchBlock