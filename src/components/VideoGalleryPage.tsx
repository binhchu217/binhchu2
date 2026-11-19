import React, {useState} from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import {VIDEO_LINKS} from '../config/mediaLinks';

interface VideoGalleryPageProps {
  onBackToPile: () => void;
  onReplayAll: () => void;
}

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    let id: string | null = null;
    if (parsed.hostname.includes('youtu.be')) {
      id = parsed.pathname.replace('/', '').trim() || null;
    } else if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname.startsWith('/embed/')) {
        id = parsed.pathname.split('/embed/')[1]?.split('/')[0] || null;
      } else if (parsed.pathname.startsWith('/shorts/')) {
        id = parsed.pathname.split('/shorts/')[1]?.split('/')[0] || null;
      } else {
        id = parsed.searchParams.get('v');
      }
    }
    return id ? `https://www.youtube.com/embed/${id}?rel=0` : null;
  } catch {
    return null;
  }
}

export const VideoGalleryPage: React.FC<VideoGalleryPageProps> = ({
  onBackToPile,
  onReplayAll,
}) => {
  const [activeIdx, setActiveIdx] = useState<0 | 1>(0);
  const [iframeFallback, setIframeFallback] = useState<Record<string, boolean>>(
    {},
  );
  const [videoRatios, setVideoRatios] = useState<Record<string, string>>({});

  const currentVideo = VIDEO_LINKS[activeIdx] ?? VIDEO_LINKS[0];
  const ytEmbedUrl = getYouTubeEmbedUrl(currentVideo.url);
  const useIframeFallback = Boolean(iframeFallback[currentVideo.id]);
  const detectedRatio = videoRatios[currentVideo.id];

  return (
    <main className="min-h-dvh w-full text-[#4A3525] flex flex-col items-center justify-center px-4 pt-14 pb-28 sm:pb-32 relative z-10">
      <div className="w-full max-w-3xl bg-gradient-to-b from-[#FFFFFF] to-[#FFF2F6] border-[2.5px] border-[#4A3525] rounded-[24px] p-5 sm:p-8 shadow-[4px_4px_0px_#4A3525] animate-gentle-appear">
        {/* Header Metadata */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="font-mono text-xs font-bold text-[#E15B78] tabular-nums">
            VIDEO {activeIdx + 1} / {VIDEO_LINKS.length}
          </span>
          <span className="text-xs font-bold text-[#8A6A52]">
            Kỉ niệm 19/11
          </span>
        </div>

        {/* Video Title */}
        <h1 className="text-xl sm:text-3xl font-extrabold text-[#4A3525] mb-4">
          {currentVideo.title}
        </h1>

        {/* Video Player Row with Left / Right Arrow Controls */}
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {/* Left Arrow (Video 2 -> Video 1) */}
          <button
            type="button"
            disabled={activeIdx === 0}
            onClick={() => setActiveIdx(0)}
            aria-label="Quay lại Video 1"
            className={`flex w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl border-[2px] border-[#4A3525] items-center justify-center shrink-0 transition-all ${
              activeIdx === 1
                ? 'bg-[#C8F7DC] hover:bg-[#B4F0CE] hover:-translate-y-[2px] shadow-[3px_3px_0px_#4A3525] text-[#4A3525] cursor-pointer'
                : 'bg-[#F5ECE8] text-[#B8A596] opacity-45 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
          </button>

          {/* Main Video Viewport adapting cleanly to each video's natural aspect ratio */}
          <div className="flex-1 flex items-center justify-center min-w-0">
            {ytEmbedUrl || useIframeFallback ? (
              <div className="w-full aspect-video rounded-[20px] overflow-hidden border-[2.5px] border-[#4A3525] bg-[#1F1610] shadow-[3px_3px_0px_#4A3525]">
                <iframe
                  key={currentVideo.id}
                  src={ytEmbedUrl || currentVideo.url}
                  title={currentVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              <div
                className="w-fit max-w-full rounded-[20px] overflow-hidden border-[2.5px] border-[#4A3525] bg-[#1F1610] shadow-[3px_3px_0px_#4A3525] flex items-center justify-center"
                style={detectedRatio ? {aspectRatio: detectedRatio} : undefined}
              >
                <video
                  key={currentVideo.id}
                  src={currentVideo.url}
                  controls
                  playsInline
                  onLoadedMetadata={(e) => {
                    const vid = e.currentTarget;
                    if (vid.videoWidth > 0 && vid.videoHeight > 0) {
                      setVideoRatios((prev) => ({
                        ...prev,
                        [currentVideo.id]: `${vid.videoWidth} / ${vid.videoHeight}`,
                      }));
                    }
                  }}
                  onError={() =>
                    setIframeFallback((prev) => ({
                      ...prev,
                      [currentVideo.id]: true,
                    }))
                  }
                  className="block w-auto h-auto max-w-full max-h-[60dvh] bg-[#1F1610]"
                />
              </div>
            )}
          </div>

          {/* Right Arrow (Video 1 -> Video 2) */}
          <button
            type="button"
            disabled={activeIdx === 1}
            onClick={() => setActiveIdx(1)}
            aria-label="Sang Video 2"
            className={`flex w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl border-[2px] border-[#4A3525] items-center justify-center shrink-0 transition-all ${
              activeIdx === 0
                ? 'bg-[#FFD1DC] hover:bg-[#FFC0CF] hover:-translate-y-[2px] shadow-[3px_3px_0px_#4A3525] text-[#4A3525] cursor-pointer'
                : 'bg-[#F5ECE8] text-[#B8A596] opacity-45 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
          </button>
        </div>

        {/* Caption */}
        <p className="mt-4 text-sm font-semibold text-[#5C4330] text-center sm:text-left">
          {currentVideo.caption}
        </p>
      </div>

      {/* Navigation Below Video Card */}
      <nav
        aria-label="Điều hướng trang video"
        className="mt-5 flex flex-wrap items-center justify-center gap-3"
      >
        <button
          type="button"
          onClick={onBackToPile}
          className="h-10 px-4 rounded-xl bg-[#FFFFFF] hover:bg-[#FFF0F4] hover:-translate-y-[2px] border-[2px] border-[#4A3525] text-xs sm:text-sm font-bold text-[#4A3525] inline-flex items-center gap-1.5 shadow-[3px_3px_0px_#4A3525] transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-[#E15B78]" aria-hidden="true" />
          <span>Quay lại bức thư</span>
        </button>

        <button
          type="button"
          onClick={onReplayAll}
          className="h-10 px-4 rounded-xl bg-[#D6ECFF] hover:bg-[#C3E2FF] hover:-translate-y-[2px] border-[2px] border-[#4A3525] text-xs sm:text-sm font-bold text-[#4A3525] inline-flex items-center gap-1.5 shadow-[3px_3px_0px_#4A3525] transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>Chơi lại từ đầu</span>
        </button>
      </nav>
    </main>
  );
};
