import React from "react";
import useSearch from "../utils/useSearch";
import styles from "./searchBlock.module.scss";
import { toast } from "react-hot-toast";

import filterSvg from "../../assets/images/icons/common/filter.svg";
import plusSvg from "../../assets/images/icons/common/plus.svg";

const SearchBlock = ({ onSearch, onFilter, placeholder, addNewTab }) => {
  const { searchTerm, handleSearchChange } = useSearch(onSearch);
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
        onChange={event => handleSearchChange(event, onSearch)}
        placeholder={placeholder}
      />
      <button className={styles.searchFilterBtn} onClick={onFilter}>
        <img src={filterSvg} alt="filter icon" />
      </button>
      <button className={styles.searchPlusBtn} onClick={handleAddNewTab}>
        <img width={12} height={12} src={plusSvg} alt="plus icon" />
      </button>
    </div>
  );
};

export default SearchBlock;
