import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";
import axios from "axios";
import {
  addConnection,
  updateConnection,
  renameConnection,
  deleteConnection,
  setConnections
} from "../../core/store/connectionsSlice";
import useSearch from "../../components/utils/useSearch";
import toast from "react-hot-toast";

import commonStyles from "../../assets/styles/commonStyles/common.module.scss";
import SearchBlock from "../../components/SearchBlock/SearchBlock";
import Chat from "../../components/Chat/ui/Chat";
import CreateDataBaseCard from "../../components/CreateDataBaseCard/CreateDataBaseCard";
import RandomColorIcon from "../../components/ui/CreateDynamicSvgIcon/RandomColorIcon";

import dataBaseRedSvg from "../../assets/images/icons/connection/database-red.svg";
import dataBaseGreenSvg from "../../assets/images/icons/connection/database-green.svg";
import dataBaseBlackSvg from "../../assets/images/icons/connection/database-black.svg";
import arrowSvg from "../../assets/images/icons/common/arrow.svg";
import dotsSvg from "../../assets/images/icons/common/dots_three.svg";

const API_URL = process.env.REACT_APP_API_URL || "http://vardserver:8000/api";
const CONNECTION = `${API_URL}/clientdb/`;

const ConnectionsPage = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const connections = useSelector((state) => state.connections.connections);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedConnections = JSON.parse(localStorage.getItem("connections"));
    if (storedConnections) {
      dispatch(setConnections(storedConnections));
    }
    console.log("Loaded connections from localStorage: ", storedConnections); // Лог здесь
  }, [dispatch]);

  const [activeTab, setActiveTab] = useState(null);
  const [dotsChange, setDotsChange] = useState({});
  const [isConnected, setIsConnected] = useState(false);

  const handleDotsChange = (id) => {
    const updatedDotsChange = {};
    Object.keys(dotsChange).forEach((key) => {
      updatedDotsChange[key] = false;
    });
    updatedDotsChange[id] = !dotsChange[id];
    setDotsChange(updatedDotsChange);
  };

  const handleRenameSQLTabs = (itemId) => {
    const newName = prompt("Enter the name of the new MySQL");
    if (newName) {
      dispatch(renameConnection({ id: itemId, newName }));
    }
  };

  const handleDeleteTabs = (itemId) => {
    dispatch(deleteConnection(itemId));
    toast("MySQL is deleted!", { icon: "🚨" });
  };

  const handleLeftButtonClick = () => {
    const currentIndex = connections.findIndex((item) => item.id === activeTab);
    const newIndex =
      (currentIndex - 1 + connections.length) % connections.length;
    setActiveTab(connections[newIndex].id);
  };

  const handleRightButtonClick = () => {
    const currentIndex = connections.findIndex((item) => item.id === activeTab);
    const newIndex = (currentIndex + 1) % connections.length;
    setActiveTab(connections[newIndex].id);
  };

  const onSelectTabsItem = (id) => {
    setActiveTab(id);
  };

  const renderImageOrIcon = (item) => {
    const isSvg = item.img.includes(".svg");
    return isSvg ? (
      <img
        width={item.w}
        height={item.h}
        src={item.img}
        alt={`${item.MySQL}_pic`}
      />
    ) : (
      <RandomColorIcon color={item.img} width={item.w} height={item.h} />
    );
  };

  const addNewSQLTab = (newMySQLValue) => {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    const newTab = {
      id: uuid(),
      img: randomColor,
      MySQL: newMySQLValue,
      w: "20px",
      h: "20px",
      formData: {}
    };
    dispatch(addConnection(newTab));
    setIsConnected(false);
  };

  const activeItemRef = useRef(null);

  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start"
      });
    }
  }, [activeTab]);

  const handleFormDataChange = (id, newFormData) => {
    console.log("Handling Form Data Change: ", newFormData); // Лог для проверки
    dispatch(updateConnection({ id, formData: newFormData }));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSubmit = async (formData) => {
    const token = JSON.parse(localStorage.getItem("userToken"));
    try {
      const response = await toast.promise(
        axios.post(CONNECTION, formData, {
          headers: {
            Authorization: `Token ${token}`
          }
        }),
        {
          loading: "Sending Data...",
          success: "Data saved successfully!",
          error: "Error saving data. Please try again."
        }
      );

      setIsConnected(true);

      const updatedFormData = {
        ...formData,
        connectionName: formData.connection_name
      };
      dispatch(updateConnection({ id: activeTab, formData: updatedFormData }));
    } catch (error) {
      console.error("Error saving data:", error);
      setIsConnected(false);
    }
  };

  return (
    <div className={commonStyles.sectionWrapper}>
      <div>
        <div className={commonStyles.searchBlock}>
          <SearchBlock
            onSearch={handleSearch}
            placeholder="Search Connection"
            addNewTab={addNewSQLTab}
          />
          <div className={commonStyles.tabsWrapper}>
            {connections
              .filter((item) =>
                item.MySQL.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectTabsItem(item.id)}
                  className={`${commonStyles.tabsItem} ${
                    activeTab === item.id ? commonStyles.active : ""
                  }`}
                >
                  {renderImageOrIcon(item)}
                  <span className={commonStyles.tabsName}>
                    MySQL: {item.MySQL}
                  </span>
                  <button
                    className={commonStyles.tabsDots}
                    onClick={() => handleDotsChange(item.id)}
                  >
                    <img
                      style={{
                        transform: dotsChange[item.id]
                          ? "rotate(360deg)"
                          : "none"
                      }}
                      src={dotsSvg}
                      alt={`${item.MySQL}_pic`}
                    />
                    {dotsChange[item.id] && (
                      <div className={commonStyles.dotsChangeWrapper}>
                        <span
                          onClick={() => handleRenameSQLTabs(item.id)}
                          className={commonStyles.dotsChangeRename}
                        >
                          Rename
                        </span>
                        <span
                          onClick={() => handleDeleteTabs(item.id)}
                          className={commonStyles.dotsChangeDelete}
                        >
                          Delete
                        </span>
                      </div>
                    )}
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className={commonStyles.sectionMainContent}>
        <div className={commonStyles.tabsTopBlock}>
          <button
            className={commonStyles.tabsLeft}
            onClick={handleLeftButtonClick}
          >
            <img src={arrowSvg} alt="arrow-pic" />
          </button>
          <div className={commonStyles.tabsTopBlockWrapper}>
            <div className={commonStyles.tabsTopWrapper}>
              {connections.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectTabsItem(item.id)}
                  className={`${commonStyles.tabsTopItem} ${
                    activeTab === item.id ? commonStyles.active : ""
                  }`}
                  ref={activeTab === item.id ? activeItemRef : null}
                >
                  <span
                    className={`${commonStyles.tabsName} ${commonStyles.tabsTopName}`}
                  >
                    {item.MySQL}
                  </span>
                  <button className={commonStyles.tabsTopDots}>
                    <img src={dotsSvg} alt={`${item.MySQL}_pic`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button
            className={`${commonStyles.tabsRight}`}
            onClick={handleRightButtonClick}
          >
            <img src={arrowSvg} alt="arrow-pic" />
          </button>
          <div className={commonStyles.sectionChatWrapper}>
            <Chat />
          </div>
        </div>
        {activeTab && (
          <CreateDataBaseCard
            formData={{
              ...connections.find((tab) => tab.id === activeTab).formData,
              connectionName: connections.find((tab) => tab.id === activeTab)
                .MySQL
            }}
            onFormDataChange={(newFormData) =>
              handleFormDataChange(activeTab, newFormData)
            }
            onSubmit={handleSubmit}
            isConnected={isConnected}
            setIsConnected={setIsConnected}
          />
        )}
      </div>
    </div>
  );
};

export default ConnectionsPage;
