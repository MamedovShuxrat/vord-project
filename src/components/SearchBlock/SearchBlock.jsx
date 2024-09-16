import React, { useState } from "react";
import useSearch from "../utils/useSearch";
import styles from "./searchBlock.module.scss";
import { toast } from "react-hot-toast";
import filterSvg from "../../assets/images/icons/common/filter.svg";
import plusSvg from "../../assets/images/icons/common/plus.svg";

const SearchBlock = ({
  onSearch,
  onFilter,
  placeholder,
  addNewTab,
  showAddButton = true,
  fetchConnections
}) => {
  const { searchTerm, handleSearchChange } = useSearch(onSearch);
  const [openTabs, setOpenTabs] = useState([]);
  const [selectedConnection, setSelectedConnection] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [connections, setConnections] = useState([]);
  console.log(openTabs);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddNewTab = async () => {
    if (fetchConnections) {
      const existingConnections = await fetchConnections();

      if (existingConnections && existingConnections.length > 0) {
        setConnections(existingConnections);
        openModal();
      } else {
        toast.error("No connections available.");
      }
    } else {
      const newTabName = prompt("Enter the name of the new tab:");
      if (newTabName && newTabName.trim() !== "") {
        if (!openTabs.includes(newTabName)) {
          setOpenTabs([...openTabs, newTabName]);
          addNewTab(newTabName);
          toast.success("New tab added successfully!");
        } else {
          toast.error("This tab already exists.");
        }
      } else {
        toast.error("Please enter a non-empty value.");
      }
    }
  };

  const Modal = ({ isOpen, onClose, connections, onAddTab }) => {
    return isOpen ? (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2>Select Connection</h2>
          <select
            className={styles.searchInputToast}
            value={selectedConnection}
            onChange={(e) => setSelectedConnection(e.target.value)}
          >
            <option value="">Select Connection</option>
            {connections.map((connection) => (
              <option key={connection} value={connection}>
                {`Connection name: ${connection}`}
              </option>
            ))}
          </select>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              className={styles.toastBtnAccess}
              onClick={() => {
                if (selectedConnection && !openTabs.includes(selectedConnection)) {
                  onAddTab(`Connection_name: ${selectedConnection}`);
                  setOpenTabs([...openTabs, selectedConnection]);
                  closeModal();
                  toast.success(`Added a new tab for charts: ${selectedConnection}`);
                } else {
                  toast.error("This tab already exists or invalid.");
                }
              }}
            >
              Add Tab
            </button>
            <button className={styles.toastBtnCancel} onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    ) : null;
  };

  return (
    <div className={styles.searchBar}>
      <input
        className={styles.searchInput}
        type="text"
        value={searchTerm}
        onChange={(event) => handleSearchChange(event, onSearch)}
        placeholder={placeholder}
      />
      <button className={styles.searchFilterBtn} onClick={onFilter}>
        <img src={filterSvg} alt="filter icon" />
      </button>
      {showAddButton && (
        <button className={styles.searchPlusBtn} onClick={handleAddNewTab}>
          <img width={12} height={12} src={plusSvg} alt="plus icon" />
        </button>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        connections={connections}
        onAddTab={(connection) => {
          addNewTab(connection);
        }}
      />
    </div>
  );
};

export default SearchBlock;
