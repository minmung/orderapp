import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../js/fontawesome/css/fontawesome.min.css';

const CategoryButtons = () => {
  const [isHumContentVisible, setHumContentVisible] = useState(false);

  const toggleHumContent = () => {
    setHumContentVisible(!isHumContentVisible);
  };

  return (
    <div className="category-buttons">
      <div className="humContent">
        <div className="hum_button" onClick={toggleHumContent}>
          <i className="fas fa-bars"></i>
        </div>
        <div className={`hum_content ${isHumContentVisible ? 'visible' : ''}`}>
          <ul>
            <div className="hum_back" onClick={toggleHumContent}>
              <i className="fas fa-chevron-left"></i>
            </div>
            <li><Link to="/" onClick={toggleHumContent}>點餐系統</Link></li>
            <li><Link to="/addproduct" onClick={toggleHumContent} target='_blank'>新增餐點</Link></li>
            <li><Link to="/editproducts" onClick={toggleHumContent} target='_blank'>編輯餐點</Link></li>
            <li><Link to="/salelist" onClick={toggleHumContent} target='_blank'>營業額表單</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoryButtons;
