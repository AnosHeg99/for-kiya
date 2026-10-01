import React from 'react';
import { SeasonId, SEASONS_CONFIG } from '../data/config';

interface ElementalWaxSealProps {
  season: SeasonId;
  isUnsealing: boolean;
  onClick: (e: React.MouseEvent) => void;
  size?: 'md' | 'lg';
}

export const ElementalWaxSeal: React.FC<ElementalWaxSealProps> = ({
  season,
  isUnsealing,
  onClick,
  size = 'md',
}) => {
  const currentConfig = SEASONS_CONFIG[season];

  return (
    <div
      id="center-wax-seal-core"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Buka Segel Elemen ${currentConfig.name}`}
      className={`group relative flex items-center justify-center cursor-pointer select-none transition-all duration-700 outline-none ${
        size === 'lg' ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-20 h-20 sm:w-24 sm:h-24'
      } ${
        isUnsealing
          ? 'scale-135 rotate-45 filter blur-[1px]'
          : 'hover:scale-115 active:scale-95'
      }`}
      style={{
        filter: `drop-shadow(0 0 25px ${currentConfig.sealGlowColor})`,
      }}
    >
      {/* Outer Rotating Elemental Magic Rings */}
      <div
        className={`absolute inset-[-8px] rounded-full border border-dashed pointer-events-none animate-spin ${
          season === 'semi'
            ? 'border-pink-300/80'
            : season === 'panas'
            ? 'border-amber-300/80'
            : season === 'gugur'
            ? 'border-orange-300/80'
            : 'border-cyan-300/80'
        }`}
        style={{ animationDuration: '14s' }}
      />
      <div
        className={`absolute inset-[-14px] rounded-full border pointer-events-none animate-ping opacity-40 ${
          season === 'semi'
            ? 'border-pink-400'
            : season === 'panas'
            ? 'border-amber-400'
            : season === 'gugur'
            ? 'border-orange-400'
            : 'border-cyan-400'
        }`}
      />

      {/* CUSTOM ELEMENTAL WAX SEAL SVG PER SEASONS */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full transform transition-transform duration-500 group-hover:rotate-6"
      >
        <defs>
          <radialGradient id={`sealGrad-${season}`} cx="35%" cy="30%" r="65%">
            {season === 'semi' && (
              <>
                <stop offset="0%" stopColor="#fdf2f8" />
                <stop offset="35%" stopColor="#f472b6" />
                <stop offset="75%" stopColor="#db2777" />
                <stop offset="100%" stopColor="#9d174d" />
              </>
            )}
            {season === 'panas' && (
              <>
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="35%" stopColor="#f59e0b" />
                <stop offset="75%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#92400e" />
              </>
            )}
            {season === 'gugur' && (
              <>
                <stop offset="0%" stopColor="#ffedd5" />
                <stop offset="35%" stopColor="#ea580c" />
                <stop offset="75%" stopColor="#c2410c" />
                <stop offset="100%" stopColor="#7c2d12" />
              </>
            )}
            {season === 'dingin' && (
              <>
                <stop offset="0%" stopColor="#f0f9ff" />
                <stop offset="35%" stopColor="#38bdf8" />
                <stop offset="75%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#075985" />
              </>
            )}
          </radialGradient>
        </defs>

        {/* 1. MUSIM SEMI (SPRING): 5-Petal Sakura Scalloped Wax Perimeter */}
        {season === 'semi' && (
          <g>
            <path
              d="M 50 12 C 58 10, 68 18, 66 28 C 76 27, 85 36, 80 46 C 89 54, 85 67, 76 72 C 80 82, 70 92, 59 88 C 52 95, 40 94, 37 86 C 26 89, 17 79, 21 69 C 12 63, 13 49, 22 43 C 18 33, 27 24, 37 26 C 40 16, 50 12, 50 12 Z"
              fill={`url(#sealGrad-${season})`}
              stroke="#fbcfe8"
              strokeWidth="2.5"
            />
            {/* Inner Sakura Blossom Relief */}
            <circle cx="50" cy="50" r="26" fill="none" stroke="#fdf2f8" strokeWidth="1.2" strokeDasharray="2,2" />
            <path
              d="M 50 32 C 53 38, 57 44, 50 50 C 43 44, 47 38, 50 32 Z"
              fill="#ffffff"
              opacity="0.85"
            />
            <path
              d="M 68 44 C 62 47, 56 46, 50 50 C 56 43, 62 40, 68 44 Z"
              fill="#ffffff"
              opacity="0.85"
            />
            <path
              d="M 61 65 C 57 60, 54 55, 50 50 C 57 52, 62 58, 61 65 Z"
              fill="#ffffff"
              opacity="0.85"
            />
            <path
              d="M 39 65 C 38 58, 43 52, 50 50 C 46 55, 43 60, 39 65 Z"
              fill="#ffffff"
              opacity="0.85"
            />
            <path
              d="M 32 44 C 38 40, 44 43, 50 50 C 44 46, 38 47, 32 44 Z"
              fill="#ffffff"
              opacity="0.85"
            />
            <circle cx="50" cy="50" r="5" fill="#fdf2f8" />
            <text
              x="50"
              y="54"
              textAnchor="middle"
              fill="#be185d"
              fontSize="12"
              fontWeight="900"
              fontFamily="'Noto Serif JP', serif"
            >
              桜
            </text>
          </g>
        )}

        {/* 2. MUSIM PANAS (SUMMER): 8-Pointed Radiant Solar Star Wax Disc */}
        {season === 'panas' && (
          <g>
            <polygon
              points="50,8 57,25 74,15 70,33 88,38 76,50 88,62 70,67 74,85 57,75 50,92 43,75 26,85 30,67 12,62 24,50 12,38 30,33 26,15 43,25"
              fill={`url(#sealGrad-${season})`}
              stroke="#fef08a"
              strokeWidth="2.5"
            />
            <circle cx="50" cy="50" r="25" fill="none" stroke="#fef9c3" strokeWidth="1.5" />
            {/* Solar Corona Rays */}
            <circle cx="50" cy="50" r="16" fill="#fef08a" opacity="0.3" />
            <text
              x="50"
              y="54.5"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="14"
              fontWeight="900"
              fontFamily="'Noto Serif JP', serif"
            >
              陽
            </text>
            <circle cx="50" cy="50" r="7" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="2,2" />
          </g>
        )}

        {/* 3. MUSIM GUGUR (AUTUMN): Antique Shield with Carved Momiji Leaf */}
        {season === 'gugur' && (
          <g>
            {/* Scalloped antique perimeter */}
            <path
              d="M 50 12 Q 62 14 74 24 Q 86 36 86 50 Q 86 64 74 76 Q 62 86 50 88 Q 38 86 26 76 Q 14 64 14 50 Q 14 36 26 24 Q 38 14 50 12 Z"
              fill={`url(#sealGrad-${season})`}
              stroke="#fed7aa"
              strokeWidth="2.5"
            />
            <circle cx="50" cy="50" r="26" fill="none" stroke="#ffedd5" strokeWidth="1.4" strokeDasharray="3,2" />
            {/* Momiji Leaf Silhouette */}
            <path
              d="M 50 28 L 53 38 L 62 33 L 58 43 L 68 47 L 57 52 L 62 62 L 52 56 L 50 68 L 48 56 L 38 62 L 43 52 L 32 47 L 42 43 L 38 33 L 47 38 Z"
              fill="#ffffff"
              opacity="0.85"
            />
            <text
              x="50"
              y="54.5"
              textAnchor="middle"
              fill="#9a3412"
              fontSize="13"
              fontWeight="900"
              fontFamily="'Noto Serif JP', serif"
            >
              秋
            </text>
          </g>
        )}

        {/* 4. MUSIM DINGIN (WINTER): 6-Pointed Hexagonal Glacial Prism & Snowflake */}
        {season === 'dingin' && (
          <g>
            {/* Hexagonal Crystal Perimeter */}
            <polygon
              points="50,10 84,28 84,72 50,90 16,72 16,28"
              fill={`url(#sealGrad-${season})`}
              stroke="#e0f2fe"
              strokeWidth="2.5"
            />
            <polygon
              points="50,17 78,32 78,68 50,83 22,68 22,32"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeDasharray="2,2"
            />
            {/* Geometric 6-Ray Snowflake */}
            <line x1="50" y1="26" x2="50" y2="74" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="28" y1="38" x2="72" y2="62" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="28" y1="62" x2="72" y2="38" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
            {/* Small Snowflake Chevrons */}
            <path d="M 46 32 L 50 28 L 54 32" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 46 68 L 50 72 L 54 68" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="50" cy="50" r="10" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
            <text
              x="50"
              y="54.5"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="12.5"
              fontWeight="900"
              fontFamily="'Noto Serif JP', serif"
            >
              冬
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
