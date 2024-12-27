import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { fetchLocations, fetchDevices, fetchFiles, fetchFileData } from "./services/api";

const App = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    fetchLocations(setLocations);
  }, []);

  useEffect(() => {
    if (selectedLocation) fetchDevices(selectedLocation, setDevices);
  }, [selectedLocation]);

  useEffect(() => {
    if (selectedDevice) fetchFiles(selectedLocation, selectedDevice, setFiles);
  }, [selectedDevice]);

  const handleFileSelection = async (file) => {
    setSelectedFile(file);
    await fetchFileData(file, setChartData);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Data Dashboard</h1>
      {/* Location Dropdown */}
      <div className="mb-4">
        <label htmlFor="location-select" className="block text-sm font-medium">
          Select Location:
        </label>
        <select
          id="location-select"
          name="location"
          className="block w-full mt-1 p-2 border rounded"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="">Choose a location</option>
          {locations.map((loc) => (
            <option key={loc.name} value={loc.name}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Device Dropdown */}
      <div className="mb-4">
        <label htmlFor="device-select" className="block text-sm font-medium">
          Select Device:
        </label>
        <select
          id="device-select"
          name="device"
          className="block w-full mt-1 p-2 border rounded"
          value={selectedDevice}
          onChange={(e) => setSelectedDevice(e.target.value)}
        >
          <option value="">Choose a device</option>
          {devices.map((device) => (
            <option key={device.name} value={device.name}>
              {device.name}
            </option>
          ))}
        </select>
      </div>

      {/* File Dropdown */}
      <div className="mb-4">
        <label htmlFor="file-select" className="block text-sm font-medium">
          Select File:
        </label>
        <select
          id="file-select"
          name="file"
          className="block w-full mt-1 p-2 border rounded"
          value={selectedFile}
          onChange={(e) => handleFileSelection(e.target.value)}
        >
          <option value="">Choose a file</option>
          {files.map((file) => (
            <option key={file.name} value={file.name}>
              {file.name}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div className="my-6">
        <h2 className="text-lg font-semibold mb-2">Chart</h2>
        {chartData.labels ? <Line data={chartData} /> : <p>Select a file to display data.</p>}
      </div>
    </div>
  );
};

export default App;
