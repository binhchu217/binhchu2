import React, {useState} from 'react';
import {Volume1, Volume2, VolumeX} from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (nextVolume: number) => void;
  onToggleMute: () => void;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const effectiveVolume = isMuted ? 0 : volume;
  const percent = Math.round(effectiveVolume * 100);

  const Icon =
    effectiveVolume === 0
      ? VolumeX
      : effectiveVolume <= 0.5
        ? Volume1
        : Volume2;

  return (
    <div
      className="fixed top-4 right-4 z-40 flex items-center justify-end"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsHovered(false);
        }
      }}
    >
      <div className="flex items-center bg-[#FFFDFD] border-[2.5px] border-[#4A3525] rounded-2xl shadow-[3px_3px_0px_#4A3525] p-1 transition-all duration-200">
        {/* Slider revealed smoothly on hover / focus */}
        <div
          className={`flex items-center overflow-hidden transition-all duration-200 ease-out ${
            isHovered ? 'w-32 sm:w-36 pl-2.5 pr-2 opacity-100' : 'w-0 pl-0 pr-0 opacity-0'
          }`}
        >
          <input
            type="range"
            min={0}
            max={100}
            value={percent}
            aria-label="Điều chỉnh âm lượng nhạc nền"
            onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
            className="w-full h-1.5 accent-[#FF8FA3] bg-[#FFD1DC]/60 rounded-full cursor-pointer"
          />
          <span className="ml-2 font-mono text-[11px] font-bold tabular-nums text-[#4A3525] w-8 text-right shrink-0">
            {percent}%
          </span>
        </div>

        {/* Icon-only Toggle Button */}
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={isMuted || volume === 0 ? 'Bật âm thanh' : 'Tắt âm thanh'}
          className="w-10 h-10 rounded-xl hover:bg-[#FFF0F4] flex items-center justify-center transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A3525]"
        >
          <Icon
            className={`w-5 h-5 ${
              effectiveVolume > 0 ? 'text-[#E15B78]' : 'text-[#8C7563]'
            }`}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
};
