import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Hand,
  Image as ImageIcon,
  MailOpen,
  Play,
  RotateCcw,
  Shuffle,
  X,
} from 'lucide-react';
import {
  LETTER_FILE_PATH,
  PHOTO_LINKS,
  type MemoryPhoto,
} from '../config/mediaLinks';

interface ScatteredPileSceneProps {
  onReplayAll: () => void;
  onOpenVideos: () => void;
  defaultLetterOpen?: boolean;
}

interface PileItem {
  photo: MemoryPhoto;
  xPct: number;
  yPct: number;
  dx: number;
  dy: number;
  rotate: number;
  zIndex: number;
}

function generateFullScreenMessyPile(): PileItem[] {
  const layoutSlots = [
    {xPct: -34, yPct: -26, r: -16},
    {xPct: 32, yPct: -24, r: 14},
    {xPct: -30, yPct: 22, r: 19},
    {xPct: 34, yPct: 24, r: -18},
    {xPct: -14, yPct: -22, r: 9},
    {xPct: 16, yPct: 20, r: -11},
    {xPct: 22, yPct: -10, r: 22},
    {xPct: -20, yPct: 6, r: -21},
    {xPct: -4, yPct: -4, r: 12},
    {xPct: 6, yPct: 4, r: -9},
    {xPct: 0, yPct: -14, r: -5},
  ];

  return PHOTO_LINKS.map((photo, idx) => {
    const slot = layoutSlots[idx % layoutSlots.length];
    return {
      photo,
      xPct: slot.xPct + (Math.random() * 6 - 3),
      yPct: slot.yPct + (Math.random() * 6 - 3),
      dx: 0,
      dy: 0,
      rotate: slot.r + (Math.random() * 8 - 4),
      zIndex: 10 + idx,
    };
  });
}

export const ScatteredPileScene: React.FC<ScatteredPileSceneProps> = ({
  onReplayAll,
  onOpenVideos,
  defaultLetterOpen = false,
}) => {
  const [pile, setPile] = useState<PileItem[]>(() =>
    generateFullScreenMessyPile(),
  );
  const [topZ, setTopZ] = useState(30);
  const [isLetterZoomed, setIsLetterZoomed] = useState(defaultLetterOpen);

  const [rawText, setRawText] = useState('');
  const [isLoadingLetter, setIsLoadingLetter] = useState(true);
  const [letterError, setLetterError] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const dragStateRef = useRef<{
    id: string;
    pointerId: number;
    startClientX: number;
    startClientY: number;
    origDx: number;
    origDy: number;
    movedDistance: number;
  } | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingLetter(true);
    setLetterError(null);

    fetch(LETTER_FILE_PATH)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (isMounted) {
          setRawText(text);
          setIsLoadingLetter(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLetterError(
            'Không thể tải bức thư từ file /public/letter.txt.',
          );
          setIsLoadingLetter(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLetterZoomed) {
        setIsLetterZoomed(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isLetterZoomed]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, item: PileItem) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      const nextZ = topZ + 1;
      setTopZ(nextZ);
      setDraggingId(item.photo.id);

      dragStateRef.current = {
        id: item.photo.id,
        pointerId: e.pointerId,
        startClientX: e.clientX,
        startClientY: e.clientY,
        origDx: item.dx,
        origDy: item.dy,
        movedDistance: 0,
      };

      setPile((prev) =>
        prev.map((p) =>
          p.photo.id === item.photo.id ? {...p, zIndex: nextZ} : p,
        ),
      );
    },
    [topZ],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragStateRef.current;
      if (!drag || drag.pointerId !== e.pointerId) return;

      const deltaX = e.clientX - drag.startClientX;
      const deltaY = e.clientY - drag.startClientY;
      drag.movedDistance = Math.hypot(deltaX, deltaY);

      setPile((prev) =>
        prev.map((p) =>
          p.photo.id === drag.id
            ? {...p, dx: drag.origDx + deltaX, dy: drag.origDy + deltaY}
            : p,
        ),
      );
    },
    [],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragStateRef.current;
      if (!drag || drag.pointerId !== e.pointerId) return;

      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }

      if (drag.movedDistance < 8) {
        const pushDist = window.innerWidth < 640 ? 150 : 280;
        setPile((prev) =>
          prev.map((p) => {
            if (p.photo.id !== drag.id) return p;
            const angle = Math.atan2(
              p.yPct || (Math.random() - 0.5),
              p.xPct || (Math.random() - 0.5),
            );
            return {
              ...p,
              dx: p.dx + Math.cos(angle) * pushDist,
              dy: p.dy + Math.sin(angle) * pushDist * 0.75,
              rotate: p.rotate + (Math.random() > 0.5 ? 10 : -10),
            };
          }),
        );
      }

      dragStateRef.current = null;
      setDraggingId(null);
    },
    [],
  );

  const handleResetPile = useCallback(() => {
    setPile(generateFullScreenMessyPile());
    setTopZ(30);
  }, []);

  const normalizedText = rawText.replace(/\r\n/g, '\n').trim();
  const firstNewlineIdx = normalizedText.indexOf('\n');
  const firstLine =
    firstNewlineIdx === -1
      ? normalizedText
      : normalizedText.slice(0, firstNewlineIdx).trim();
  const restOfLetter =
    firstNewlineIdx === -1
      ? ''
      : normalizedText.slice(firstNewlineIdx + 1).replace(/^\n+/, '');

  return (
    <main className="h-dvh w-full text-[#4A3525] flex flex-col items-center justify-between px-4 pt-4 pb-6 relative z-10 overflow-hidden select-none">
      {/* Floating Kawaii Instruction */}
      <header className="relative z-40 pointer-events-none mt-1">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#4A3525] bg-[#FFFDFD] px-4 py-2 rounded-2xl border-[2.5px] border-[#4A3525] shadow-[4px_4px_0px_#4A3525]">
          <Hand className="w-4 h-4 text-[#E15B78] shrink-0" aria-hidden="true" />
          <span>
            Dùng chuột hoặc ngón tay gạt ảnh ra xung quanh để tìm bức thư bên dưới
          </span>
        </div>
      </header>

      {/* Full-Screen Scattered Pile Stage */}
      <section
        aria-label="Đống ảnh kỉ niệm phủ kín màn hình và bức thư bí mật"
        className="relative w-full flex-1 flex items-center justify-center"
      >
        {/* Buried Kawaii Letter Envelope underneath */}
        <button
          type="button"
          onClick={() => setIsLetterZoomed(true)}
          aria-label="Mở bức thư 19/11"
          style={{zIndex: 5}}
          className="group relative w-[230px] sm:w-[275px] bg-gradient-to-b from-[#FFFFFF] to-[#FFF0F4] hover:-translate-y-1 border-[2.5px] border-[#4A3525] rounded-[24px] p-5 sm:p-6 shadow-[4px_4px_0px_#4A3525] transition-transform duration-200 hover:scale-105 cursor-pointer text-center rotate-[-2deg] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A3525]"
        >
          <div
            aria-hidden="true"
            className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[#FFD1DC] border-[2px] border-[#4A3525] text-[#4A3525] flex items-center justify-center shadow-[2px_2px_0px_#4A3525] group-hover:scale-110 transition-transform"
          >
            <MailOpen className="w-6 h-6" />
          </div>
          <p className="font-mono text-[11px] font-bold tracking-widest text-[#E15B78] mb-1">
            19 · 11
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-[#4A3525] leading-tight">
            Bức thư gửi bạn
          </p>
          <p className="mt-2 text-xs font-semibold text-[#8A6A52]">
            Bấm để phóng to đọc thư
          </p>
        </button>

        {/* Big Messy Kawaii Photos Sprawled Across the Screen */}
        {pile.map((item, idx) => {
          const isDragging = draggingId === item.photo.id;
          const isFailed = failedImages[item.photo.id];
          const photoLabel = `Ảnh kỉ niệm ${idx + 1}`;

          return (
            <div
              key={item.photo.id}
              onPointerDown={(e) => handlePointerDown(e, item)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              role="button"
              tabIndex={0}
              aria-label={`Kéo ảnh ra: ${photoLabel}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setPile((prev) =>
                    prev.map((p) =>
                      p.photo.id === item.photo.id
                        ? {
                            ...p,
                            dx: p.dx + (p.xPct >= 0 ? 240 : -240),
                            dy: p.dy + (p.yPct >= 0 ? 150 : -150),
                          }
                        : p,
                    ),
                  );
                }
              }}
              style={{
                left: `calc(50% + ${item.xPct}vw)`,
                top: `calc(50% + ${item.yPct}dvh)`,
                transform: `translate3d(calc(-50% + ${item.dx}px), calc(-50% + ${item.dy}px), 0) rotate(${item.rotate}deg) scale(${
                  isDragging ? 1.04 : 1
                })`,
                zIndex: item.zIndex,
                transition: isDragging
                  ? 'none'
                  : 'transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className={`fixed touch-none w-fit max-w-[82vw] sm:max-w-[440px] md:max-w-[500px] lg:max-w-[540px] bg-[#FFFFFF] border-[2.5px] border-[#4A3525] rounded-[24px] p-2.5 sm:p-3 select-none ${
                isDragging
                  ? 'cursor-grabbing shadow-[6px_6px_0px_#4A3525]'
                  : 'cursor-grab shadow-[4px_4px_0px_#4A3525]'
              }`}
            >
              <div className="overflow-hidden rounded-xl border-[2px] border-[#4A3525] bg-[#FFF2F6] pointer-events-none flex items-center justify-center">
                {!isFailed ? (
                  <img
                    src={item.photo.url}
                    alt={photoLabel}
                    referrerPolicy="no-referrer"
                    draggable={false}
                    onError={() =>
                      setFailedImages((prev) => ({
                        ...prev,
                        [item.photo.id]: true,
                      }))
                    }
                    className="block w-auto h-auto max-w-[74vw] sm:max-w-[410px] md:max-w-[470px] lg:max-w-[510px] max-h-[54dvh] sm:max-h-[56dvh]"
                  />
                ) : (
                  <div className="w-[240px] h-[180px] flex flex-col items-center justify-center p-4 text-center bg-[#FFF2F6]">
                    <ImageIcon
                      className="w-8 h-8 text-[#E15B78] mb-2"
                      aria-hidden="true"
                    />
                    <span className="text-xs sm:text-sm font-semibold text-[#4A3525]">
                      {photoLabel}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Bottom Floating Actions */}
      <footer className="relative z-40 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleResetPile}
          className="h-10 px-4 rounded-xl bg-[#FFFFFF] hover:bg-[#FFF0F4] hover:-translate-y-[2px] border-[2px] border-[#4A3525] text-xs sm:text-sm font-bold text-[#4A3525] inline-flex items-center gap-1.5 shadow-[3px_3px_0px_#4A3525] transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <Shuffle className="w-4 h-4 text-[#E15B78]" aria-hidden="true" />
          <span>Xếp lại đống ảnh</span>
        </button>

        <button
          type="button"
          onClick={onReplayAll}
          className="h-10 px-4 rounded-xl bg-[#C8F7DC] hover:bg-[#B4F0CE] hover:-translate-y-[2px] border-[2px] border-[#4A3525] text-xs sm:text-sm font-bold text-[#4A3525] inline-flex items-center gap-1.5 shadow-[3px_3px_0px_#4A3525] transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>Chơi lại từ đầu</span>
        </button>
      </footer>

      {/* Zoomed-in Readable Letter Modal */}
      {isLetterZoomed && (
        <div
          className="fixed inset-0 z-50 bg-[#4A3525]/45 backdrop-blur-sm flex flex-col items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Bức thư chúc mừng ngày 19/11"
          onClick={() => setIsLetterZoomed(false)}
        >
          <article
            onClick={(e) => e.stopPropagation()}
            className="w-[92vw] sm:w-[540px] md:w-[680px] lg:w-[740px] min-h-[60dvh] max-h-[82dvh] bg-gradient-to-b from-[#FFFFFF] to-[#FFF6F9] text-[#4A3525] rounded-[24px] border-[2.5px] border-[#4A3525] shadow-[4px_4px_0px_#4A3525] flex flex-col overflow-hidden animate-letter-zoom relative"
          >
            <div className="px-6 pt-5 pb-3.5 sm:px-10 sm:pt-7 sm:pb-4 border-b-[2px] border-[#4A3525]/15 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold tracking-widest text-[#E15B78] tabular-nums">
                  19 · 11
                </span>
                <span className="text-xs font-semibold text-[#8A6A52]">
                  Ngày 19 tháng 11
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsLetterZoomed(false)}
                aria-label="Thu nhỏ bức thư"
                className="w-9 h-9 rounded-xl bg-[#FFF0F4] hover:bg-[#FFD1DC] border-[2px] border-[#4A3525] text-[#4A3525] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto letter-scroll px-6 py-5 sm:px-10 sm:py-8 select-text">
              {isLoadingLetter ? (
                <div className="h-full flex items-center justify-center py-12 text-sm font-semibold text-[#8A6A52]">
                  Đang mở bức thư...
                </div>
              ) : letterError ? (
                <div className="h-full flex items-center justify-center py-12 text-sm font-semibold text-[#C93B51] text-center">
                  {letterError}
                </div>
              ) : (
                <div className="max-w-[65ch] mx-auto space-y-4">
                  {firstLine && (
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4A3525] leading-snug">
                      {firstLine}
                    </h1>
                  )}

                  {restOfLetter && (
                    <div className="text-[15px] sm:text-base leading-[1.85] font-medium text-[#5C4330] whitespace-pre-line">
                      {restOfLetter}
                    </div>
                  )}

                  {/* Line + Button at the bottom of the letter to open the Videos page */}
                  <div className="pt-6 mt-6 border-t-[2px] border-dashed border-[#4A3525]/20 flex flex-col items-center text-center gap-3 pb-2">
                    <p className="text-sm sm:text-base font-bold text-[#4A3525]">
                      Vẫn còn một bất ngờ nho nhỏ ở trang tiếp theo dành cho bạn...
                    </p>
                    <button
                      type="button"
                      onClick={onOpenVideos}
                      className="h-11 px-6 rounded-2xl bg-[#FFD1DC] hover:bg-[#FFC0CF] hover:-translate-y-[2px] active:translate-y-[1px] border-[2px] border-[#4A3525] shadow-[3px_3px_0px_#4A3525] text-sm sm:text-base font-extrabold text-[#4A3525] inline-flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Play className="w-4 h-4 fill-[#4A3525]" aria-hidden="true" />
                      <span>Mở xem video kỉ niệm</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3 sm:px-10 border-t-[2px] border-[#4A3525]/15 bg-[#FFF2F6] flex items-center justify-between text-xs font-semibold text-[#8A6A52] shrink-0">
              <span>Ngày Quốc tế Đàn ông</span>
              <button
                type="button"
                onClick={() => setIsLetterZoomed(false)}
                className="font-bold text-[#E15B78] hover:text-[#C93B51] cursor-pointer whitespace-nowrap"
              >
                Quay lại đống ảnh
              </button>
            </div>
          </article>
        </div>
      )}
    </main>
  );
};
