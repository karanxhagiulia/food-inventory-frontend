import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  // Fetch inventory data when the component mounts
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/food/inventory');
        setInventory(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching inventory:', err);
        setError('Error fetching inventory');
      }
    };

    fetchInventory();
  }, []);

  // Handle deleting a product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/food/delete/${id}`);
      setInventory(prev => prev.filter(item => item._id !== id));  // Remove from state
      setError('');
    } catch (err) {
      setError('Error deleting product');
      console.error(err);
    }
  };

  // Handle deleting all products
  const handleDeleteAll = async () => {
    try {
      await axios.delete('http://localhost:5000/api/food/delete/all');
      setInventory([]);  // Clear the state as all items are deleted
      setError('');
    } catch (err) {
      setError('Error deleting all products');
      console.error(err);
    }
  };

  // Handle updating expiry date
  const handleExpiryDateChange = (id, newExpiryDate) => {
    setInventory((prevInventory) =>
      prevInventory.map((item) =>
        item._id === id ? { ...item, expiryDate: newExpiryDate } : item
      )
    );
  };

  const handleUpdateExpiryDate = async (id, newExpiryDate) => {
    try {
      // Update expiry date in the backend
      const response = await axios.patch(`http://localhost:5000/api/food/update/${id}`, { expiryDate: newExpiryDate });
      console.log('Expiry date updated successfully:', response.data);
    } catch (err) {
      console.error('Error updating expiry date:', err);
      setError('Error updating expiry date');
    }
  };

  // Sort the inventory based on the column and direction
  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedData = [...inventory].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setInventory(sortedData);
    setSortConfig({ key, direction });
  };

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
    cursor: 'pointer',
  };

  // Convert inventory to CSV format
  const exportToCSV = () => {
    const headers = ['Name', 'Brand', 'Quantity', 'Amount in Inventory', 'Expiry Date'];
    const rows = inventory.map(item => [
      item.name,
      item.brands || 'No brand available',
      item.quantity,
      item.count,
      item.expiryDate || 'No expiry date available',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'inventory.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2>Inventory</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={exportToCSV} className="btn btn-success mb-3">
        Export to CSV
      </button>

      {/* Delete All button */}
      <button onClick={handleDeleteAll} className="btn btn-danger mb-3">
        Delete All Items
      </button>

      {inventory.length === 0 ? (
        <p>No items in inventory</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle} onClick={() => sortData('name')}>Name</th>
              <th style={thStyle} onClick={() => sortData('brands')}>Brand</th>
              <th style={thStyle} onClick={() => sortData('quantity')}>Quantity</th>
              <th style={thStyle} onClick={() => sortData('count')}>Amount in Inventory</th>
              <th style={thStyle} onClick={() => sortData('expiryDate')}>Expiry Date</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item._id}>
                <td style={thTdStyle}>{item.name}</td>
                <td style={thTdStyle}>{item.brands || 'No brand available'}</td>
                <td style={thTdStyle}>{item.quantity}</td>
                <td style={thTdStyle}>{item.count}</td>
                <td style={thTdStyle}>
                  <input
                    type="date"
                    value={item.expiryDate || ''}
                    onChange={(e) => handleExpiryDateChange(item._id, e.target.value)}
                    onBlur={() => handleUpdateExpiryDate(item._id, item.expiryDate)}
                  />
                </td>
                <td style={thTdStyle}>
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
