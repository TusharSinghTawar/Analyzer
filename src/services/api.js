import axios from "axios";

const PROXY_URL = "http://localhost:8080/proxy";
const BASE_URL = "https://data.ovh.pandonia-global-network.org/";
const axiosConfig = {
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
      Connection: "keep-alive",
      "Content-Type": "application/json",
      Cookie: "ext_name=ojplmecpdpgccookcobabopnaifgidhf",
      DNT: "1",
      Host: "127.0.0.1:8050",
      Referer: "http://127.0.0.1:8050/",
      "Sec-CH-UA": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      "Sec-CH-UA-Mobile": "?1",
      "Sec-CH-UA-Platform": '"Android"',
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "Sec-GPC": "1",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
      "X-CSRFToken": "undefined", // You can dynamically update this if needed
    },
  };


export const fetchLocations = async (setLocations) => {
  try {
    const response = await axios.get(`${PROXY_URL}?url=${encodeURIComponent(BASE_URL)}`);
    const links = parseHTML(response.data);
    console.log(`this is fata ${response.data.length} links found and this is fata ${response.data}`);
    
    setLocations(response.data);
  } catch (error) {
    console.error("Error fetching locations:", error);
  }
};

export const fetchDevices = async (location, setDevices) => {
  try {
    const response = await axios.get(`${PROXY_URL}?url=${encodeURIComponent(`${BASE_URL}${location}/`)}`);
    
    
    setDevices(response.data);
  } catch (error) {
    console.error("Error fetching devices:", error);
  }
};

export const fetchFiles = async (location, device, setFiles) => {
  try {
    const response = await axios.get(`${PROXY_URL}?url=${encodeURIComponent(`${BASE_URL}${location}/${device}/L2/`)}`);
    const links = parseHTML(response.data);
    setFiles(response.data);
  } catch (error) {
    console.error("Error fetching files:", error);
  }
};

export const fetchFileData = async (file, setChartData) => {
  try {
    const response = await axios.get(`${PROXY_URL}?url=${encodeURIComponent(file)}`,axiosConfig);
    const lines = response.data.split("\n").filter((line) => line.trim());
    const labels = lines.map((line) => line.split(" ")[0]);
    const data = lines.map((line) => parseFloat(line.split(" ")[1]));
    setChartData({ labels, datasets: [{ label: "Data", data, borderColor: "rgba(75,192,192,1)" }] });
  } catch (error) {
    console.error("Error fetching file data:", error);
  }
};

const parseHTML = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return Array.from(doc.querySelectorAll("a"))
    .map((link) => link.getAttribute("href"))
    .filter((href) => href && href.startsWith("./"))
    .map((href) => href.replace("./", ""));
};
