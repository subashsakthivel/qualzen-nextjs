import Script from "next/script";
import React from "react";

const PaymentPage = () => {
  return (
    <>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
    </>
  );
};

export default PaymentPage;
