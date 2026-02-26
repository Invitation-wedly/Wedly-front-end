import { useEffect, useState } from 'react';
import { VolumeOff } from 'lucide-react';
import LoaderLoading from '@/common/components/loader-loading';

interface VideoPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  onVideoError?: () => void;
}

export default function VideoPlayer({
  videoUrl,
  posterUrl,
  onVideoError,
}: VideoPlayerProps) {
  const [muted, setMuted] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setMuted(true);
  }, [videoUrl]);

  const onClick = () => {
    setMuted((prev) => !prev);
  };

  const handleReady = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onVideoError?.();
    console.error('비디오 로딩 중 오류가 발생했습니다:', videoUrl);
  };

  if (hasError) {
    return (
      <div className='w-full aspect-[4/5] flex items-center justify-center bg-gray-100'>
        <p className='text-red-500'>비디오를 불러올 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className='relative z-30 w-full aspect-[4/5] overflow-hidden bg-black'>
      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-100'>
          <LoaderLoading />
        </div>
      )}
      <video
        className='h-full w-full object-cover'
        preload='metadata'
        loop
        autoPlay
        muted={muted}
        playsInline
        poster={posterUrl}
        onLoadedMetadata={handleReady}
        onCanPlay={handleReady}
        onError={handleError}
      >
        <source src={videoUrl} type='video/mp4' />
        영상을 지원하지 않는 브라우저입니다.
      </video>
      {muted && (
        <button
          className='absolute left-4 top-4 z-10 flex items-center gap-1 rounded-lg bg-gray-50/90 px-2 py-1 text-xs active:bg-gray-100'
          type='button'
          onClick={onClick}
        >
          <VolumeOff className='w-4 h-4' />
          음소거 해제
        </button>
      )}
    </div>
  );
}
