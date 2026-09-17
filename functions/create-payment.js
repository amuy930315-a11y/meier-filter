const crypto = require("crypto");

// =========================
// 綠界測試資料
// 正式上線後要改成環境變數
// =========================

const MERCHANT_ID = "3002607";
const HASH_KEY = "pwFHCqoQZGmho4w6";
const HASH_IV = "EkRm7iFT261dpevs";


// =========================
// MEIER 商品資料
// 價格只由後端決定
// =========================

const PRODUCTS = {

  "creamy-day": {
    name: "CREAMY DAY 奶油日光",
    price: 199
  },

  "color-breeze": {
    name: "COLOR BREEZE 晴彩微風",
    price: 199
  },

  "golden-day": {
    name: "GOLDEN DAY 金色日光",
    price: 199
  }

};


// =========================
// 日期格式
// =========================

function formatDate(date) {
  const pad = (n) =>
    String(n).padStart(2, "0");

  return (
    date.getFullYear() +
    "/" +
    pad(date.getMonth() + 1) +
    "/" +
    pad(date.getDate()) +
    " " +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds())
  );
}


// =========================
// 綠界 URL Encode
// =========================

function ecpayUrlEncode(value) {
  return encodeURIComponent(value)
    .replace(/%20/g, "+")
    .replace(/%2D/gi, "-")
    .replace(/%5F/gi, "_")
    .replace(/%2E/gi, ".")
    .replace(/%21/gi, "!")
    .replace(/%2A/gi, "*")
    .replace(/%28/gi, "(")
    .replace(/%29/gi, ")");
}


// =========================
// 產生 CheckMacValue
// =========================

function generateCheckMacValue(params) {
  const sortedKeys =
    Object.keys(params).sort((a, b) =>
      a.localeCompare(b)
    );

  const raw =
    sortedKeys
      .map(
        (key) =>
          `${key}=${params[key]}`
      )
      .join("&");

  const full =
    `HashKey=${HASH_KEY}&${raw}&HashIV=${HASH_IV}`;

  const encoded =
    ecpayUrlEncode(full)
      .toLowerCase();

  return crypto
    .createHash("sha256")
    .update(encoded)
    .digest("hex")
    .toUpperCase();
}


// =========================
// HTML 安全處理
// =========================

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}


// =========================
// Netlify Function
// =========================

exports.handler = async function (event) {

  // 只接受 POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }


  // =========================
  // 讀取購物車
  // =========================

  let cartIds = [];

  try {
    const body =
      new URLSearchParams(
        event.body || ""
      );

    const cartJson =
      body.get("cart");

    cartIds =
      JSON.parse(cartJson || "[]");

  } catch (error) {

    return {
      statusCode: 400,
      body: "購物車資料格式錯誤"
    };

  }


  // =========================
  // 檢查商品
  // =========================

  if (
    !Array.isArray(cartIds) ||
    cartIds.length === 0
  ) {

    return {
      statusCode: 400,
      body: "購物車是空的"
    };

  }


  const products = [];


  for (const productId of cartIds) {

    const product =
      PRODUCTS[productId];


    if (!product) {

      return {
        statusCode: 400,
        body:
          `找不到商品：${productId}`
      };

    }


    products.push(product);

  }


  // =========================
// 後端自己計算總價
// 單款 199
// 每滿 3 款 500
// =========================

const quantity =
  products.length;

/* 有幾組三款 */

const bundleCount =
  Math.floor(quantity / 3);

/* 剩下幾款 */

const remainingCount =
  quantity % 3;

/* 最終付款金額 */

const totalAmount =
  (bundleCount * 500) +
  (remainingCount * 199);

  // 綠界 ItemName 多商品用 # 分隔
  const itemName =
    products
      .map(
        (product) =>
          product.name
      )
      .join("#");


  // =========================
  // 建立訂單編號
  // =========================

  const now =
    new Date();


  const merchantTradeNo =
    "MEIER" +
    now
      .getFullYear()
      .toString()
      .slice(-2) +
    String(
      now.getMonth() + 1
    ).padStart(2, "0") +
    String(
      now.getDate()
    ).padStart(2, "0") +
    String(
      now.getHours()
    ).padStart(2, "0") +
    String(
      now.getMinutes()
    ).padStart(2, "0") +
    String(
      now.getSeconds()
    ).padStart(2, "0");


  // =========================
  // 綠界付款參數
  // =========================

  const params = {

    MerchantID:
      MERCHANT_ID,

    MerchantTradeNo:
      merchantTradeNo,

    MerchantTradeDate:
      formatDate(now),

    PaymentType:
      "aio",

    TotalAmount:
      totalAmount,

    TradeDesc:
      "MEIER FILTER",

    ItemName:
      itemName,

    ReturnURL:
      "https://www.ecpay.com.tw/receive.php",

    OrderResultURL:
      "https://lighthearted-fudge-ce47e4.netlify.app/payment-success.html",

    ChoosePayment:
      "Credit",

    EncryptType:
      1
  };


  params.CheckMacValue =
    generateCheckMacValue(params);


  // =========================
  // 建立送往綠界的 Form
  // =========================

  const inputs =
    Object.entries(params)
      .map(
        ([key, value]) =>
          `<input
            type="hidden"
            name="${escapeHtml(key)}"
            value="${escapeHtml(value)}"
          >`
      )
      .join("");


  const html = `
<!DOCTYPE html>

<html lang="zh-Hant">

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>
    前往綠界付款
  </title>

</head>


<body>

  <p>
    正在前往綠界安全付款頁...
  </p>


  <form
    id="ecpay-form"
    method="POST"
    action="https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5"
  >

    ${inputs}

  </form>


  <script>

    document
      .getElementById(
        "ecpay-form"
      )
      .submit();

  </script>

</body>

</html>
`;


  return {

    statusCode: 200,

    headers: {
      "Content-Type":
        "text/html; charset=utf-8"
    },

    body: html

  };

};