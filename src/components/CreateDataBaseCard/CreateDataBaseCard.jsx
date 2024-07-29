import React, { useEffect, useState } from "react";

import styles from "./createDataBaseCard.module.scss";
import SimpleInput from "../ui/Inputs/SimpleInput";

const CreateDataBaseCard = ({ formData, onFormDataChange }) => {
  const [localFormData, setLocalFormData] = useState(formData);

  useEffect(() => {
    console.log("CreateDataBaseCard rendered with formData:", formData);
    setLocalFormData(formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...localFormData, [name]: value };
    setLocalFormData(updatedFormData);
    console.log(`handleChange called with name: ${name}, value: ${value}`);
    onFormDataChange(updatedFormData);
  };

  return (
    <div className={styles.CardWrapper}>
      <div className={styles.connectMenu}>
        <p className={styles.connectTitle}>Connect by:</p>
        <label className={styles.connectCheckBoxWrapper} htmlFor="connectHost">
          <input
            type="checkbox"
            id="connectHost"
            name="host"
            className={styles.checkboxInput}
            onChange={handleChange}
          />
          <span className={styles.connectTitle}>Host</span>
        </label>
        <label className={styles.connectCheckBoxWrapper} htmlFor="connectUrl">
          <input
            type="checkbox"
            id="connectUrl"
            name="url"
            onChange={handleChange}
          />
          <span className={styles.connectTitle}>URL</span>
        </label>
      </div>
      <form action="/submit" className={styles.formData}>
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
          placeholder="Driver"
          name="driver"
          value={localFormData.driver || ""}
          className="dataBaseInput"
          onChange={handleChange}
        />
        <SimpleInput
          placeholder="URL"
          name="url"
          value={localFormData.url || ""}
          className="dataBaseInput"
          onChange={handleChange}
        />
        <div className={styles.hostWrapper}>
          <SimpleInput
            placeholder="Host"
            name="host"
            value={localFormData.host || ""}
            className="dataBaseInput"
            onChange={handleChange}
          />
          <SimpleInput
            placeholder="Port"
            name="port"
            value={localFormData.port || ""}
            className="dataBaseInput"
            onChange={handleChange}
          />
        </div>
        <SimpleInput
          placeholder="Data Base Type"
          name="dbType"
          value={localFormData.dbType || ""}
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
        <span className={styles.formDataDescr}>
          Connections between VARD and your database will be encrypted
        </span>
        <button className={`${styles.formDataBtn} ${styles.formDataBtnBlue}`}>
          Connect
        </button>
      </form>
    </div>
  );
};

export default CreateDataBaseCard;
