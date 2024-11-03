import React, { useEffect, useState } from "react";
import Product from "./products"; // 确保路径正确

const ShoppingCart = ({ products, onUpdateCart }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    // 处理 sessionStorage 的重置逻辑
    const shouldResetCart = sessionStorage.getItem('resetCart');
    if (shouldResetCart === 'true') {
      sessionStorage.removeItem('cart'); // 清除购物车数据
      sessionStorage.removeItem('resetCart'); // 移除重置标志
    } else {
      sessionStorage.setItem('resetCart', 'true'); // 设置重置标志
    }
  }, []);

  useEffect(() => {
    // 根据选中的类别过滤产品列表
    if (selectedCategory === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.product_category === selectedCategory));
    }
  }, [selectedCategory, products]);

  const updateSession = (productName, newQuantity, priceChange) => {
    console.log(`Updating session for ${productName} with quantity ${newQuantity}`);
    const cart = JSON.parse(sessionStorage.getItem('cart')) || {};
    if (newQuantity > 0) {
      cart[productName] = newQuantity;
    } else {
      delete cart[productName];
    }
    sessionStorage.setItem('cart', JSON.stringify(cart));
    
    // 将更新的购物车数据传递给父组件
    onUpdateCart(productName, newQuantity, priceChange);
  };

  const handleCategoryChange = (product_category) => {
    setSelectedCategory(product_category);
  };

  // 获取所有类别
  const categories = Array.from(new Set(products.map(product => product.product_category).concat('All')));

  return (
    <div className="product">
      {/* <div className="category-buttons">
        {categories.map(product_category => (
          <button key={product_category} onClick={() => handleCategoryChange(product_category)}>
            {product_category}
          </button>
        ))} */}
      {/* </div> */}
      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Product
              key={product.product_sn}
              name={product.product_name}
              price={product.product_price}
              onCalculate={updateSession}
            />
          ))
        ) : (
          <p>No products available in this category.</p>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
