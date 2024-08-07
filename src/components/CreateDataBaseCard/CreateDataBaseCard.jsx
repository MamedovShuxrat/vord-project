import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./createDataBaseCard.module.scss";
import SimpleInput from "../ui/Inputs/SimpleInput";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://81.200.151.85:8000/api/clientdb/";

const CreateDataBaseCard = ({ formData, onFormDataChange }) => {
  const [localFormData, setLocalFormData] = useState(formData);
  const [dbType, setDbType] = useState(formData.dbType || "");
  const [isDataSaved, setIsDataSaved] = useState(false);

  useEffect(() => {
    console.log("CreateDataBaseCard rendered with formData:", formData);
    setLocalFormData(formData);
    setDbType(formData.dbType || "");
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...localFormData, [name]: value };
    setLocalFormData(updatedFormData);
    console.log(`handleChange called with name: ${name}, value: ${value}`);
    onFormDataChange(updatedFormData);
  };

  const handleDbTypeChange = (e) => {
    const value = e.target.value;
    setDbType(value);
    handleChange(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, localFormData);
      setIsDataSaved(true);
      toast.success("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data");
    }
  };

  return (
    <div className={styles.CardWrapper}>
      <form onSubmit={handleSubmit} className={styles.formData}>
        <SimpleInput
          placeholder="User"
          name="user"
          value={localFormData.user || ""}
          className="dataBaseInput"
          onChange={handleChange}
        />
        <SimpleInput
          placeholder="Password"
          name="password"
          value={localFormData.password || ""}
          className="dataBaseInput"
          onChange={handleChange}
        />
        <SimpleInput
          placeholder="Data Base"
          name="dbName"
          value={localFormData.dbName || ""}
          className="dataBaseInput"
          onChange={handleChange}
        />
        <SimpleInput
          placeholder="Description"
          name="description"
          value={localFormData.description || ""}
          className="dataBaseInput"
          onChange={handleChange}
        />
        <div className={`${styles.selectWrapper} dataBaseInput`}>
          <label htmlFor="dbType" className={styles.selectLabel}>
            Data Base Type
          </label>
          <select
            id="dbType"
            name="dbType"
            value={dbType}
            className={styles.selectInput}
            onChange={handleDbTypeChange}
          >
            <option value="">Select Database Type</option>
            <option value="MySQL">MySQL</option>
          </select>
        </div>
        {dbType === "MySQL" && (
          <SimpleInput
            placeholder="URL"
            name="url"
            value={localFormData.url || ""}
            className="dataBaseInput"
            onChange={handleChange}
          />
        )}
        <span className={styles.formDataDescr}>
          Connections between VARD and your database will be encrypted
        </span>
        <button
          type="submit"
          className={`${styles.formDataBtn} ${styles.formDataBtnBlue}`}
        >
          Connect
        </button>
        {isDataSaved && (
          <p className={styles.successMessage}>Данные сохранены</p>
        )}
      </form>
    </div>
  );
};

CreateDataBaseCard.propTypes = {
  formData: PropTypes.shape({
    user: PropTypes.string,
    password: PropTypes.string,
    dbType: PropTypes.string,
    dbName: PropTypes.string,
    description: PropTypes.string,
    url: PropTypes.string
  }).isRequired,
  onFormDataChange: PropTypes.func.isRequired
};

export default CreateDataBaseCard;
