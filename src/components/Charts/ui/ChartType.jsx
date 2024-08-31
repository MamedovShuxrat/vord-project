import React, { useEffect, useState } from "react";
import { Table, Select, Input, Row, Col } from "antd";

const { Option } = Select;

const ChartType = () => {
  // Состояния для хранения данных, полученных с бэкенда
  const [clientIds, setClientIds] = useState([]);
  const [plotTypes, setPlotTypes] = useState([]);
  const [colors, setColors] = useState([]);
  const [imageFormats, setImageFormats] = useState([]);
  const [extensions, setExtensions] = useState([]);

  // Состояния для хранения значений полей ввода
  const [formData, setFormData] = useState({
    clientId: "",
    query: "",
    xData: "",
    yData: "",
    xLabel: "",
    yLabel: "",
    title: "",
    plotType: "",
    color: "",
    imageFormat: "",
    extension: ""
  });

  useEffect(() => {
    // Здесь должен быть вызов к бэкенду для получения данных для дропдаунов
    // Примерные данные, которые могли бы прийти с сервера
    setClientIds(["Magazine", "Newspaper", "Blog"]);
    setPlotTypes(["Plot", "Scatter", "Bar", "Pie", "Stackplot"]);
    setColors(["Red", "Green", "Blue", "Purple", "Yellow", "Grey"]);
    setImageFormats(["Png", "Ps", "Pdf", "Svg"]);
    setExtensions(["json api", "excel xlsx", "csv", "json"]);
  }, []);

  // Функция для обработки изменения в полях ввода
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Определение колонок для таблицы
  const columns = [
    {
      title: "Field",
      dataIndex: "field",
      key: "field",
      width: "30%"
    },
    {
      title: "Input",
      dataIndex: "input",
      key: "input",
      width: "70%"
    }
  ];

  // Данные для первой таблицы (первая колонка)
  const dataFirstColumn = [
    {
      key: "1",
      field: "Clientdb id",
      input: (
        <Select
          value={formData.clientId}
          onChange={(value) => handleChange("clientId", value)}
          style={{ width: "100%" }}
        >
          {clientIds.map((id) => (
            <Option key={id} value={id}>
              {id}
            </Option>
          ))}
        </Select>
      )
    },
    {
      key: "2",
      field: "Query",
      input: (
        <Input.TextArea
          value={formData.query}
          onChange={(e) => handleChange("query", e.target.value)}
          rows={2}
        />
      )
    },
    {
      key: "3",
      field: "X data",
      input: (
        <Input
          value={formData.xData}
          onChange={(e) => handleChange("xData", e.target.value)}
        />
      )
    },
    {
      key: "4",
      field: "Y data",
      input: (
        <Input
          value={formData.yData}
          onChange={(e) => handleChange("yData", e.target.value)}
        />
      )
    },
    {
      key: "5",
      field: "X label",
      input: (
        <Input
          value={formData.xLabel}
          onChange={(e) => handleChange("xLabel", e.target.value)}
        />
      )
    }
  ];

  // Данные для второй таблицы (вторая колонка)
  const dataSecondColumn = [
    {
      key: "6",
      field: "Y label",
      input: (
        <Input
          value={formData.yLabel}
          onChange={(e) => handleChange("yLabel", e.target.value)}
        />
      )
    },
    {
      key: "7",
      field: "Title",
      input: (
        <Input
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      )
    },
    {
      key: "8",
      field: "Plot type",
      input: (
        <Select
          value={formData.plotType}
          onChange={(value) => handleChange("plotType", value)}
          style={{ width: "100%" }}
        >
          {plotTypes.map((type) => (
            <Option key={type} value={type}>
              {type}
            </Option>
          ))}
        </Select>
      )
    },
    {
      key: "9",
      field: "Color",
      input: (
        <Select
          value={formData.color}
          onChange={(value) => handleChange("color", value)}
          style={{ width: "100%" }}
        >
          {colors.map((color) => (
            <Option key={color} value={color}>
              {color}
            </Option>
          ))}
        </Select>
      )
    },
    {
      key: "10",
      field: "Image format",
      input: (
        <Select
          value={formData.imageFormat}
          onChange={(value) => handleChange("imageFormat", value)}
          style={{ width: "100%" }}
        >
          {imageFormats.map((format) => (
            <Option key={format} value={format}>
              {format}
            </Option>
          ))}
        </Select>
      )
    },
    {
      key: "11",
      field: "Extension",
      input: (
        <Select
          value={formData.extension}
          onChange={(value) => handleChange("extension", value)}
          style={{ width: "100%" }}
        >
          {extensions.map((ext) => (
            <Option key={ext} value={ext}>
              {ext}
            </Option>
          ))}
        </Select>
      )
    }
  ];

  return (
    <Row gutter={16}>
      {/* Первая колонка */}
      <Col span={12}>
        <Table
          columns={columns}
          dataSource={dataFirstColumn}
          pagination={false}
          bordered
          style={{ width: "350px" }}
        />
      </Col>
      {/* Вторая колонка */}
      <Col span={12}>
        <Table
          columns={columns}
          dataSource={dataSecondColumn}
          pagination={false}
          bordered
          style={{ width: "350px" }}
        />
      </Col>
    </Row>
  );
};

export default ChartType;
