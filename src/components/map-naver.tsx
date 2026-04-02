import {
  WEDDING_MAP_LAT,
  WEDDING_MAP_LOT,
} from '../../config';
import { useEffect, useRef, useState } from 'react';

const NAVER_MARKER_ICON = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="38" viewBox="0 0 28 38" fill="none">
    <path
      d="M14 1C7.373 1 2 6.373 2 13c0 8.325 6.572 15.977 11.17 22.434a1 1 0 0 0 1.66 0C19.428 28.977 26 21.325 26 13 26 6.373 20.627 1 14 1Z"
      fill="#2F80ED"
      stroke="white"
      stroke-width="2"
    />
    <circle cx="14" cy="13" r="5.5" fill="white" />
    <circle cx="14" cy="13" r="2.75" fill="#2F80ED" />
  </svg>
`)}`;

export default function MapNaver() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapAvailable, setIsMapAvailable] = useState(true);

  const longitude = WEDDING_MAP_LOT;
  const latitude = WEDDING_MAP_LAT;

  useEffect(() => {
    if (!mapRef.current) return;

    let isCancelled = false;
    let mapInstance: any = null;
    let retryCount = 0;
    let retryTimer: number | null = null;
    const MAX_RETRY = 40;
    const RETRY_INTERVAL_MS = 150;

    const setMapAvailability = (isAvailable: boolean) => {
      if (isCancelled) return;
      setIsMapAvailable(isAvailable);
    };

    const previousAuthFailureHandler = window.navermap_authFailure;
    window.navermap_authFailure = () => {
      if (typeof previousAuthFailureHandler === 'function') {
        previousAuthFailureHandler();
      }
      console.error('[MapNaver] 네이버 지도 Open API 인증 실패');
      setMapAvailability(false);
    };

    const initializeMap = () => {
      if (isCancelled || !mapRef.current) return;

      const naverMaps = window.naver?.maps;
      if (!naverMaps) {
        retryCount += 1;
        if (retryCount > MAX_RETRY) {
          setMapAvailability(false);
          return;
        }
        retryTimer = window.setTimeout(initializeMap, RETRY_INTERVAL_MS);
        return;
      }

      try {
        const position = new naverMaps.LatLng(latitude, longitude);

        mapInstance = new naverMaps.Map(mapRef.current, {
          center: position,
          zoom: 17,
          draggable: false,
          zoomControl: false,
          scrollWheel: false,
          pinchZoom: false,
          disableDoubleClickZoom: true,
          disableDoubleTapZoom: true,
          disableTwoFingerTapZoom: true,
          keyboardShortcuts: false,
        });

        new naverMaps.Marker({
          position,
          map: mapInstance,
          clickable: false,
          icon: {
            url: NAVER_MARKER_ICON,
            size: new naverMaps.Size(28, 38),
            scaledSize: new naverMaps.Size(28, 38),
            origin: new naverMaps.Point(0, 0),
            anchor: new naverMaps.Point(14, 38),
          },
        });
        setMapAvailability(true);
      } catch (error) {
        console.error('[MapNaver] 지도 초기화 실패:', error);
        setMapAvailability(false);
      }
    };

    initializeMap();

    return () => {
      isCancelled = true;
      if (retryTimer !== null) {
        window.clearTimeout(retryTimer);
      }
      if (mapInstance?.destroy) {
        mapInstance.destroy();
      }
      if (typeof previousAuthFailureHandler === 'function') {
        window.navermap_authFailure = previousAuthFailureHandler;
      } else {
        delete window.navermap_authFailure;
      }
    };
  }, [latitude, longitude]);

  if (!isMapAvailable) {
    return (
      <div className='w-full map-wrapper'>
        <div className='flex h-[300px] items-center justify-center bg-gray-100 px-6 text-center text-sm text-gray-600 shadow-md'>
          지도 로딩에 실패했습니다.
          <br />
          아래 네비게이션 버튼을 이용해 주세요.
        </div>
      </div>
    );
  }

  return (
    <div className='w-full map-wrapper'>
      <div ref={mapRef} className='w-full h-[300px] touch-none shadow-md' />
    </div>
  );
}
