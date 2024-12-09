import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Inventory from './components/Inventory'; // Import the new Inventory component

function App() {
  const [searchTerm, setSearchTerm] = useState('');  // State for holding the search input value
  const [products, setProducts] = useState([]);  // State for holding the list of products from the API
  const [error, setError] = useState('');  // State for error messages
  const [successMessage, setSuccessMessage] = useState('');  // State for success messages (e.g., when adding a product)
  const [isSuccessBannerVisible, setIsSuccessBannerVisible] = useState(false);  // State to control the visibility of the success banner
  
  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/food/search`, {
        params: { search: searchTerm },
      });
      setProducts(response.data);  // Set the products state with the search results
      setError('');  // Clear any previous error message
      setSuccessMessage('');  // Clear any success message
    } catch (err) {
      setError('Error fetching products, please try again!');  // Set an error message if the request fails
      setProducts([]);  // Clear the products list
      setSuccessMessage('');  // Clear any success message
    }
  };
  

  const handleAddToInventory = async (product) => {
    try {
      const { name, ingredients, brands, quantity, categories, imageUrl, url } = product;
  
      if (!name || !brands || !quantity) {
        setError('Missing required fields');  // Check for required fields and show error if any are missing
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
  
      console.log(response);  // Log the response from the server (for debugging)
  
      setSuccessMessage('Food added to inventory successfully!');  // Set success message
      setError('');  // Clear any previous error messages
      setIsSuccessBannerVisible(true);  // Show the success banner
  
      // Hide the success banner after 3 seconds
      setTimeout(() => {
        setIsSuccessBannerVisible(false);
      }, 3000);
    } catch (err) {
      setError('Error adding food to inventory');  // Show error message if the post request fails
      setSuccessMessage('');  // Clear success message if the post request fails
    }
  };
  
//Rendering the app. I had loots of issues with trying to make a nice UI because of the images and the grid, so I'm using inline CSS

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
                            src={product.imageUrl || "/noimgavailable.jpg"}
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
