import React, { useState } from "react";
import styles from "./searchBlock.module.scss";
import { toast } from "react-hot-toast";

import filterSvg from "../../assets/images/icons/common/filter.svg";
import plusSvg from "../../assets/images/icons/common/plus.svg";

const SearchBlock = ({ onSearch, onFilter, placeholder, addNewTab }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };
  const handleAddNewTab = () => {
    const newMySQLValue = prompt("Enter the name of the new MySQL");
    if (newMySQLValue && newMySQLValue.trim() !== "") {
      addNewTab(newMySQLValue);
      toast.success("New MySQL tab added successfully!");
    } else {
      toast.error("Please enter a non-empty value for the new MySQL name.");
    }
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
        <img src={filterSvg} alt="plus pic" />
      </button>
      <button className={styles.searchPlusBtn} onClick={handleAddNewTab}>
        <img width={12} height={12} src={plusSvg} alt="plus pic" />
      </button>
    </div>
  );
};

export default SearchBlock;
