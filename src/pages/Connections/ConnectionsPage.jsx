import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";
import useSearch from "../../components/utils/useSearch";
import toast from "react-hot-toast";

import commonStyles from "../../assets/styles/commonStyles/common.module.scss";
import SearchBlock from "../../components/SearchBlock/SearchBlock";
import Chat from "../../components/Chat/Chat";
import CreateDataBaseCard from "../../components/CreateDataBaseCard/CreateDataBaseCard";
import RandomColorIcon from "../../components/ui/CreateDynamicSvgIcon/RandomColorIcon";

import dataBaseRedSvg from "../../assets/images/icons/connection/database-red.svg";
import dataBaseGreenSvg from "../../assets/images/icons/connection/database-green.svg";
import dataBaseBlackSvg from "../../assets/images/icons/connection/database-black.svg";
import arrowSvg from "../../assets/images/icons/common/arrow.svg";
import dotsSvg from "../../assets/images/icons/common/dots_three.svg";

const API_URL = process.env.REACT_APP_API_URL || "http://vardserver:8000/api";
const connection = `${API_URL}/connection/`;

const ConnectionsPage = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const [connectionTabs, setConnectionTabs] = useState([
    {
      id: "magazine1",
      img: dataBaseRedSvg,
      MySQL: "Magazine",
      w: "20px",
      h: "20px",
      formData: {} // Состояние для CreateDataBaseCard
    },
    {
      id: "home2",
      img: dataBaseGreenSvg,
      MySQL: "Home",
      w: "20px",
      h: "20px",
      formData: {} // Состояние для CreateDataBaseCard
    },
    {
      id: "untilted3",
      img: dataBaseBlackSvg,
      MySQL: "Untilted",
      w: "20px",
      h: "20px",
      formData: {} // Состояние для CreateDataBaseCard
    }
  ]);


  useEffect(() => {
    if (connectionTabs !== null) {
      localStorage.setItem("connectionTabs", JSON.stringify(connectionTabs));
    }
  }, [connectionTabs]);

  useEffect(() => {
    const storedConnectionTabs = localStorage.getItem("connectionTabs");
    if (storedConnectionTabs) {
      setConnectionTabs(JSON.parse(storedConnectionTabs));
    }
  }, []);

  const [activeTab, setActiveTabs] = useState(null);
  const [dotsChange, setDotsChange] = useState({});
  console.log(connectionTabs);

  const handleDotsChange = (id) => {
    const updatedDotsChange = {};
    Object.keys(dotsChange).forEach((key) => {
      updatedDotsChange[key] = false;
    });
    updatedDotsChange[id] = !dotsChange[id];
    setDotsChange(updatedDotsChange);
  };

  const handleRenameSQLTabs = (itemId) => {
    const itemToUpdate = connectionTabs.find((item) => item.id === itemId);
    if (itemToUpdate) {
      itemToUpdate.MySQL = prompt("Enter the name of the new MySQL");
      setConnectionTabs([...connectionTabs]);
    }
  };

  const handleDeleteTabs = (itemId) => {
    const updatedTabs = connectionTabs.filter((item) => item.id !== itemId);
    setConnectionTabs(updatedTabs);
    toast("MySQL is deleted!", { icon: "🚨" });
  };

  const handleLeftButtonClick = () => {
    const currentIndex = connectionTabs.findIndex(
      (item) => item.id === activeTab
    );
    const newIndex =
      (currentIndex - 1 + connectionTabs.length) % connectionTabs.length;
    const newActiveTabId = connectionTabs[newIndex].id;
    setActiveTabs(newActiveTabId);
  };

  const handleRightButtonClick = () => {
    const currentIndex = connectionTabs.findIndex(
      (item) => item.id === activeTab
    );
    const newIndex = (currentIndex + 1) % connectionTabs.length;
    const newActiveTabId = connectionTabs[newIndex].id;
    setActiveTabs(newActiveTabId);
  };

  const onSelectTabsItem = (id) => {
    setActiveTabs(id);
  };

  const renderImageOrIcon = (item) => {
    const isSvg = item.img.includes(".svg");
    if (isSvg) {
      return (
        <img
          width={item.w}
          height={item.h}
          src={item.img}
          alt={`${item.MySQL}_pic`}
        />
      );
    } else {
      return (
        <RandomColorIcon color={item.img} width={item.w} height={item.h} />
      );
    }
  };

  const addNewSQLTab = (newMySQLValue) => {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    const newTab = {
      id: uuid(),
      img: randomColor,
      MySQL: newMySQLValue,
      w: "20px",
      h: "20px",
      formData: {} // Состояние для CreateDataBaseCard
    };
    setConnectionTabs([...connectionTabs, newTab]);
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
    console.log(`Updating tab ${id} with new formData:`, newFormData);
    const updatedTabs = connectionTabs.map((item) =>
      item.id === id ? { ...item, formData: newFormData } : item
    );
    setConnectionTabs(updatedTabs);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSubmit = async (formData) => {
    try {
      const response = await toast.promise(
        axios.post(
          API_URL, formData,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        ),
        {
          loading: "Sending Data...",
          success: "Data saved successfully!",
          error: "Error saving data:. Please try again.",
        })
    } catch (error) {
      console.error("Error saving data:", error);
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
            {connectionTabs
              .filter((item) =>
                item.MySQL.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectTabsItem(item.id)}
                  className={`${commonStyles.tabsItem} ${activeTab === item.id ? commonStyles.active : ""}`}
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
              {connectionTabs.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectTabsItem(item.id)}
                  className={`${commonStyles.tabsTopItem} ${activeTab === item.id ? commonStyles.active : ""}`}
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
              ...connectionTabs.find((tab) => tab.id === activeTab).formData,
              connectionName: connectionTabs.find((tab) => tab.id === activeTab).MySQL
            }}
            onFormDataChange={(newFormData) =>
              handleFormDataChange(activeTab, newFormData)
            }
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default ConnectionsPage;
