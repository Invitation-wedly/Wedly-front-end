import { Button } from '@/common/components/ui/button';
import { Volume2, VolumeX, Play } from 'lucide-react';
import { useRef, useState, useEffect, useCallback } from 'react';

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasUserInteraction, setHasUserInteraction] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const shouldResumeOnForegroundRef = useRef(false);

  const startPlayback = useCallback(async (withSound: boolean) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !withSound;
    setIsMuted(!withSound);

    try {
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('오디오 재생 실패:', error);
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (hasUserInteraction) return;

    let handled = false;
    const interactionEvents: Array<keyof WindowEventMap> = [
      'scroll',
      'wheel',
      'touchmove',
      'touchstart',
      'pointerdown',
    ];

    const handleFirstInteraction = () => {
      if (handled) return;
      handled = true;
      setHasUserInteraction(true);
      void startPlayback(true);
    };

    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, handleFirstInteraction, {
        passive: true,
      });
    });

    return () => {
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleFirstInteraction);
      });
    };
  }, [hasUserInteraction, startPlayback]);

  useEffect(() => {
    const pauseForBackground = () => {
      const audio = audioRef.current;
      if (!audio) return;

      shouldResumeOnForegroundRef.current = !audio.paused;
      audio.pause();
    };

    const resumeFromBackground = () => {
      if (!hasUserInteraction || !shouldResumeOnForegroundRef.current) return;

      shouldResumeOnForegroundRef.current = false;
      void startPlayback(!isMuted);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseForBackground();
        return;
      }

      resumeFromBackground();
    };

    const handlePageHide = () => {
      pauseForBackground();
    };

    const handlePageShow = () => {
      resumeFromBackground();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [hasUserInteraction, isMuted, startPlayback]);

  const handleInitialPlay = () => {
    setHasUserInteraction(true);
    shouldResumeOnForegroundRef.current = true;
    void startPlayback(true);
  };

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      shouldResumeOnForegroundRef.current = false;
      audio.pause();
      setIsMuted(false);
    } else {
      setHasUserInteraction(true);
      shouldResumeOnForegroundRef.current = true;
      void startPlayback(true);
    }
  };

  return (
    <>
      <div className='pointer-events-none fixed left-0 right-0 z-50'>
        <div className='relative mx-auto max-w-screen-sm'>
          <div
            className='pointer-events-auto absolute right-4'
            style={{ top: 'calc(env(safe-area-inset-top, 0px) + 1rem)' }}
          >
            {!hasUserInteraction ? (
              <Button
                variant='secondary'
                size='sm'
                className='rounded-full border border-gray-200 bg-white/90 shadow-sm animate-pulse'
                onClick={handleInitialPlay}
              >
                <Play className='w-4 h-4' />
              </Button>
            ) : (
              <Button
                variant='secondary'
                size='sm'
                className='rounded-full border border-gray-200 bg-white/90 shadow-sm'
                onClick={toggleAudio}
              >
                {isPlaying && !isMuted ? (
                  <Volume2 className='w-4 h-4' />
                ) : (
                  <VolumeX className='w-4 h-4' />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <audio ref={audioRef} loop preload='auto' src='/music/Stay-for-you.mp3' />
    </>
  );
}
