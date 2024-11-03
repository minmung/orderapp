import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SaleList = () => {
  const [salesData, setSalesData] = useState({});
  const [period, setPeriod] = useState('today');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSalesData(period);
  }, [period]);

  const fetchSalesData = async (period) => {
    try {
      const response = await axios.get(`http://125.228.233.149/ordershop/src/php/getSalesData.php?period=${period}`);
      console.log(response.data); // 打印響應數據
      setSalesData(response.data);
      setError(null); // 清除錯誤狀態
    } catch (err) {
      console.error('There was an error fetching the sales data!', err);
      setError('Error fetching sales data'); // 設置錯誤狀態
    }
  };

  const handleDownloadExcel = () => {
    window.location.href = `http://125.228.233.149/ordershop/src/php/exportToExcel.php?period=${period}`;
    alert('已下載報表，業績逐漸提升 !!!! 請繼續努力~')
  };

  return (
    <div className='mainContent2'>
        <div className='head'>
        <h2>營業額表單</h2>
        <label>
            選擇時期:
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="today">今日</option>
            <option value="week">本週</option>
            <option value="month">本月</option>
            </select>
        </label>
        </div>
      <div className='sales'>
        <h3>總營業額:</h3>
        <h3 className='saleNum'> {salesData.order_sales || '0'}</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* 顯示錯誤信息 */}
        <button onClick={handleDownloadExcel}>下載 Excel</button>
      </div>
      <div className='table'>

     
      <h3>訂單詳情</h3>
      <table>
        <thead>
          <tr>
            <th>單號</th>
            <th>品項</th>
            <th>數量</th>
          </tr>
        </thead>
        <tbody>
          {salesData.order_details && salesData.order_details.length > 0 ? (
            salesData.order_details.map((detail, index) => (
              <tr key={index}>
                <td>{detail.order_id}</td>
                <td>{detail.order_item_id}</td>
                <td>{detail.order_item_num}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
      
    </div>
    
  );
};

export default SaleList;
