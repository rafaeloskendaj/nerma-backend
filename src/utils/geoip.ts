import axios from "axios";

export async function lookupCountryByIP(ip: string) {
  try {
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    const country = response.data.country_name;
    const currency = response.data.currency;

    return { country, currency };
  } catch (error) {
    console.error("IP Geolocation error:", error.message);
    return { country: "Unknown", currency: "USD" };
  }
};
