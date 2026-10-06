/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.
 */

import React, { useState, useEffect, useRef } from 'react';

interface WeatherData {
  temperature: number;
  weatherCode: number;
}

const SunCloudSvg: React.FC<{ size: number; color?: string }> = ({
  size,
  color = '#FFFFFF',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    {/* Sun with rays in background */}
    <circle cx="25" cy="11" r="4.5" fill={color} />
    <line
      x1="25"
      y1="3"
      x2="25"
      y2="5"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <line
      x1="30.5"
      y1="5.5"
      x2="29"
      y2="7"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <line
      x1="33"
      y1="11"
      x2="31"
      y2="11"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <line
      x1="19.5"
      y1="5.5"
      x2="21"
      y2="7"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    {/* Cloud in foreground */}
    <path
      d="M10 27 C7.2 27 5 24.8 5 22 C5 19.5 6.9 17.4 9.4 17.1 C10.4 13.6 13.8 11 18 11 C22.6 11 26.3 14.4 26.8 19 C29.1 19.4 31 21.4 31 23.8 C31 26.1 29.2 27 27 27 Z"
      fill={color}
    />
  </svg>
);

/**
 * Weather Icon Renderer - uses vector SVG matching reference mockup
 */
const WeatherIcon: React.FC<{ code: number; size: number }> = ({ size }) => {
  return <SunCloudSvg size={size} color="#FFFFFF" />;
};

interface WeatherWidgetProps {
  iconSize?: number;
  showTemperature?: boolean;
  temperatureFontSize?: number;
}

/**
 * Weather Widget (Fahrenheit + emoji icons)
 */
const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  iconSize = 18,
  showTemperature = true,
  temperatureFontSize = 13,
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchWeather = (lat?: number, lon?: number) => {
    const url =
      lat !== undefined && lon !== undefined
        ? `https://wttr.in/${lat},${lon}?format=j1`
        : `https://wttr.in/?format=j1`;
    fetch(url, {
      headers: { Accept: 'application/json' },
    })
      .then(res => {
        if (!res.ok) throw new Error('Weather API error');
        return res.json();
      })
      .then(data => {
        const current = data?.current_condition?.[0];
        if (current) {
          setWeather({
            temperature: parseInt(current.temp_F, 10), // Fahrenheit
            weatherCode: parseInt(current.weatherCode, 10),
          });
          setError(false);
        }
      })
      .catch(() => {
        setError(true);
      });
  };

  useEffect(() => {
    const startFetching = (latitude?: number, longitude?: number) => {
      fetchWeather(latitude, longitude);

      intervalRef.current = setInterval(() => {
        fetchWeather(latitude, longitude);
      }, 600000); // refresh every 10 minutes
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          startFetching(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Fallback to IP-based geolocation
          startFetching();
        },
        { timeout: 5000 },
      );
    } else {
      // Fallback to IP-based geolocation
      startFetching();
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (error || !weather) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <WeatherIcon code={0} size={iconSize} />
      </span>
    );
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10, // slightly increased spacing
        flexShrink: 0,
      }}
    >
      <WeatherIcon code={weather.weatherCode} size={iconSize} />

      {showTemperature !== false && (
        <span
          style={{
            fontSize: temperatureFontSize,
            fontWeight: 400,
            marginLeft: 4,
          }}
        >
          {weather.temperature}°F
        </span>
      )}
    </span>
  );
};

export default WeatherWidget;
