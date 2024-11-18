import React, { useState, useEffect } from 'react';

const Admin = () => {
  const baseUrl = 'http://localhost:8000/admin'; // Update this with the correct API base URL

  // Fetch utility function
  const fetchData = async (endpoint, method, data = null) => {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (data) options.body = JSON.stringify(data);

    try {
      const response = await fetch(`${baseUrl}/${endpoint}`, options);
      if (!response.ok) {
        throw new Error(`API call failed with status ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };

  // Component for managing a table
  const TableSection = ({ title, endpoint, columns }) => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [tableData, setTableData] = useState([]);

    // Fetch all data from the table on component load
    useEffect(() => {
      const fetchTableData = async () => {
        const result = await fetchData(endpoint, 'GET');
        setTableData(result);
      };
      fetchTableData();
    }, [endpoint]);

    const handleFetchAll = async () => {
      const result = await fetchData(endpoint, 'GET');
      setOutput(JSON.stringify(result, null, 2));
      setTableData(result);
    };

    const handleFetchById = async () => {
      const id = input.trim();
      const result = await fetchData(`${endpoint}/${id}`, 'GET');
      setOutput(JSON.stringify(result, null, 2));
    };

    const handleCreate = async () => {
      try {
        const data = JSON.parse(input);
        const result = await fetchData(endpoint, 'POST', data);
        setOutput(JSON.stringify(result, null, 2));
        handleFetchAll();
      } catch (error) {
        setOutput('Invalid JSON data');
      }
    };

    const handleUpdate = async () => {
      try {
        const [id, ...rest] = input.split(':');
        const data = JSON.parse(rest.join(':'));
        const result = await fetchData(`${endpoint}/${id.trim()}`, 'PUT', data);
        setOutput(JSON.stringify(result, null, 2));
        handleFetchAll();
      } catch (error) {
        setOutput('Invalid input format. Use `id:{...data}`');
      }
    };

    const handleDelete = async () => {
      const id = input.trim();
      const result = await fetchData(`${endpoint}/${id}`, 'DELETE');
      setOutput(JSON.stringify(result, null, 2));
      handleFetchAll();
    };

    return (
      <section style={{ marginBottom: '40px' }}>
        <h2>{title}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}>
          <button onClick={handleFetchAll}>Get All</button>
          <button onClick={handleFetchById}>Get By ID</button>
          <button onClick={handleCreate}>Create</button>
          <button onClick={handleUpdate}>Update</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Enter data or ID for ${title.toLowerCase()}...`}
          style={{ width: '100%', height: '100px', marginBottom: '20px' }}
        />
        <div
          className="output"
          style={{ whiteSpace: 'pre-wrap', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
        >
          {output}
        </div>
        <div
          className="table-data"
          style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
        >
          <h3>{title} Current State</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  {columns.map((col) => (
                    <td key={col} style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px' }}>
      <h1>Admin Page</h1>
      <TableSection
        title="Member Game Table"
        endpoint="member"
        columns={['member_id', 'pwd', 'name', 'email', 'point', 'win', 'lose', 'create_date']}
      />
      <TableSection title="Words Table" endpoint="word" columns={['word_id', 'en_word', 'ko_word', 'easy_or_hard']} />
    </div>
  );
};

export default Admin;
