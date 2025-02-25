import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./createDataBaseCard.module.scss";
import SimpleInput from "../ui/Inputs/SimpleInput";
import { resetForm, handleFormButtonClick } from "../utils/formUtils";

const DATABASETYPE = [
  {
    id: 1,
    name: "MSSQL SQLAlchemy mssql+pyodbc",
    is_available: true,
    port: 1433,
    driver: "mssql+pyodbc",
    driver2: "?driver=ODBC+Driver+17+for+SQL+Server"
  },
  {
    id: 2,
    name: "MYSQL SQLAlchemy mysql+pymysql",
    is_available: true,
    port: 3306,
    driver: "mysql+pymysql",
    driver2: "?charset=utf8mb4"
  },
  {
    id: 3,
    name: "MARIADB SQLAlchemy mssql+pyodbc",
    is_available: true,
    port: 3306,
    driver: "mysql+pymysql",
    driver2: ""
  },
  {
    id: 4,
    name: "POSTGRES SQLAlchemy postgresql+psycopg2",
    is_available: true,
    port: 5432,
    driver: "postgresql+psycopg2",
    driver2: ""
  },
  {
    id: 5,
    name: "MSSQL pyodbc",
    is_available: true,
    port: 1433,
    driver: "",
    driver2: ""
  }
];

const CreateDataBaseCard = ({
  formData,
  onFormDataChange,
  onSubmit,
  isConnected,
  setIsConnected,
  isNewConnection
}) => {
  const [localFormData, setLocalFormData] = useState(formData);
  const [dbType, setDbType] = useState(formData.dbType || "");
  const [driver, setDriver] = useState(formData.driver || "");
  const [isFormValid, setIsFormValid] = useState(false);
  const [connectionMethod, setConnectionMethod] = useState("");

  useEffect(() => {
    setLocalFormData(formData);
    setDbType(formData.dbType || "");
    setDriver(formData.driver || "");
  }, [formData]);

  useEffect(() => {
    const checkFormValidity = () => {
      const isValid =
        localFormData.user &&
        localFormData.password &&
        localFormData.dbName &&
        (dbType === "MSSQL" ? localFormData.url : true) &&
        (localFormData.host ? localFormData.port : true);
      setIsFormValid(isValid);
    };

    checkFormValidity();
  }, [localFormData, dbType]);

  const handleConnectionChange = (e) => {
    setConnectionMethod(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating field ${name} with value ${value}`);
    const updatedFormData = { ...localFormData, [name]: value };
    setLocalFormData(updatedFormData);
    onFormDataChange(updatedFormData);
  };

  const handleDbTypeChange = (e) => {
    const value = e.target.value;
    setDbType(value);
    handleChange(e);
  };

  const handleDriverChange = (e) => {
    const value = e.target.value;
    setDriver(value);
    handleChange(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const port = localFormData.port ? parseInt(localFormData.port, 10) : null;
    const formDataToSend = {
      connection_name: localFormData.connectionName,
      user_name: localFormData.user,
      password: localFormData.password,
      url: connectionMethod === "url" ? localFormData.url : "",
      host: connectionMethod === "host" ? localFormData.host : "",
      port: port,
      data_base_type: dbType,
      data_base_name: localFormData.dbName,
      description: localFormData.description,
      driver: driver
    };

    console.log("Form Data to Send: ", formDataToSend);

    onSubmit(formDataToSend);

    setLocalFormData((prevData) => ({
      ...prevData,
      ...formDataToSend
    }));

    if (!isConnected) {
      setIsConnected(true);
    }
  };

  return (
    <div className={styles.CardWrapper}>
      <div className={styles.connectMenu}>
        <p className={styles.connectTitle}>Connect by:</p>
        <label className={styles.connectCheckBoxWrapper} htmlFor="connectHost">
          <input
            type="checkbox"
            id="connectHost"
            name="connectMethod"
            value="host"
            checked={connectionMethod === "host"}
            onChange={handleConnectionChange}
            className={styles.checkboxInput}
          />
          <span className={styles.connectTitle}>Host</span>
        </label>
        <label className={styles.connectCheckBoxWrapper} htmlFor="connectUrl">
          <input
            type="checkbox"
            id="connectUrl"
            name="connectMethod"
            value="url"
            checked={connectionMethod === "url"}
            onChange={handleConnectionChange}
          />
          <span className={styles.connectTitle}>URL</span>
        </label>
      </div>
      <form onSubmit={handleSubmit} className={styles.formData}>
        <SimpleInput
          placeholder="User"
          name="user"
          value={localFormData.user || ""}
          className="dataBaseInput"
          onChange={handleChange}
          required
        />
        <SimpleInput
          type={"password"}
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
        {connectionMethod === "host" && (
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
        )}
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
            {DATABASETYPE.map((item, key) => (
              <option key={key} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        {dbType === "MSSQL" && (
          <SimpleInput
            placeholder="URL"
            name="url"
            value={localFormData.url || ""}
            className="dataBaseInput"
            onChange={handleChange}
          />
        )}
        {dbType === "SQL Alchemy" && (
          <SimpleInput
            placeholder="Driver"
            name="driver"
            value={localFormData.driver || ""}
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
          onClick={() => handleFormButtonClick(isFormValid)}
        >
          {isNewConnection ? "Connect" : "Update"}
        </button>
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
    host: PropTypes.string,
    url: PropTypes.string,
    port: PropTypes.number
  }).isRequired,
  onFormDataChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isConnected: PropTypes.bool.isRequired,
  setIsConnected: PropTypes.func.isRequired,
  isNewConnection: PropTypes.bool.isRequired
};

export default CreateDataBaseCard;
