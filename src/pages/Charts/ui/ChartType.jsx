import React, { useState, useEffect } from "react";
import { Table, Select, Input, Row, Col, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createVisualization } from "../../../core/store/chartvisualizationSlice";

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
  const savedChartId = localStorage.getItem('lastChartId');
  const dispatch = useDispatch();
  const token = localStorage.getItem('userToken');

  const [chartId, setChartId] = useState(savedChartId || null);
  const [formData, setFormData] = useState({
    title: "",
    xData: "",
    yData: "",
    plotType: null,
    color: null,
    imageFormat: null
  });
  const [savedPlot, setSavedPlot] = useState(null); // Хранение plot после сохранения
  const [availableColumns, setAvailableColumns] = useState([]);

  const visualizations = useSelector((state) => state.charts.visualizations);

  useEffect(() => {
    if (!chartId) {
      message.error("No chartId found in localStorage.");
      return;
    }

    const storedColumns = JSON.parse(localStorage.getItem("lastChartColumns")) || [];

    if (storedColumns.length > 0) {
      setAvailableColumns(storedColumns);
    } else {
      const columnsFromRedux = visualizations?.[chartId]?.columnNames || [];
      if (columnsFromRedux.length > 0) {
        setAvailableColumns(columnsFromRedux);
      } else {
        message.error("No available columns for this chart.");
      }
    }
  }, [chartId, visualizations]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveVisualization = () => {
    if (!chartId || !formData.xData || !formData.yData || !formData.plotType) {
      message.error("Please fill in all required fields.");
      return;
    }

    const visualizationData = {
      chart: chartId,
      title: formData.title,
      x_data: formData.xData,
      y_data: formData.yData,
      x_label: formData.xData,
      y_label: formData.yData,
      plot_type: formData.plotType,
      color: formData.color,
      image_format: formData.imageFormat,
      plot: null
    };

    dispatch(createVisualization({ chartId, visualizationData, token }))
      .then((result) => {
        if (result.error) {
          message.error(result.error.message || "Failed to save visualization.");
        } else {
          if (result.payload.plot) {
            // Удаляем префикс b'' перед отображением изображения
            const cleanPlot = result.payload.plot.replace(/^b'|'$/g, '');
            setSavedPlot(cleanPlot);
            message.success("Visualization saved successfully!");
          }
        }
      });
  };


  if (savedPlot) {
    return (
      <div>
        <h3>Visualization</h3>
        <img src={`data:image/png;base64,${savedPlot}`} alt="Visualization" />
        <Button onClick={() => setSavedPlot(null)} style={{ marginTop: "20px" }}>
          Back to form
        </Button>
      </div>
    );
  }


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
      field: "X data (auto label)",
      input: (
        <Select
          placeholder="Select X Data"
          value={formData.xData}
          onChange={(value) => handleChange("xData", value)}
          style={{ width: "100%" }}
        >
          {availableColumns.map((column) => (
            <Option key={column} value={column}>
              {column}
            </Option>
          ))}
        </Select>
      )
    },
    {
      key: "3",
      field: "Y data (auto label)",
      input: (
        <Select
          placeholder="Select Y Data"
          value={formData.yData}
          onChange={(value) => handleChange("yData", value)}
          style={{ width: "100%" }}
        >
          {availableColumns.map((column) => (
            <Option key={column} value={column}>
              {column}
            </Option>
          ))}
        </Select>
      )
    }
  ];

  const dataSecondColumn = [
    {
      key: "4",
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
      key: "5",
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
      key: "6",
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
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Row gutter={16}>
        <Col span={12}>
          <Table
            columns={columns}
            dataSource={dataFirstColumn}
            pagination={false}
            bordered
            style={{ width: "100%" }}
          />
        </Col>
        <Col span={12}>
          <Table
            columns={columns}
            dataSource={dataSecondColumn}
            pagination={false}
            bordered
            style={{ width: "100%" }}
          />
        </Col>
      </Row>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Button type="primary" onClick={handleSaveVisualization}>
          Save Visualization
        </Button>
      </div>
    </div>
  );
};

export default ChartType;
