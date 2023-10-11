import React from "react";
import "./CustomTable.css"; 


function CustomTable({ data }) {
  if (!data || data.length === 0) {
    return <p>No data to display</p>;
  }

  const tableHeaders = Object.keys(data[0]);

  return (
    <table>
      <thead>
        <tr>
          {tableHeaders.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {tableHeaders.map((header, headerIndex) => (
              <td key={headerIndex}>{row[header]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CustomTable;
