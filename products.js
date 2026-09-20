const PRODUCTS = [

  {
    id: "maple-day",
    name: "MAPLE DAY",
    chineseName: "楓糖日光",
    price: 199
  },

  {
    id: "lilac-day",
    name: "LILAC DAY",
    chineseName: "丁香日光",
    price: 199
  },
{
  id: "lishuan-sky",
  name: "LISHUAN SKY",
  chineseName: "李萱日光",
  price: 199,
  description: "清透明亮的藍天色調，保留自然光感與乾淨氛圍。",
  suitable: "風景・旅行・日常"
},
{
  id: "milky-sage",
  name: "MILKY SAGE",
  chineseName: "Milky Sage",
  price: 199,
  description: "清透明亮的藍天色調，保留自然光感與乾淨氛圍。",
  suitable: "風景・旅行・日常"
},

];


/* =========================
   自動產生圖片路徑
========================= */

PRODUCTS.forEach(product => {

  product.cover =
    `images/${product.id}/cover.jpg`;

  product.before =
    `images/${product.id}/before.jpg`;

  product.after =
    `images/${product.id}/after.jpg`;

});