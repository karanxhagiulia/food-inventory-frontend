import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Inventory from './components/Inventory'; // Import the new Inventory component

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSuccessBannerVisible, setIsSuccessBannerVisible] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/food/search`, {
        params: { search: searchTerm },
      });
      setProducts(response.data);
      setError('');
      setSuccessMessage('');
    } catch (err) {
      setError('Error fetching products, please try again!');
      setProducts([]);
      setSuccessMessage('');
    }
  };

  const handleAddToInventory = async (product) => {
    try {
      const { name, ingredients, brands, quantity, categories, imageUrl, url } = product;

      if (!name || !brands || !quantity) {
        setError('Missing required fields');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/food/add', {
        name,
        ingredients,
        brands,
        quantity,
        categories,
        imageUrl,
        url,
      });

      setSuccessMessage('Food added to inventory successfully!');
      setError('');
      setIsSuccessBannerVisible(true); // Show the success banner

      // Automatically hide the success banner after 3 seconds
      setTimeout(() => {
        setIsSuccessBannerVisible(false);
      }, 3000);
    } catch (err) {
      setError('Error adding food to inventory');
      setSuccessMessage('');
    }
  };

  return (
    <Router>
      <div className="App">
        {/* Centered Title */}
        <h1 style={{
          textAlign: 'center',  // Center title horizontally
          marginBottom: '20px', // Space below the title
        }}>Food Inventory</h1>

        {/* Success Banner */}
        {isSuccessBannerVisible && (
          <div
            style={{
              position: 'fixed',
              top: '20px',
              right: '0',
              backgroundColor: '#28a745',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 1000,
              animation: 'slideIn 0.5s ease-out',
            }}
          >
            <span>{successMessage}</span>
            <button
              onClick={() => setIsSuccessBannerVisible(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>
        )}

        <nav style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
          <Link to="/" style={{ margin: '0 10px', fontSize: '18px', color: '#007bff' }}>Home</Link> | 
          <Link to="/inventory" style={{ margin: '0 10px', fontSize: '18px', color: '#007bff' }}>Inventory</Link>
        </nav>

        <Routes>
          <Route path="/" element={
            <div>
              {/* Search Container */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '20px',
              }}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for food..."
                  style={{
                    width: '70%',
                    padding: '15px',
                    fontSize: '16px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    marginRight: '10px',
                  }}
                />
                <button
                  onClick={handleSearch}
                  style={{
                    padding: '15px 30px',
                    fontSize: '16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Search
                </button>
              </div>

              {error && <p style={{ color: 'red' }}>{error}</p>}

              <div className="container mt-4">
                {products.length === 0 ? (
                  <p>No products found</p>
                ) : (
                  <div className="row">
                    {products.map((product, index) => (
                      <div key={index} className="col-md-3 mb-4">
                        <div className="card h-100" style={{ display: 'flex', flexDirection: 'column' }}>
                          <img
                            src={product.imageUrl || "https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"}
                            className="card-img-top"
                            alt={product.name}
                            style={{
                              maxHeight: '200px',
                              objectFit: 'cover',
                            }}
                          />
                          <div className="card-body" style={{ flexGrow: 1 }}>
                            <h5 className="card-title">
                              <a href={product.url} target="_blank" rel="noopener noreferrer">
                                {product.name}
                              </a>
                            </h5>
                            <p><strong>Brand:</strong> {product.brands}</p>
                            <p><strong>Quantity:</strong> {product.quantity}</p>
                            <p><strong>Ingredients:</strong> {product.ingredients}</p>
                          </div>
                          <div className="card-footer" style={{ marginTop: 'auto' }}>
                            <button
                              className="btn btn-primary mt-3"
                              onClick={() => handleAddToInventory(product)}
                              style={{ width: '100%' }}
                            >
                              Add to Inventory
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          } />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
