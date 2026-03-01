/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.
 */

import React, { useState, useEffect, useRef } from 'react';

interface WeatherData {
    temperature: number;
    weatherCode: number;
}

/**
 * Your exact emoji mapping — unchanged
 */
const getWeatherIcon = (code: number): string => {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 49) return '🌫️';
    if (code <= 59) return '🌧️';
    if (code <= 69) return '🌨️';
    if (code <= 79) return '🌨️';
    if (code <= 84) return '🌧️';
    if (code <= 94) return '⛈️';
    return '🌩️';
};

/**
 * Simple Emoji Icon Renderer
 */
const WeatherIcon: React.FC<{ code: number; size: number }> = ({
    code,
    size,
}) => {
    return (
        <span
            style={{
                fontSize: size,
                lineHeight: 1,
                display: 'inline-flex',
                alignItems: 'center',
            }}
        >
            {getWeatherIcon(code)}
        </span>
    );
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

    const fetchWeather = (lat: number, lon: number) => {
        fetch(`https://wttr.in/${lat},${lon}?format=j1`, {
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
        let lat = 28.6139; // Default: New Delhi
        let lon = 77.209;

        const startFetching = (latitude: number, longitude: number) => {
            fetchWeather(latitude, longitude);

            intervalRef.current = setInterval(() => {
                fetchWeather(latitude, longitude);
            }, 600000); // refresh every 10 minutes
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    lat = position.coords.latitude;
                    lon = position.coords.longitude;
                    startFetching(lat, lon);
                },
                () => {
                    startFetching(lat, lon);
                },
                { timeout: 5000 },
            );
        } else {
            startFetching(lat, lon);
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