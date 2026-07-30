import './App.css';
import GaugeChart from 'react-gauge-chart';
import { useState, useEffect } from 'react';

function App() {
  const [theft, setTheft] = useState(false);
  const [current, setCurrent] = useState(0);
  const [voltage, setVoltage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://192.168.188.68:80/voltage')
        .then((response) => response.json())
        .then((data) => {
          setVoltage(parseFloat(data.toFixed(2)));
        });

      fetch('http://192.168.188.68:80/current')
        .then((response) => response.json())
        .then((data) => {
          const value = parseFloat(data);
          setCurrent(isNaN(value) ? 0 : parseFloat(value.toFixed(2)));
        });

      fetch('http://192.168.188.68:80/theft')
        .then((response) => response.json())
        .then((data) => {
          setTheft(data.theft);
        });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <h1 className="title">Smart Meter</h1>

      <div className="gauges-container">
        <div className="gauge">
          <GaugeChart
            id="current-gauge"
            nrOfLevels={3}
            colors={['#5BE12C', '#F5CD19', '#EA4228']}
            arcWidth={0.2}
            percent={Math.min(current / 100, 1)}
            formatTextValue={() => `${current} A`}
          />
          <h2>Current</h2>
        </div>

        <div className="gauge">
          <GaugeChart
            id="voltage-gauge"
            nrOfLevels={3}
            colors={['#5BE12C', '#F5CD19', '#EA4228']}
            arcWidth={0.2}
            percent={Math.min(voltage / 300, 1)}
            formatTextValue={() => `${voltage} V`}
          />
          <h2>Voltage</h2>
        </div>
      </div>

      {theft && <div className="theft">⚠ Theft Detected!</div>}
    </div>
  );
}

export default App;
