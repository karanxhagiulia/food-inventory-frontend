import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Inventory from './components/Inventory'; // Import the new Inventory component

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle the search functionality
  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/food/search`, {
        params: { search: searchTerm },
      });
      setProducts(response.data);  // The backend sends only the filtered data
      setError('');
      setSuccessMessage('');
    } catch (err) {
      setError('Error fetching products, please try again!');
      setProducts([]);
      setSuccessMessage('');
    }
  };

  // Handle adding a product to the inventory
 
  const handleAddToInventory = async (product) => {
    try {
      console.log("Adding product to inventory:", product);
  
      const { name, ingredients, brands, quantity, categories, image_url, url } = product;
  
      // Check if all required fields are available
      if (!name || !brands || !quantity) {
        console.log("Missing required fields");
        setError('Missing required fields');
        return;
      }
  
      const response = await axios.post('http://localhost:5000/api/food/add', {
        name,
        ingredients,   // Optional field
        brands,        // Required field
        quantity,      // Required field
        categories,    // Optional field
        imageUrl: image_url, // Optional field
        url,           // Optional field
      });
  
      setSuccessMessage('Food added to inventory successfully!');
      setError('');
      setSearchTerm('');
      setProducts([]);
    } catch (err) {
      console.error("Error while adding product to inventory:", err);
      setError('Error adding food to inventory');
      setSuccessMessage('');
    }
  };
  



  return (
    <Router>
      <div className="App">
        <h1>Food Inventory</h1>
        <nav>
          <Link to="/">Home</Link> | 
          <Link to="/inventory">Inventory</Link>
        </nav>

        <Routes>
          {/* Home route to search for food */}
          <Route path="/" element={
            <div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for food..."
              />
              <button onClick={handleSearch}>Search</button>

              {error && <p style={{ color: 'red' }}>{error}</p>}
              {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

              <div>
                {products.length === 0 ? (
                  <p>No products found</p>
                ) : (
                  <ul>
                    {products.map((product, index) => (
                      <li key={index}>
                        <strong>{product.name}</strong> {/* Product name */}
                        <p><strong>Brands:</strong> {product.brands}</p> {/* Brands */}
                        <p><strong>Ingredients:</strong> {product.ingredients}</p> {/* Ingredients */}
                        <p><strong>Quantity:</strong> {product.quantity}</p> {/* Quantity */}
                        <p><strong>Categories:</strong> {product.categories}</p> {/* Categories */}
                        {product.image_url && <img src={product.image_url} alt={product.name} width="100" />} {/* Product image */}
                        <p><a href={product.url} target="_blank" rel="noopener noreferrer">View on Open Food Facts</a></p> {/* Product URL */}
                        <button onClick={() => handleAddToInventory(product)}>Add to Inventory</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          } />

          {/* Inventory route to view all inventory items */}
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
