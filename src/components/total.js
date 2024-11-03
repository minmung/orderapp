import React from "react";

const Total = ({ totalCash }) => {
  return (
    <h4>金額: ${totalCash.toFixed(2)}</h4>
  );
};

export default Total;
