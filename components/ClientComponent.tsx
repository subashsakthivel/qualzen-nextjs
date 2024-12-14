"use client";
import React, { useState } from "react";

const ClientComponent = (data: { data: any }) => {
  const [products, setProducts] = useState<any>(data.data);

  return <div>{products.name}</div>;
};

export default ClientComponent;
