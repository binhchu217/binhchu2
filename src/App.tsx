import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {MUSIC_LINK} from './config/mediaLinks';
import {SimpleCipherPuzzle} from './components/SimpleCipherPuzzle';
import {DoorUnlockScene} from './components/DoorUnlockScene';
import {ScatteredPileScene} from './components/ScatteredPileScene';
import {VideoGalleryPage} from './components/VideoGalleryPage';
import {VolumeControl} from './components/VolumeControl';
import {OceanWaves} from './components/OceanWaves';
import {
  setFallbackVolume,
  startAmbientFallback,
  stopAmbientFallback,
} from './utils/audioEngine';

type Stage = 'puzzle' | 'door' | 'pile' | 'videos';

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.replace('/', '').trim() || null;
    }
    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname.startsWith('/embed/')) {
        return parsed.pathname.split('/embed/')[1]?.split('/')[0] || null;
      }
      if (parsed.pathname.startsWith('/shorts/')) {
        return parsed.pathname.split('/shorts/')[1]?.split('/')[0] || null;
      }
      return parsed.searchParams.get('v');
    }
  } catch {
    return null;
  }
  return null;
}

export default function App() {
  const [stage, setStage] = useState<Stage>('puzzle');
  const [returnToOpenLetter, setReturnToOpenLetter] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.55);
  const [isMuted, setIsMuted] = useState(false);
  const [useAudioFallback, setUseAudioFallback] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytIframeRef = useRef<HTMLIFrameElement | null>(null);
  const hasStartedOnceRef = useRef(false);

  const youtubeId = useMemo(() => extractYouTubeId(MUSIC_LINK), []);

  const postYouTubeCommand = useCallback(
    (func: string, args: unknown[] = []) => {
      const win = ytIframeRef.current?.contentWindow;
      if (!win) return;
      win.postMessage(
        JSON.stringify({
          event: 'command',
          func,
          args,
        }),
        '*',
      );
    },
    [],
  );

  const applyVolume = useCallback(
    (vol: number, muted: boolean) => {
      const target = muted ? 0 : vol;
      if (youtubeId) {
        postYouTubeCommand('setVolume', [Math.round(target * 100)]);
        postYouTubeCommand(muted || target === 0 ? 'mute' : 'unMute');
      } else if (audioRef.current) {
        audioRef.current.volume = target;
      }
      setFallbackVolume(target);
    },
    [postYouTubeCommand, youtubeId],
  );

  const startMusic = useCallback(
    async (explicitVolume?: number) => {
      const targetVol = explicitVolume ?? (isMuted ? 0 : volume);

      if (youtubeId) {
        postYouTubeCommand('setVolume', [Math.round(targetVol * 100)]);
        postYouTubeCommand(targetVol === 0 ? 'mute' : 'unMute');
        postYouTubeCommand('playVideo');
        setIsMusicPlaying(true);
        return;
      }

      const audioEl = audioRef.current;
      if (MUSIC_LINK && audioEl && !useAudioFallback) {
        try {
          audioEl.volume = targetVol;
          await audioEl.play();
          setIsMusicPlaying(true);
          return;
        } catch {
          setUseAudioFallback(true);
        }
      }
      startAmbientFallback(targetVol);
      setIsMusicPlaying(true);
    },
    [isMuted, postYouTubeCommand, useAudioFallback, volume, youtubeId],
  );

  const stopMusic = useCallback(() => {
    if (youtubeId) {
      postYouTubeCommand('pauseVideo');
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    stopAmbientFallback();
    setIsMusicPlaying(false);
  }, [postYouTubeCommand, youtubeId]);

  const handleFirstInteract = useCallback(() => {
    if (!hasStartedOnceRef.current) {
      hasStartedOnceRef.current = true;
      if (!isMuted && volume > 0) {
        void startMusic(volume);
      }
    }
  }, [isMuted, startMusic, volume]);

  const handleToggleMute = useCallback(() => {
    if (isMuted || volume === 0) {
      const restored = volume === 0 ? 0.55 : volume;
      setVolume(restored);
      setIsMuted(false);
      applyVolume(restored, false);
      if (!isMusicPlaying) {
        hasStartedOnceRef.current = true;
        void startMusic(restored);
      }
    } else {
      setIsMuted(true);
      applyVolume(volume, true);
    }
  }, [applyVolume, isMusicPlaying, isMuted, startMusic, volume]);

  const handleVolumeChange = useCallback(
    (nextVol: number) => {
      const clamped = Math.max(0, Math.min(1, nextVol));
      setVolume(clamped);
      const shouldMute = clamped === 0;
      setIsMuted(shouldMute);
      applyVolume(clamped, shouldMute);

      if (!shouldMute && !isMusicPlaying) {
        hasStartedOnceRef.current = true;
        void startMusic(clamped);
      }
    },
    [applyVolume, isMusicPlaying, startMusic],
  );

  const handlePuzzleSolved = useCallback(() => {
    setStage('door');
    if (!isMusicPlaying && !isMuted) {
      hasStartedOnceRef.current = true;
      void startMusic(volume);
    }
  }, [isMusicPlaying, isMuted, startMusic, volume]);

  const handleDoorOpened = useCallback(() => {
    setReturnToOpenLetter(false);
    setStage('pile');
  }, []);

  const handleOpenVideos = useCallback(() => {
    setStage('videos');
  }, []);

  const handleBackToPile = useCallback(() => {
    setReturnToOpenLetter(true);
    setStage('pile');
  }, []);

  const handleReplayAll = useCallback(() => {
    stopMusic();
    hasStartedOnceRef.current = false;
    setReturnToOpenLetter(false);
    setStage('puzzle');
  }, [stopMusic]);

  useEffect(() => {
    return () => {
      stopAmbientFallback();
    };
  }, []);

  return (
    <div className="min-h-dvh w-full bg-[#FFF9F5] text-[#4A3525] relative">
      {/* Persistent Multi-layered Animated Pastel Waves & Static Stickers */}
      <OceanWaves />

      {/* Background Music Player: Supports both YouTube links and direct MP3/Audio links */}
      {youtubeId ? (
        <iframe
          ref={ytIframeRef}
          title="Nhạc nền 19/11"
          src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=0&loop=1&playlist=${youtubeId}&controls=0&playsinline=1`}
          allow="autoplay; encrypted-media"
          className="fixed w-px h-px opacity-0 pointer-events-none -left-10 -top-10"
        />
      ) : (
        MUSIC_LINK && (
          <audio
            ref={audioRef}
            src={MUSIC_LINK}
            loop
            preload="auto"
            onError={() => {
              setUseAudioFallback(true);
              if (isMusicPlaying) {
                startAmbientFallback(isMuted ? 0 : volume);
              }
            }}
          />
        )
      )}

      {/* Icon-only Music Control that reveals volume slider on hover */}
      <VolumeControl
        volume={volume}
        isMuted={isMuted}
        onVolumeChange={handleVolumeChange}
        onToggleMute={handleToggleMute}
      />

      {stage === 'puzzle' && (
        <SimpleCipherPuzzle
          onFirstInteract={handleFirstInteract}
          onSolved={handlePuzzleSolved}
        />
      )}

      {stage === 'door' && <DoorUnlockScene onComplete={handleDoorOpened} />}

      {stage === 'pile' && (
        <ScatteredPileScene
          onReplayAll={handleReplayAll}
          onOpenVideos={handleOpenVideos}
          defaultLetterOpen={returnToOpenLetter}
        />
      )}

      {stage === 'videos' && (
        <VideoGalleryPage
          onBackToPile={handleBackToPile}
          onReplayAll={handleReplayAll}
        />
      )}
    </div>
  );
}
