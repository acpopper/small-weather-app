export const formatCityName = (city) => {
  if (typeof city !== "string") return city;
  return city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
};
