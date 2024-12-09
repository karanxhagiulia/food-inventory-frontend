# Food Inventory Management Application
University Project.
## Project Overview

The **Food Inventory Management** application is a web-based system designed to help users keep track of food products and manage their inventory effectively. This application allows users to search for food products, add them to an inventory, update product details, delete items, and visualize the inventory data.

The application leverages the **Open Food Facts API** to retrieve food product data and stores information in a **MongoDB database** for inventory management.

## Features

- **Search Food Products**: Search for food products using a keyword and retrieve detailed information like product name, ingredients, brands, and more.
- **Add Products to Inventory**: Add new products to the inventory, including details such as name, quantity, brands, ingredients, and expiration date.
- **View Inventory**: Display all products in the inventory, with aggregation to show the total quantity of duplicate items.
- **Delete Products**: Remove products from the inventory by their unique ID.
- **Update Expiry Date**: Update the expiry date for any product in the inventory.
  
## Technologies Used

- **Node.js**: JavaScript runtime used to run the backend server.
- **Express.js**: Web framework for building the API.
- **MongoDB**: NoSQL database used to store the food inventory data.
- **Axios**: Library used to make HTTP requests to the **Open Food Facts API**.
- **CORS**: Middleware to handle cross-origin requests.
- **Body-Parser**: Middleware to parse incoming request bodies as JSON.
- **dotenv**: For managing environment variables.

## API Endpoints

- 	GET /api/food/search: Fetch food products based on a search term from the Open Food Facts API.
- 	POST /api/food/add: Add a new food product to the MongoDB database.
- 	GET /api/food/inventory: Retrieve all food products from the inventory, aggre-gated by name and brand.
- 	DELETE /api/food/delete/:id: Delete a specific product from the inventory by ID.
- 	GET /api/food/:id: Fetch a specific product from the inventory by ID.
- 	PATCH /api/food/update/:id: Update a product's expiry date by ID.

## License

This project is for personal use and educational purposes only. 

Commercial use of this code is strictly prohibited. You may not use, sell, or distribute this code for commercial purposes without explicit permission from the author.



