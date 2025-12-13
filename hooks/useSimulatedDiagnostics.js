import { useState, useEffect } from 'react';
import errorCodes from '../data/errorCodes.json';

export default function useSimulatedDiagnostics() {
  const [severityCounts, setSeverityCounts] = useState({});
  const [telemetry, setTelemetry] = useState({ pressure: 0, voltage: 0, temperature: 0 });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Random severity counts
      const services = ['Generator', 'PowerWizard', 'DeepSea'];
      const newCounts = {};
      services.forEach(service => {
        newCounts[service] = {
          HIGH: Math.floor(Math.random() * 10),
          MED: Math.floor(Math.random() * 10),
          LOW: Math.floor(Math.random() * 10),
        };
      });

      // Random telemetry values
      const newTelemetry = {
        pressure: Math.floor(Math.random() * 100),
        voltage: 200 + Math.floor(Math.random() * 40),
        temperature: Math.floor(Math.random() * 100),
      };

      // Random error codes
      const randomErrors = errorCodes
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);

      setSeverityCounts(newCounts);
      setTelemetry(newTelemetry);
      setErrors(randomErrors);
    }, 5000); // update every 5s

    return () => clearInterval(interval);
  }, []);

  return { severityCounts, telemetry, errors };
}
import useSimulatedDiagnostics from '../hooks/useSimulatedDiagnostics';
