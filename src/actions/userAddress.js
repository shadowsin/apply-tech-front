export const address = (address) => {
  const addr =
    (address?.house ? address.house + " " : "") +
    (address?.street ? address.street + " " : "") +
    (address?.ward ? address.ward + " " : "") +
    (address?.district ? address.district + " " : "") +
    (address?.province ? address.province : "");

  return addr;
};
