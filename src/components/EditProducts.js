import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('');


  useEffect(() => {
    axios.get('https://125.228.233.149/ordershop/src/php/getProduct.php')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the products!', error);
      });
      // Fetch categories from backend
    axios.get("https://125.228.233.149/ordershop/src/php/getCategory.php")
    .then(response => {
      setCategories(response.data);
    })
    .catch(error => {
      console.error("There was an error fetching the categories!", error);
    });
  }, []);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setNewName(product.product_name);
    setNewPrice(product.product_price);
    setNewCategory(product.product_category);
  };

  const handleSaveClick = () => {
    const updatedProduct = {
      ...editingProduct,
      product_name: newName,
      product_price: newPrice,
      product_category: newCategory
    };

    axios.post('http://125.228.233.149/ordershop/src/php/updateProduct.php', updatedProduct)
      .then(response => {
        // 更新成功后刷新产品列表
        setProducts(products.map(product => 
          product.product_sn === updatedProduct.product_sn ? updatedProduct : product
        ));
        setEditingProduct(null);
      })
      .catch(error => {
        console.error('There was an error updating the product!', error);
      });
  };

  const handleCancelClick = () => {
    setEditingProduct(null);
  };

  return (
    <div className='mainContent2'>
      <h1>編輯產品</h1>
      <div className='table'>

     
      <table>
        <thead>
          <tr>
            <th>產品編號</th>
            <th>產品名稱</th>
            <th>價格</th>
            <th>類別</th>
            <th>動作</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.product_sn}>
              <td>{product.product_sn}</td>
              <td>{product.product_name}</td>
              <td>{product.product_price}</td>
              <td>{product.product_category}</td>
              <td>
                <button onClick={() => handleEditClick(product)}>編輯</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {editingProduct && (
        <div className='editcontent'>
          <h2>編輯產品名稱</h2>
          <form>
            <div>
              <label htmlFor="newName">品項名稱:</label>
              <input
                id="newName"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="newPrice">價格:</label>
              <input
                id="newPrice"
                type="text"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
            </div>
            <div>
                <label>分類:</label>
                <select
                className='form-control info-select'
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
                >
                {categories.map(category => (
                    
                    <option key={category} value={category}>
                    {/* {selectedCategory} */}
                    {category}
                    </option>
                ))}
                </select>
            </div>
            <button type="button" onClick={handleSaveClick}>儲存</button>
            <button type="button" onClick={handleCancelClick}>取消</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EditProducts;
