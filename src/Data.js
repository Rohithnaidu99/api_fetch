import { useState, useEffect } from "react";

const DataTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([
    {
      label: "Year",
      field: "Year",
      show: true,
    },
    {
      label: "Population",
      field: "Population",
      show: true,
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://datausa.io/api/data?drilldowns=Nation&measures=Population")
      .then((response) => response.json())
      .then((data) => {
        setData(data.data);
      });
  }, []);

  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilteredData(
        data.filter(
          (item) =>
            item.Year.toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            item.Population.toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
      );
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [data, searchTerm]);

  const resetData = () => {
    setSearchTerm("");
    setColumns(columns.map((column) => ({ ...column, show: true })));
  };

  const deleteColumn = (column) => {
    setColumns(
      columns.map((c) => (c.label === column.label ? { ...c, show: false } : c))
    );
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={resetData}>Reset</button>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              {columns
                .filter((column) => column.show)
                .map((column) => (
                  <th key={column.label}>
                    {column.label}&nbsp;
                    <button onClick={() => deleteColumn(column)}>
                      <img
                        src="https://img.icons8.com/ios/20/000000/trash.png"
                        className="trash-icon"
                      />
                    </button>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.Year}>
                {columns
                  .filter((column) => column.show)
                  .map((column) => (
                    <td key={column.label}>{item[column.field]}</td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
