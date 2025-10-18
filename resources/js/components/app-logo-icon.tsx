import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Phone Book Icon - Green background with phone symbol and colored tabs */}
            <g>
                {/* Book cover - green background */}
                <rect
                    x="80"
                    y="24"
                    width="352"
                    height="464"
                    rx="32"
                    ry="32"
                    fill="#4ADE80"
                    stroke="#000"
                    strokeWidth="16"
                />

                {/* Book spine binding rings */}
                <circle cx="64" cy="120" r="16" fill="#000" />
                <circle cx="64" cy="200" r="16" fill="#000" />
                <circle cx="64" cy="280" r="16" fill="#000" />
                <circle cx="64" cy="360" r="16" fill="#000" />
                <circle cx="64" cy="440" r="16" fill="#000" />

                {/* Colored tabs on the right */}
                <rect x="432" y="176" width="32" height="48" fill="#FF1744" />
                <rect x="432" y="232" width="32" height="48" fill="#2196F3" />
                <rect x="432" y="288" width="32" height="48" fill="#FF9800" />

                {/* Phone icon */}
                <path
                    d="M 160 140 Q 165 135 175 150 L 200 190 Q 205 200 195 210 L 180 225 Q 175 230 180 240 Q 200 280 240 300 Q 250 305 255 300 L 270 285 Q 280 275 290 280 L 330 305 Q 345 315 340 320 L 325 345 Q 315 360 295 355 Q 240 340 190 280 Q 130 220 115 165 Q 110 145 125 135 Z"
                    fill="#FFF"
                    stroke="#000"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
        </svg>
    );
}
