import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    // Fetch categories from backend
    axios
      .get('https://125.228.233.149/ordershop/src/php/getCategory.php') // You should create this PHP script to fetch categories
      .then(response => {
        setCategories(response.data);
        setSelectedCategory(response.data[0]); // Set the first category as default
      })
      .catch(error => {
        console.error('There was an error fetching the categories!', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      productName,
      price,
      product_category: selectedCategory,
    };

    axios
      .post('https://125.228.233.149/ordershop/src/php/addproduct.php', newProduct)
      .then(response => {
        console.log(response.data);
        alert('Product added successfully');
        setProductName('');
        setPrice('');
        setSelectedCategory(categories[0]);
      })
      .catch(error => {
        console.error('There was an error adding the product!', error);
        alert('Failed to add product');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
        <div className='mainContent'>
        <div className='form'>
            <div>
            <label>產品名稱:</label><br></br>
            <input className='input'
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            />
            </div>
            <div>
                <label>價格:</label><br></br>
                <input className='input'
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                />
            </div>
            <div>
                <label>分類:</label>
                <select
                className='form-control info-select'
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
                >
                {categories.map(category => (
                    <option key={category} value={category}>
                    {category}
                    </option>
                ))}
                </select>
            </div>
            <button type="submit">新增產品</button>
        </div>
      
     
            </div>
        
    </form>
  );
};

export default AddProduct;
