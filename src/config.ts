let API_URL = "";

if (process.env.NODE_ENV === "development") {
  API_URL = "http://localhost:5500";
} else {
  API_URL = "https://44.223.210.158:5500";
}

export { API_URL };
