import {
  WEDDING_ADDRESS,
  WEDDING_MAP_LAT,
  WEDDING_MAP_LOT,
} from '../../config';
import { useEffect, useRef, useState } from 'react';

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
          zoom: 15,
          draggable: false,
          zoomControl: false,
          scrollWheel: false,
          pinchZoom: false,
          disableDoubleClickZoom: true,
          disableDoubleTapZoom: true,
          disableTwoFingerTapZoom: true,
          keyboardShortcuts: false,
        });

        const marker = new naverMaps.Marker({
          position,
          map: mapInstance,
        });

        const infoWindow = new naverMaps.InfoWindow({
          content: `
            <div class="p-4 bg-white shadow-lg text-center">
              <h3 class="font-bold text-lg">더 화이트베일</h3>
              <p class="text-gray-600">${WEDDING_ADDRESS}</p>
            </div>
          `,
          borderColor: 'transparent',
        });

        infoWindow.open(mapInstance, marker);
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
      <div className='w-full'>
        <div className='flex h-[400px] items-center justify-center bg-gray-100 px-6 text-center text-sm text-gray-600 shadow-md'>
          지도 로딩에 실패했습니다.
          <br />
          아래 네비게이션 버튼을 이용해 주세요.
        </div>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <div ref={mapRef} className='w-full h-[400px] touch-none shadow-md' />
    </div>
  );
}
