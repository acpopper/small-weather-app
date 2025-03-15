import citiesData from "../assets/cities_20000.csv?raw";

// Parse CSV data and create a searchable array of cities
const cities = citiesData
  .split("\n")
  .slice(1) // Skip header row
  .map((line) => {
    const [id, name, state, country, country_full, lat, lng] = line.split(",");
    return {
      id: parseInt(id),
      name,
      state: state.replace(/"/g, ""),
      country: country.replace(/"/g, ""),
      country_full: country_full.replace(/"/g, ""),
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };
  })
  .filter((city) => city.name && city.country); // Filter out any invalid entries

// Search cities based on input string
export const searchCities = (searchTerm, limit = 5) => {
  if (!searchTerm) return [];

  const normalizedSearch = searchTerm.toLowerCase();

  return cities
    .filter((city) => {
      const cityName = `${city.name}, ${city.country}`.toLowerCase();
      return cityName.includes(normalizedSearch);
    })
    .slice(0, limit)
    .map((city) => ({
      id: city.id,
      name: city.name,
      fullName: `${city.name}, ${city.country}`,
      country: city.country,
    }));
};
