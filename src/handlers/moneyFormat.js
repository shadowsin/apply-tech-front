export const moneyFormat = (price) => {
  const money = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
  return money;
};
