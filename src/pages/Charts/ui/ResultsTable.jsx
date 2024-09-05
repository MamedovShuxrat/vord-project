import React from "react";
import PropTypes from "prop-types";

// Компонент для отображения таблицы результатов
const ResultsTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No results found.</p>;
  }

  // Получаем ключи для заголовков таблицы
  const headers = Object.keys(data[0]);

  return (
    <table>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {headers.map((header) => (
              <td key={header}>{row[header]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Ожидаем, что data будет массивом объектов
ResultsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default ResultsTable;
