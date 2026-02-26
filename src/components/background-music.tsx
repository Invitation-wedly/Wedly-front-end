import { Button } from '@/common/components/ui/button';
import { Volume2, VolumeX, Play } from 'lucide-react';
import { useRef, useState, useEffect, useCallback } from 'react';

interface BackgroundMusicProps {
  hasVideo: boolean;
}

export default function BackgroundMusic({ hasVideo }: BackgroundMusicProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasUserInteraction, setHasUserInteraction] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const startPlayback = useCallback(
    async (withSound: boolean) => {
      const audio = audioRef.current;
      if (!audio || hasVideo) return;

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
    },
    [hasVideo],
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (hasVideo) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    if (hasUserInteraction) {
      void startPlayback(true);
    } else {
      void startPlayback(false);
    }
  }, [hasVideo, hasUserInteraction, startPlayback]);

  useEffect(() => {
    if (hasVideo || hasUserInteraction) return;

    let handled = false;
    const interactionEvents: Array<keyof WindowEventMap> = [
      'pointerdown',
      'touchstart',
      'keydown',
      'wheel',
      'scroll',
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
  }, [hasVideo, hasUserInteraction, startPlayback]);

  const handleInitialPlay = () => {
    setHasUserInteraction(true);
    void startPlayback(true);
  };

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio || hasVideo) return;

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
      {!hasVideo && (
        <div className='fixed top-0 left-0 right-0 z-40'>
          <div className='max-w-screen-sm mx-auto relative'>
            <div className='absolute top-4 right-4'>
              {!hasUserInteraction ? (
                <Button
                  variant='secondary'
                  size='sm'
                  className='rounded-full bg-white/80 hover:bg-white/90 shadow-sm animate-pulse z-50'
                  onClick={handleInitialPlay}
                >
                  <Play className='w-4 h-4' />
                </Button>
              ) : (
                <Button
                  variant='secondary'
                  size='sm'
                  className='rounded-full bg-white/80 hover:bg-white/90 shadow-sm'
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
      )}

      <audio ref={audioRef} loop preload='auto' src='/music/here-with-me.mp3' />
    </>
  );
}
