import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Inventory() {
  // State variables for managing inventory data, errors, and sorting configurations
  const [inventory, setInventory] = useState([]); // Stores the list of inventory items
  const [error, setError] = useState(''); // Stores error messages
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' }); // Tracks sorting configuration

  // useEffect hook to fetch inventory data when the component mounts (on initial load)
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        // Fetch inventory data from the backend API
        const response = await axios.get('http://localhost:5000/api/food/inventory');
        setInventory(response.data); // Update the inventory state with the fetched data
        setError(''); // Clear any previous error
      } catch (err) {
        console.error('Error fetching inventory:', err);
        setError('Error fetching inventory'); // Set an error message if the request fails
      }
    };

    fetchInventory(); // Call the fetch function
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  //delete button to delete a row 
  const handleDelete = async (id) => {
    try {
        // Send DELETE request to the backend
        await axios.delete(`http://localhost:5000/api/food/delete/${id}`);
        
        // After deletion, re-fetch the inventory data
        const response = await axios.get('http://localhost:5000/api/food/inventory');
        setInventory(response.data); // Update the inventory state with the fresh data
        
        setError(''); // Clear any previous error
    } catch (err) {
        setError('Error deleting product'); // Set error message if something goes wrong
        console.error(err); // Log the error for debugging
    }
};




  // Function to handle updating the expiry date of a product locally (before saving it to the backend)
  const handleExpiryDateChange = (id, newExpiryDate) => {
    setInventory((prevInventory) =>
      prevInventory.map((item) =>
        item._id === id ? { ...item, expiryDate: newExpiryDate } : item // Update expiry date for the specific item
      )
    );
  };

  // Function to handle updating the expiry date in the backend
  const handleUpdateExpiryDate = async (id, newExpiryDate) => {
    try {
      // Send PATCH request to update the expiry date in the backend
      const response = await axios.patch(`http://localhost:5000/api/food/update/${id}`, { expiryDate: newExpiryDate });
      console.log('Expiry date updated successfully:', response.data);
    } catch (err) {
      console.error('Error updating expiry date:', err); // Log the error for debugging
      setError('Error updating expiry date'); // Display error message
    }
  };

  // Function to handle sorting the inventory based on a specific column (e.g., name, brand)
  const sortData = (key) => {
    let direction = 'asc'; // Default sorting direction

    // If the same column is clicked again, toggle the sorting direction
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'; // Toggle to descending order
    }

    // Sort the inventory data based on the selected key and direction
    const sortedData = [...inventory].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1; // Sort in ascending or descending order
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setInventory(sortedData); // Update the inventory with the sorted data
    setSortConfig({ key, direction }); // Update the sorting configuration
  };

  // Inline styles for table and table cells
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '20px 0',
  };

  const thTdStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
  };

  const thStyle = {
    backgroundColor: '#f4f4f4',
    cursor: 'pointer', // Indicate that the column headers are clickable for sorting
  };

  // Function to export the inventory data as a CSV file
  const exportToCSV = () => {
    // Define the CSV headers
    const headers = ['Name', 'Brand', 'Quantity', 'Amount in Inventory', 'Expiry Date'];
    
    // Map over the inventory items to create rows for the CSV file
    const rows = inventory.map(item => [
      item.name,
      item.brands || 'No brand available',
      item.quantity,
      item.count,
      item.expiryDate || 'No expiry date available',
    ]);

    // Join the headers and rows into CSV format
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create a Blob object from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); // Create a URL for the Blob

    // Create an invisible link to trigger the file download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inventory.csv'; // Name of the CSV file
    document.body.appendChild(link);
    link.click(); // Simulate a click to start the download
    document.body.removeChild(link); // Remove the link element from the document
  };

  return (
    <div>
      <h2>Inventory</h2>
      
      {/* Display error message if any error occurs */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Button to export inventory to CSV */}
      <button onClick={exportToCSV} className="btn btn-success mb-3">
        Export to CSV
      </button>


      {/* If no inventory items, display a message */}
      {inventory.length === 0 ? (
        <p>No items in inventory</p>
      ) : (
        // Display inventory in a table format
        <table style={tableStyle}>
          <thead>
            <tr>
              {/* Table headers, clickable to sort data */}
              <th style={thStyle} onClick={() => sortData('name')}>Name</th>
              <th style={thStyle} onClick={() => sortData('brands')}>Brand</th>
              <th style={thStyle} onClick={() => sortData('quantity')}>Quantity</th>
              <th style={thStyle} onClick={() => sortData('count')}>Amount in Inventory</th>
              <th style={thStyle} onClick={() => sortData('expiryDate')}>Expiry Date</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Loop through inventory items and display them in rows */}
            {inventory.map((item) => (
              <tr key={item._id}>
                <td style={thTdStyle}>{item.name}</td>
                <td style={thTdStyle}>{item.brands || 'No brand available'}</td>
                <td style={thTdStyle}>{item.quantity}</td>
                <td style={thTdStyle}>{item.count}</td>
                <td style={thTdStyle}>
                  {/* Input field for updating the expiry date */}
                  <input
                    type="date"
                    value={item.expiryDate || ''}
                    onChange={(e) => handleExpiryDateChange(item._id, e.target.value)}
                    onBlur={() => handleUpdateExpiryDate(item._id, item.expiryDate)}
                  />
                </td>
                <td style={thTdStyle}>
                  {/* Button to delete the product */}
                  <button onClick={() => handleDelete(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Inventory;
