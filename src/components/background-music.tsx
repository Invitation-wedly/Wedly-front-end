import { Button } from '@/common/components/ui/button';
import { Volume2, VolumeX, Play } from 'lucide-react';
import { useRef, useState, useEffect, useCallback } from 'react';

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasUserInteraction, setHasUserInteraction] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const startPlayback = useCallback(async (withSound: boolean) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !withSound;
    setIsMuted(!withSound);

    try {
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      if (withSound) {
        try {
          audio.muted = true;
          setIsMuted(true);
          await audio.play();
          setIsPlaying(true);
          return;
        } catch (retryError) {
          console.error('음소거 재생도 실패:', retryError);
        }
      }
      console.error('오디오 재생 실패:', error);
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    if (hasUserInteraction) return;

    let handled = false;
    const interactionEvents: Array<keyof WindowEventMap> = [
      'scroll',
      'wheel',
      'touchmove',
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

  const handleInitialPlay = () => {
    setHasUserInteraction(true);
    void startPlayback(true);
  };

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setIsMuted(false);
    } else {
      setHasUserInteraction(true);
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

      <audio ref={audioRef} loop preload='auto' src='/music/here-with-me.mp3' />
    </>
  );
}
