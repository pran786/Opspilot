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
import React, { useCallback, useRef } from 'react';

const MAX_FILE_SIZE = 100 * 1024; // 100 KB

interface ImageUploadControlProps {
    value: string;
    onChange: (value: string) => void;
}

/**
 * Custom control that lets users upload an image file (PNG, SVG, JPG, etc.)
 * and stores it as a base64 data URL in the chart form data.
 */
export default function ImageUploadControl({ value, onChange }: ImageUploadControlProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            if (file.size > MAX_FILE_SIZE) {
                alert(`Image too large (${(file.size / 1024).toFixed(0)} KB). Maximum is 100 KB.`);
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                onChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        },
        [onChange],
    );

    const handleClear = useCallback(() => {
        onChange('');
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }, [onChange]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
                ref={inputRef}
                type="file"
                accept="image/png,image/svg+xml,image/jpeg,image/gif,image/webp"
                onChange={handleFile}
                style={{
                    fontSize: 12,
                    padding: '4px 0',
                }}
            />
            {value && (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: 8,
                        border: '1px solid #e0e0e0',
                        borderRadius: 4,
                        background: '#fafafa',
                    }}
                >
                    <img
                        src={value}
                        alt="Uploaded icon"
                        style={{
                            maxWidth: 40,
                            maxHeight: 40,
                            objectFit: 'contain',
                        }}
                    />
                    <span style={{ fontSize: 11, color: '#666', flex: 1 }}>
                        Image uploaded ({(value.length / 1024).toFixed(1)} KB)
                    </span>
                    <button
                        type="button"
                        onClick={handleClear}
                        style={{
                            fontSize: 11,
                            padding: '2px 8px',
                            border: '1px solid #ccc',
                            borderRadius: 3,
                            background: '#fff',
                            cursor: 'pointer',
                            color: '#c00',
                        }}
                    >
                        Remove
                    </button>
                </div>
            )}
        </div>
    );
}
