import React, { useState } from "react";

const Product = ({ name, price, onCalculate ,category}) => {
  const [quantity, setQuantity] = useState(0);

  const increment = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onCalculate(name, newQuantity, +price); // 确保价格是数字  };
  }
  const decrement = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onCalculate(name, newQuantity, -price); // 确保价格是数字
    }
  };

  return (
    <div className="card">
      <div className="card_info">
      <h2>{name}</h2>
      <h3>價格: {price}</h3>
      </div>
     
      <div className="card_quan">
        <h4>數量</h4>
        <button onClick={increment}>+</button>
        <h3> {quantity}</h3>
        <button onClick={decrement}>-</button>

      </div>
      
    </div>
  );
};

export default Product;
