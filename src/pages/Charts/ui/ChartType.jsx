import React, { useEffect, useState } from "react";
import { Table, Select, Input, Row, Col } from "antd";

const { Option } = Select;

// Словари для значений
const plotTypes = [
  { id: 1, label: "Plot" },
  { id: 2, label: "Scatter" },
  { id: 3, label: "Bar" },
  { id: 4, label: "Pie" },
  { id: 5, label: "Stackplot" }
];

const colors = [
  { value: "#F15C3C", label: "Red" },
  { value: "#8FC73C", label: "Green" },
  { value: "#26ADE1", label: "Blue" },
  { value: "#DE4AF0", label: "Purple" },
  { value: "#FCD205", label: "Yellow" },
  { value: "#6C6C6C", label: "Grey" }
];

const imageFormats = [
  { id: 1, label: "Png" },
  { id: 2, label: "Ps" },
  { id: 3, label: "Pdf" },
  { id: 4, label: "Svg" }
];

const ChartType = () => {
  // Состояния для хранения значений полей ввода
  const [formData, setFormData] = useState({
    title: "",
    xData: "",
    yData: "",
    xLabel: "",
    yLabel: "",
    plotType: null,
    color: null,
    imageFormat: null
  });

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
      field: "Title",
      input: (
        <Input
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      )
    },
    {
      key: "2",
      field: "X data",
      input: (
        <Input
          value={formData.xData}
          onChange={(e) => handleChange("xData", e.target.value)}
        />
      )
    },
    {
      key: "3",
      field: "Y data",
      input: (
        <Input
          value={formData.yData}
          onChange={(e) => handleChange("yData", e.target.value)}
        />
      )
    },
    {
      key: "4",
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
      key: "5",
      field: "Y label",
      input: (
        <Input
          value={formData.yLabel}
          onChange={(e) => handleChange("yLabel", e.target.value)}
        />
      )
    },
    {
      key: "6",
      field: "Plot type",
      input: (
        <Select
          placeholder="Select Plot Type"
          value={formData.plotType}
          onChange={(value) => handleChange("plotType", value)}
          style={{ width: "100%" }}
        >
          {plotTypes.map((plot) => (
            <Option key={plot.id} value={plot.id}>
              {plot.label}
            </Option>
          ))}
        </Select>
      )
    },
    {
      key: "7",
      field: "Color",
      input: (
        <Select
          placeholder="Select Color"
          value={formData.color}
          onChange={(value) => handleChange("color", value)}
          style={{ width: "100%" }}
        >
          {colors.map((color) => (
            <Option key={color.value} value={color.value}>
              {color.label}
            </Option>
          ))}
        </Select>
      )
    },
    {
      key: "8",
      field: "Image format",
      input: (
        <Select
          placeholder="Select Image Format"
          value={formData.imageFormat}
          onChange={(value) => handleChange("imageFormat", value)}
          style={{ width: "100%" }}
        >
          {imageFormats.map((format) => (
            <Option key={format.id} value={format.id}>
              {format.label}
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
