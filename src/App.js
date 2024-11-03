import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from "axios";
import ShoppingCart from "./components/shoppingCart";
import CategoryButtons from './components/categoryButton';
import Total from "./components/total";
import AddProduct from './components/AddProduct';
import SaleList from './components/SaleList';
import EditProducts from './components/EditProducts';
import "./style.css";
import "./js/fontawesome/css/all.css"; 

const OrderSystem = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalCash, setTotalCash] = useState(0);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [discount, setDiscount] = useState('');  // 新增折扣狀態
  const [discountedTotal, setDiscountedTotal] = useState(0);  // 新增折扣後總金額狀態

  useEffect(() => {
    // Fetch categories from backend
    axios
      .get('http://125.228.233.149/ordershop/src/php/getCategory.php')
      .then(response => {
        const fetchedCategories = response.data;
        const uniqueCategories = ["All", ...fetchedCategories];
        setCategories(uniqueCategories);
        setSelectedCategory(fetchedCategories[0] || "All"); // Set the first category as default or "All" if no categories fetched
      })
      .catch(error => {
        console.error('There was an error fetching the categories!', error);
      });
  }, []);

  useEffect(() => {
    // Fetch products from backend
    axios
      .get('http://125.228.233.149/ordershop/src/php/getProduct.php')
      .then(response => {
        const productsData = response.data;
        setProducts(productsData);
        setFilteredProducts(productsData); // Initially display all products
      })
      .catch(error => {
        console.error('There was an error fetching the products!', error);
      });
  }, []);
  
  useEffect(() => {
    // Calculate discounted total whenever discount or totalCash changes
    const discountValue = parseFloat(discount);
    const discountPercentage = isNaN(discountValue) || discountValue <= 0 ? 1 : discountValue / 10;
    const discountedTotal = Math.floor(totalCash * discountPercentage);  // 无条件舍弃小数点
    setDiscountedTotal(discountedTotal);
  }, [discount, totalCash]);

  const updateCart = (productName, newQuantity, priceChange) => {
    const updatedCart = { ...cart, [productName]: newQuantity };
    setCart(updatedCart);

    setTotalCash((prevTotalCash) => {
      const newTotal = Number(prevTotalCash) + priceChange;
      return isNaN(newTotal) ? 0 : newTotal;
    });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.product_category === category));
    }
  };

  const handleDiscountChange = (event) => {
    setDiscount(event.target.value);
  };

  const sendDataToPhp = (e) => {
    e.preventDefault();
  
    if (totalCash <= 0) {
      alert("訂單金額無效，請確認購物車內有物品");
      return;
    }
  
    let amountReceived;
    while (true) {
      const input = prompt("請輸入收取金額:");
  
      if (input === null) {
        alert("請輸入金額");
        continue;
      }
  
      amountReceived = parseFloat(input);
  
      // 檢查輸入是否為有效數字
      if (isNaN(amountReceived) || amountReceived <= 0) {
        alert("請輸入有效的金額（數字且大於 0）");
      } else {
        break;
      }
    }
  
    if (amountReceived < discountedTotal) {
      alert("收取金額不足，訂單尚未成立");
      return;
    }
  
    const change = amountReceived - discountedTotal;
  
    setLoading(true);
  
    axios
      .post("http://125.228.233.149/ordershop/src/php/reactData.php", {
        total: discountedTotal,
        cart: cart,
      })
      .then((response) => {
        console.log(response);
        alert(`送出成功 價格為: ${discountedTotal}。\n找零: ${change}`);
        setTotalCash(0);
        setCart({});
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  return (
    <div className="mainContent">
      <div className="ProductContent">
        <div className="category-buttons">
          <CategoryButtons />
          {categories.map(product_category => (
            <button key={product_category} onClick={() => handleCategoryChange(product_category)}>
              {product_category}
            </button>
          ))}
        </div>
        <ShoppingCart products={filteredProducts} onUpdateCart={updateCart} />
      </div>
      <div className="OrderContent">
        {loading && <p>Loading...</p>}
        <h3>詳細訂單</h3>
        <Total totalCash={totalCash} />
        <div>
          <label htmlFor="discount">折扣 (1-9):</label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={discount}
            onChange={handleDiscountChange}
            min="1"
            max="9"
            placeholder="例如: 9"
          />
        </div>
        <h2>折扣後金額: {discountedTotal}</h2>
        <div className="order_detail">
          {Object.keys(cart).length > 0 ? (
            <ul>
              {Object.keys(cart).map((productName) => (
                <li key={productName}>
                  {productName}: {cart[productName]} 個
                </li>
              ))}
            </ul>
          ) : (
            <p>沒有東西在購物車喔!</p>
          )}
        </div>
        <button onClick={sendDataToPhp} disabled={loading || totalCash <= 0}>
          {loading ? "Sending..." : "送出訂單"}
        </button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className="App">
        <main>
        <Routes>
          <Route path="/" element={<OrderSystem />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/salelist" element={<SaleList />} />
          <Route path="/editproducts" element={<EditProducts />} /> {/* 新增的 Route */}
        </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
