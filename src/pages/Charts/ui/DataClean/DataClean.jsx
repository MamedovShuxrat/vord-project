import React, { useState } from "react";
import { Table, Input, Select, Pagination } from "antd";
import "./dataclean.module.scss";

const { Search } = Input;
const { Option } = Select;

const DataClean = () => {
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            style={{
              backgroundColor: "green",
              color: "white",
              borderRadius: "50%",
              border: "none",
              width: "24px",
              height: "24px",
              cursor: "pointer",
              marginRight: "8px"
            }}
          >
            +
          </button>
          {text}
        </div>
      )
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position"
    },
    {
      title: "Office",
      dataIndex: "office",
      key: "office"
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age"
    },
    {
      title: "Start date",
      dataIndex: "startDate",
      key: "startDate"
    }
  ];

  const data = [
    {
      key: "1",
      name: "John Doe",
      position: "Software Engineer",
      office: "New York",
      age: 32,
      startDate: "01.01.2019"
    },
    {
      key: "2",
      name: "Jane Smith",
      position: "Project Manager",
      office: "London",
      age: 29,
      startDate: "03.12.2020"
    },
    {
      key: "3",
      name: "Sam Brown",
      position: "Designer",
      office: "San Francisco",
      age: 41,
      startDate: "15.08.2018"
    },
    {
      key: "4",
      name: "Lisa White",
      position: "Data Analyst",
      office: "Tokyo",
      age: 35,
      startDate: "25.04.2017"
    },
    {
      key: "5",
      name: "Mike Green",
      position: "DevOps Engineer",
      office: "Berlin",
      age: 30,
      startDate: "11.03.2016"
    },
    {
      key: "6",
      name: "Emily Blue",
      position: "Frontend Developer",
      office: "Paris",
      age: 28,
      startDate: "22.09.2019"
    },
    {
      key: "7",
      name: "Chris Red",
      position: "Backend Developer",
      office: "Moscow",
      age: 38,
      startDate: "17.11.2021"
    },
    {
      key: "8",
      name: "Natalie Brown",
      position: "HR Specialist",
      office: "New York",
      age: 45,
      startDate: "02.07.2014"
    },
    {
      key: "9",
      name: "James Black",
      position: "Product Owner",
      office: "London",
      age: 50,
      startDate: "30.11.2015"
    },
    {
      key: "10",
      name: "Patricia White",
      position: "Marketing Manager",
      office: "Berlin",
      age: 42,
      startDate: "12.05.2013"
    },
    {
      key: "11",
      name: "Robert Green",
      position: "Security Engineer",
      office: "San Francisco",
      age: 39,
      startDate: "06.02.2017"
    },
    {
      key: "12",
      name: "Laura Yellow",
      position: "Database Administrator",
      office: "Tokyo",
      age: 31,
      startDate: "28.09.2019"
    },
    {
      key: "13",
      name: "Sophia Purple",
      position: "Cloud Engineer",
      office: "Paris",
      age: 27,
      startDate: "19.06.2020"
    },
    {
      key: "14",
      name: "Oliver Pink",
      position: "Network Administrator",
      office: "New York",
      age: 36,
      startDate: "10.04.2016"
    },
    {
      key: "15",
      name: "Lucas Grey",
      position: "CTO",
      office: "London",
      age: 48,
      startDate: "23.12.2012"
    }
  ];

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrent(1);
  };

  const paginatedData = data.slice(
    (current - 1) * pageSize,
    current * pageSize
  );

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <div>
          <span>Show </span>
          <Select
            defaultValue={10}
            style={{ width: 120 }}
            onChange={handlePageSizeChange}
          >
            <Option value={10}>10</Option>
            <Option value={20}>20</Option>
            <Option value={30}>30</Option>
            <Option value={40}>40</Option>
            <Option value={50}>50</Option>
          </Select>
          <span> entries</span>
        </div>
        <Search
          placeholder="Search..."
          onSearch={(value) => console.log(value)}
          style={{ width: 200 }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={paginatedData}
        pagination={false}
        bordered
        rowClassName={(record, index) =>
          index % 2 === 0 ? "table-row-light" : "table-row-dark"
        }
      />
      <div
        style={{
          marginTop: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <span>
          Showing {Math.min((current - 1) * pageSize + 1, data.length)} to{" "}
          {Math.min(current * pageSize, data.length)} of {data.length} entries
        </span>
        <Pagination
          current={current}
          pageSize={pageSize}
          onChange={(page) => setCurrent(page)}
          total={data.length}
          showSizeChanger={false}
          itemRender={(page, type) => {
            if (type === "prev") {
              return <span>Previous</span>;
            }
            if (type === "next") {
              return <span>Next</span>;
            }
            return <span>{page}</span>;
          }}
        />
      </div>
      <div style={{ marginTop: 16, textAlign: "start", color: "red" }}>
        205 cells have been replaced
      </div>
    </div>
  );
};

export default DataClean;
