
const PRODUCTS = [
  {
    id: "creamy-day",
    name: "CREAMY DAY",
    chineseName: "奶油日光",
    price: 150,
    image: "images/creamy-day.jpg"
  },
  {
    id: "color-breeze",
    name: "COLOR BREEZE",
    chineseName: "晴彩微風",
    price: 150,
    image: "images/color-breeze.jpg"
  },
  {
    id: "golden-day",
    name: "GOLDEN DAY",
    chineseName: "金色日光",
    price: 150,
    image: "images/golden-day-product.png"
  },
  {
    id: "disney-day",
    name: "DISNEY DAY",
    chineseName: "迪士尼日光",
    price: 150,
    image: "images/disney-day-product.jpg"
  },
  {
    id: "cream-haze",
    name: "CREAM HAZE",
    chineseName: "奶霜薄霧",
    price: 150,
    image: "images/cream-haze-product.jpg"
  },
  {
    id: "grey-haze",
    name: "GREY HAZE",
    chineseName: "灰霧冷調",
    price: 150,
    image: "images/grey-haze-product.jpg"
  },
  {
    id: "lilac-day",
    name: "LILAC DAY",
    chineseName: "丁香日光",
    price: 150,
    image: "images/lilac-day-product.jpg"
  },
  {
    id: "maple-day",
    name: "MAPLE DAY",
    chineseName: "楓糖日光",
    price: 150,
    image: "images/maple-day-product.jpg"
  },
  {
    id: "milky-sage",
    name: "MILKY SAGE",
    chineseName: "青乳奶蓋",
    price: 150,
    image: "images/milky-sage/cover.jpg"
  },
  {
    id: "cocoa-caramel",
    name: "COFFEE CARAMEL",
    chineseName: "可可焦糖",
    price: 150,
    image: "images/cocoa-caramel/cover.jpg"
  }
];

// 商品圖片路徑
PRODUCTS.forEach(function(product) {
  product.cover = product.image;
  product.before = `images/${product.id}/before.jpg`;
  product.after = `images/${product.id}/after.jpg`;
});
