import React from 'react';

/**
 * Kawaii pastel layered clouds/waves at the bottom of the screen
 * (#FFFDF9 cream, #C8F7DC mint green, #FFD1DC pastel pink)
 * accompanied by static cute corner stickers (stars, hearts, little clouds).
 */
export const OceanWaves: React.FC = () => {
  return (
    <>
      {/* Static Cute SVG Stickers in Background Corners (non-blocking) */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none"
      >
        {/* Top-left Pastel Cloud Sticker */}
        <svg
          viewBox="0 0 84 52"
          className="absolute top-5 left-5 sm:top-7 sm:left-8 w-14 h-9 sm:w-18 sm:h-11 opacity-95"
        >
          <path
            d="M22 44H63C71.8 44 78 38.2 78 30.5C78 23.8 73.1 18.6 66.5 17.7C64.2 9.4 56.6 4 47.5 4C37.5 4 29.3 10.8 27.6 20C25.8 19.3 23.9 19 21.8 19C13.6 19 7 24.8 7 31.8C7 38.8 13.7 44 22 44Z"
            fill="#D6ECFF"
            stroke="#4A3525"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="38" cy="28" r="2.2" fill="#4A3525" />
          <circle cx="52" cy="28" r="2.2" fill="#4A3525" />
          <path
            d="M42 32C43.5 34 46.5 34 48 32"
            stroke="#4A3525"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Top-left Star Sticker */}
        <svg
          viewBox="0 0 36 36"
          className="absolute top-[15%] left-[6%] w-7 h-7 sm:w-8 sm:h-8 opacity-90"
        >
          <path
            d="M18 3L22.2 12.6L32.5 13.7L24.8 20.7L27 30.9L18 25.6L9 30.9L11.2 20.7L3.5 13.7L13.8 12.6L18 3Z"
            fill="#FFE58F"
            stroke="#4A3525"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        </svg>

        {/* Top-right Pastel Heart Sticker (below volume icon) */}
        <svg
          viewBox="0 0 36 36"
          className="absolute top-[16%] right-[6%] w-7 h-7 sm:w-8 sm:h-8 opacity-90"
        >
          <path
            d="M18 31C18 31 5 22.4 5 13.2C5 8.8 8.4 5.5 12.5 5.5C15 5.5 17 6.8 18 8.6C19 6.8 21 5.5 23.5 5.5C27.6 5.5 31 8.8 31 13.2C31 22.4 18 31 18 31Z"
            fill="#FFD1DC"
            stroke="#4A3525"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        </svg>

        {/* Mid-left Tiny Mint Heart Sticker */}
        <svg
          viewBox="0 0 28 28"
          className="hidden sm:block absolute top-[48%] left-[4%] w-6 h-6 opacity-85"
        >
          <path
            d="M14 24C14 24 4 17.4 4 10.5C4 7.2 6.6 4.8 9.7 4.8C11.6 4.8 13.2 5.8 14 7.2C14.8 5.8 16.4 4.8 18.3 4.8C21.4 4.8 24 7.2 24 10.5C24 17.4 14 24 14 24Z"
            fill="#C8F7DC"
            stroke="#4A3525"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        </svg>

        {/* Mid-right Mini Cloud Sticker */}
        <svg
          viewBox="0 0 72 44"
          className="hidden sm:block absolute top-[46%] right-[4%] w-12 h-8 opacity-85"
        >
          <path
            d="M18 37H54C61.5 37 67 32 67 25.5C67 19.6 62.6 15 56.8 14.3C54.8 7.5 48.2 3 40.5 3C31.8 3 24.8 8.8 23.4 16.5C21.8 15.9 20.1 15.6 18.3 15.6C11.2 15.6 5.5 20.5 5.5 26.5C5.5 32.5 11.2 37 18 37Z"
            fill="#FFFDF9"
            stroke="#4A3525"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
        </svg>

        {/* Lower-left Small Star Sticker */}
        <svg
          viewBox="0 0 28 28"
          className="absolute bottom-[29%] left-[10%] w-6 h-6 opacity-85"
        >
          <path
            d="M14 2L17.2 9.8L25.5 10.6L19.3 16.1L21.1 24.3L14 20L6.9 24.3L8.7 16.1L2.5 10.6L10.8 9.8L14 2Z"
            fill="#FFD1DC"
            stroke="#4A3525"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        </svg>

        {/* Lower-right Small Yellow Heart Sticker */}
        <svg
          viewBox="0 0 28 28"
          className="absolute bottom-[30%] right-[10%] w-6 h-6 opacity-85"
        >
          <path
            d="M14 24C14 24 4 17.4 4 10.5C4 7.2 6.6 4.8 9.7 4.8C11.6 4.8 13.2 5.8 14 7.2C14.8 5.8 16.4 4.8 18.3 4.8C21.4 4.8 24 7.2 24 10.5C24 17.4 14 24 14 24Z"
            fill="#FFE58F"
            stroke="#4A3525"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Bottom Pastel Cloud / Wave Layers (#FFFDF9 cream, #C8F7DC mint, #FFD1DC pink) */}
      <div
        aria-hidden="true"
        className="fixed bottom-0 inset-x-0 z-0 pointer-events-none overflow-hidden h-[23dvh] sm:h-[26dvh] min-h-[135px] max-h-[250px] select-none"
      >
        {/* Back Layer: Cream White (#FFFDF9) */}
        <div className="absolute bottom-[28%] left-0 w-[200%] h-[62%] animate-wave-slow">
          <svg
            viewBox="0 0 2400 180"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0,95 C100,40 200,40 300,85 C400,25 520,25 600,85 C700,35 800,35 900,88 C1000,25 1100,25 1200,95 C1300,40 1400,40 1500,85 C1600,25 1720,25 1800,85 C1900,35 2000,35 2100,88 C2200,25 2300,25 2400,95 L2400,180 L0,180 Z"
              fill="#FFFDF9"
              stroke="#4A3525"
              strokeWidth="3"
            />
          </svg>
        </div>

        {/* Middle Layer: Mint Pastel (#C8F7DC) */}
        <div className="absolute bottom-[14%] left-0 w-[200%] h-[60%] animate-wave-medium-reverse">
          <svg
            viewBox="0 0 2400 180"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0,90 C120,30 220,30 320,85 C420,40 500,40 600,92 C720,30 820,30 920,85 C1020,40 1100,40 1200,90 C1320,30 1420,30 1520,85 C1620,40 1700,40 1800,92 C1920,30 2020,30 2120,85 C2220,40 2300,40 2400,90 L2400,180 L0,180 Z"
              fill="#C8F7DC"
              stroke="#4A3525"
              strokeWidth="3"
            />
          </svg>
        </div>

        {/* Front Layer: Pastel Pink (#FFD1DC) */}
        <div className="absolute bottom-0 left-0 w-[200%] h-[56%] animate-wave-fast">
          <svg
            viewBox="0 0 2400 180"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0,85 C90,25 210,25 300,78 C410,20 510,20 600,80 C690,25 810,25 900,78 C1010,20 1110,20 1200,85 C1290,25 1410,25 1500,78 C1610,20 1710,20 1800,80 C1890,25 2010,25 2100,78 C2210,20 2310,20 2400,85 L2400,180 L0,180 Z"
              fill="#FFD1DC"
              stroke="#4A3525"
              strokeWidth="3"
            />
          </svg>
        </div>
      </div>
    </>
  );
};
