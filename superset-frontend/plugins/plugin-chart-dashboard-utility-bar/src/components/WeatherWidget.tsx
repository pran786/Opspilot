/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React, { useState, useEffect, useRef } from 'react';

interface WeatherData {
    temperature: number;
    description: string;
}

/**
 * Inline SVG weather icons — clean rendering on any background,
 * no emoji borders, fully scalable via the size prop.
 */
// const WeatherIcon: React.FC<{ description: string; size: number; color?: string }> = ({
//     description,
//     size,
//     color = 'currentColor',
// }) => {
//     const svgProps = {
//         width: size,
//         height: size,
//         viewBox: '0 0 24 24',
//         fill: 'none',
//         stroke: color,
//         strokeWidth: 2,
//         strokeLinecap: 'round' as const,
//         strokeLinejoin: 'round' as const,
//         style: { flexShrink: 0, display: 'block' } as React.CSSProperties,
//     };

//     const desc = description.toLowerCase();

//     // Clear / Sunny
//     if (desc.includes('sunny') || desc.includes('clear')) {
//         return (
//             <svg {...svgProps}>
//                 <circle cx="12" cy="12" r="5" fill={color} stroke="none" />
//                 <line x1="12" y1="1" x2="12" y2="3" />
//                 <line x1="12" y1="21" x2="12" y2="23" />
//                 <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
//                 <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
//                 <line x1="1" y1="12" x2="3" y2="12" />
//                 <line x1="21" y1="12" x2="23" y2="12" />
//                 <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
//                 <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
//             </svg>
//         );
//     }

//     // Partly cloudy
//     if (desc.includes('partly') || desc.includes('overcast')) {
//         return (
//             <svg {...svgProps}>
//                 <path d="M12 2v2" />
//                 <path d="M4.93 4.93l1.41 1.41" />
//                 <path d="M20 12h2" />
//                 <circle cx="12" cy="10" r="4" fill={color} stroke="none" opacity={0.6} />
//                 <path d="M8 16a5 5 0 0 1 9.9-1H19a3 3 0 1 1 0 6H7a4 4 0 0 1-1-7.9" fill={color} stroke="none" opacity={0.8} />
//             </svg>
//         );
//     }

//     // Rain / Drizzle
//     if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('shower')) {
//         return (
//             <svg {...svgProps}>
//                 <path d="M8 13a5 5 0 0 1 9.9-1H19a3 3 0 1 1 0 6H7a4 4 0 0 1-1-7.9" fill={color} stroke="none" opacity={0.7} />
//                 <line x1="8" y1="21" x2="8" y2="23" />
//                 <line x1="12" y1="21" x2="12" y2="23" />
//                 <line x1="16" y1="21" x2="16" y2="23" />
//             </svg>
//         );
//     }

//     // Snow
//     if (desc.includes('snow') || desc.includes('sleet') || desc.includes('ice')) {
//         return (
//             <svg {...svgProps}>
//                 <path d="M8 13a5 5 0 0 1 9.9-1H19a3 3 0 1 1 0 6H7a4 4 0 0 1-1-7.9" fill={color} stroke="none" opacity={0.7} />
//                 <circle cx="8" cy="22" r="1" fill={color} stroke="none" />
//                 <circle cx="12" cy="22" r="1" fill={color} stroke="none" />
//                 <circle cx="16" cy="22" r="1" fill={color} stroke="none" />
//             </svg>
//         );
//     }

//     // Fog / Mist / Haze
//     if (desc.includes('fog') || desc.includes('mist') || desc.includes('haze')) {
//         return (
//             <svg {...svgProps}>
//                 <path d="M4 12h16" />
//                 <path d="M4 8h12" />
//                 <path d="M6 16h14" />
//                 <path d="M8 20h8" />
//             </svg>
//         );
//     }

//     // Thunder
//     if (desc.includes('thunder')) {
//         return (
//             <svg {...svgProps}>
//                 <path d="M8 13a5 5 0 0 1 9.9-1H19a3 3 0 1 1 0 6H7a4 4 0 0 1-1-7.9" fill={color} stroke="none" opacity={0.7} />
//                 <polyline points="13 20 11 23 15 23 13 26" stroke={color} strokeWidth={2} fill="none" />
//             </svg>
//         );
//     }

//     // Default: Cloudy
//     return (
//         <svg {...svgProps}>
//             <path d="M8 13a5 5 0 0 1 9.9-1H19a3 3 0 1 1 0 6H7a4 4 0 0 1-1-7.9" fill={color} stroke="none" opacity={0.7} />
//         </svg>
//     );
// };

const WeatherIcon: React.FC<{ description: string; size: number; color?: string }> = ({
    description,
    size,
    color = 'currentColor'
}) => {
    const desc = description.toLowerCase();
    const id = Math.random().toString(36).slice(2, 8); // unique gradient IDs

    // Clear / Sunny
    if (desc.includes('sunny') || desc.includes('clear')) {
        return (
            <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ flexShrink: 0, display: 'block' }}>
                <defs>
                    <radialGradient id={`sun-${id}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FFF176" />
                        <stop offset="60%" stopColor="#FFD600" />
                        <stop offset="100%" stopColor="#FF8F00" />
                    </radialGradient>
                </defs>
                {/* Rays */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                    const rad = (angle * Math.PI) / 180;
                    const x1 = 32 + Math.cos(rad) * 18;
                    const y1 = 32 + Math.sin(rad) * 18;
                    const x2 = 32 + Math.cos(rad) * 27;
                    const y2 = 32 + Math.sin(rad) * 27;
                    return (
                        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                            stroke="#FFD600" strokeWidth="3.5" strokeLinecap="round" />
                    );
                })}
                {/* Sun core */}
                <circle cx="32" cy="32" r="14" fill={`url(#sun-${id})`} />
                <circle cx="28" cy="28" r="3" fill="rgba(255,255,255,0.35)" />
            </svg>
        );
    }

    // Partly cloudy
    if (desc.includes('partly') || desc.includes('overcast')) {
        return (
            <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ flexShrink: 0, display: 'block' }}>
                <defs>
                    <radialGradient id={`sun2-${id}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FFF9C4" />
                        <stop offset="100%" stopColor="#FFD600" />
                    </radialGradient>
                    <linearGradient id={`cloud-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ECEFF1" />
                        <stop offset="100%" stopColor="#B0BEC5" />
                    </linearGradient>
                </defs>
                {/* Sun rays */}
                {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                    const rad = (angle * Math.PI) / 180;
                    const x1 = 22 + Math.cos(rad) * 12;
                    const y1 = 22 + Math.sin(rad) * 12;
                    const x2 = 22 + Math.cos(rad) * 18;
                    const y2 = 22 + Math.sin(rad) * 18;
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke="#FFD600" strokeWidth="2.5" strokeLinecap="round" />;
                })}
                <circle cx="22" cy="22" r="10" fill={`url(#sun2-${id})`} />
                {/* Cloud */}
                <path d="M18 44 a10 10 0 0 1 0-20 a6 6 0 0 1 11.8-1.5A8 8 0 1 1 46 38H18z"
                    fill={`url(#cloud-${id})`} />
                <circle cx="25" cy="30" r="3" fill="rgba(255,255,255,0.5)" />
            </svg>
        );
    }

    // Rain / Drizzle / Shower
    if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('shower')) {
        return (
            <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ flexShrink: 0, display: 'block' }}>
                <defs>
                    <linearGradient id={`raincloud-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#78909C" />
                        <stop offset="100%" stopColor="#455A64" />
                    </linearGradient>
                </defs>
                {/* Cloud */}
                <path d="M12 36 a12 12 0 0 1 0-24 a8 8 0 0 1 15.5-2A10 10 0 1 1 52 30H12z"
                    fill={`url(#raincloud-${id})`} />
                <circle cx="22" cy="22" r="4" fill="rgba(255,255,255,0.2)" />
                {/* Rain drops */}
                {[16, 24, 32, 40, 48].map((x, i) => (
                    <g key={i}>
                        <line x1={x} y1={44 + (i % 2) * 4} x2={x - 3} y2={52 + (i % 2) * 4}
                            stroke="#29B6F6" strokeWidth="2.5" strokeLinecap="round" />
                    </g>
                ))}
                {[20, 28, 36, 44].map((x, i) => (
                    <line key={`r2-${i}`} x1={x} y1={52 + (i % 2) * 3} x2={x - 3} y2={58 + (i % 2) * 3}
                        stroke="#0288D1" strokeWidth="2" strokeLinecap="round" />
                ))}
            </svg>
        );
    }

    // Snow
    if (desc.includes('snow') || desc.includes('sleet') || desc.includes('ice')) {
        return (
            <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ flexShrink: 0, display: 'block' }}>
                <defs>
                    <linearGradient id={`snowcloud-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#CFD8DC" />
                        <stop offset="100%" stopColor="#90A4AE" />
                    </linearGradient>
                </defs>
                {/* Cloud */}
                <path d="M12 34 a12 12 0 0 1 0-24 a8 8 0 0 1 15.5-2A10 10 0 1 1 52 28H12z"
                    fill={`url(#snowcloud-${id})`} />
                <circle cx="22" cy="20" r="4" fill="rgba(255,255,255,0.3)" />
                {/* Snowflakes */}
                {[18, 32, 46].map((x, i) => {
                    const y = 46 + (i % 2) * 6;
                    return (
                        <g key={i}>
                            <line x1={x} y1={y - 6} x2={x} y2={y + 6} stroke="#B3E5FC" strokeWidth="2" strokeLinecap="round" />
                            <line x1={x - 5} y1={y - 3} x2={x + 5} y2={y + 3} stroke="#B3E5FC" strokeWidth="2" strokeLinecap="round" />
                            <line x1={x + 5} y1={y - 3} x2={x - 5} y2={y + 3} stroke="#B3E5FC" strokeWidth="2" strokeLinecap="round" />
                            <circle cx={x} cy={y} r="1.5" fill="#81D4FA" />
                        </g>
                    );
                })}
            </svg>
        );
    }

    // Fog / Mist / Haze
    if (desc.includes('fog') || desc.includes('mist') || desc.includes('haze')) {
        return (
            <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ flexShrink: 0, display: 'block' }}>
                <defs>
                    <linearGradient id={`fog-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#B0BEC5" stopOpacity="0" />
                        <stop offset="20%" stopColor="#B0BEC5" />
                        <stop offset="80%" stopColor="#90A4AE" />
                        <stop offset="100%" stopColor="#90A4AE" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {[12, 22, 32, 42, 52].map((y, i) => (
                    <rect key={i}
                        x={i % 2 === 0 ? 6 : 10}
                        y={y}
                        width={i % 2 === 0 ? 52 : 44}
                        height="5"
                        rx="2.5"
                        fill={`url(#fog-${id})`}
                        opacity={1 - i * 0.1}
                    />
                ))}
            </svg>
        );
    }

    // Thunder / Lightning
    if (desc.includes('thunder')) {
        return (
            <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ flexShrink: 0, display: 'block' }}>
                <defs>
                    <linearGradient id={`stormcloud-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#546E7A" />
                        <stop offset="100%" stopColor="#263238" />
                    </linearGradient>
                    <linearGradient id={`bolt-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFF176" />
                        <stop offset="100%" stopColor="#FFD600" />
                    </linearGradient>
                    <filter id={`glow-${id}`}>
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>
                {/* Cloud */}
                <path d="M10 36 a12 12 0 0 1 0-24 a8 8 0 0 1 15.5-2A10 10 0 1 1 50 30H10z"
                    fill={`url(#stormcloud-${id})`} />
                <circle cx="20" cy="22" r="3" fill="rgba(255,255,255,0.1)" />
                {/* Lightning bolt */}
                <path d="M34 38 L28 50 L34 50 L26 64 L42 46 L35 46 L40 38 Z"
                    fill={`url(#bolt-${id})`}
                    filter={`url(#glow-${id})`} />
            </svg>
        );
    }

    // Default: Cloudy
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ flexShrink: 0, display: 'block' }}>
            <defs>
                <linearGradient id={`defcloud-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ECEFF1" />
                    <stop offset="100%" stopColor="#90A4AE" />
                </linearGradient>
            </defs>
            <path d="M10 42 a14 14 0 0 1 2-28 a10 10 0 0 1 19-2A12 12 0 1 1 54 36H10z"
                fill={`url(#defcloud-${id})`} />
            <circle cx="22" cy="24" r="5" fill="rgba(255,255,255,0.4)" />
        </svg>
    );
};


interface WeatherWidgetProps {
    iconSize?: number;
    showTemperature?: boolean;
    temperatureFontSize?: number;
}

/**
 * Self-contained weather widget using the wttr.in API (free, no API key required).
 *
 * - Fetches user location via browser Geolocation API on mount.
 * - Calls wttr.in for current weather (temperature + description).
 * - Refreshes every 10 minutes.
 * - Properly cleans up interval on unmount.
 * - Uses inline SVG icons for clean rendering on all backgrounds.
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
        fetch(
            `https://wttr.in/${lat},${lon}?format=j1`,
            { headers: { Accept: 'application/json' } },
        )
            .then((res) => {
                if (!res.ok) throw new Error('Weather API error');
                return res.json();
            })
            .then((data) => {
                const current = data?.current_condition?.[0];
                if (current) {
                    setWeather({
                        temperature: parseInt(current.temp_F, 10),
                        description: current.weatherDesc?.[0]?.value ?? 'Cloudy',
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
            }, 600000); // Refresh every 10 minutes
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
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
        return <WeatherIcon description="cloudy" size={iconSize} />;
    }

    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                flexShrink: 0,
            }}
        >
            <WeatherIcon description={weather.description} size={iconSize} />
            {showTemperature !== false && (
                <span style={{ fontSize: temperatureFontSize, fontWeight: 500 }}>
                    {weather.temperature}°F
                </span>
            )}
        </span>
    );
};

export default WeatherWidget;
