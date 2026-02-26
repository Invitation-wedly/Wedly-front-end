import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu';
import { Separator } from '@/common/components/ui/separator';
import { copy } from '@/lib/copy';
import {
  WEDDING_ADDRESS,
  WEDDING_LOCATION_BUS,
  WEDDING_LOCATION,
  WEDDING_LOCATION_NAME,
  WEDDING_LOCATION_SUBWAY,
  WEDDING_MAP_LAT,
  WEDDING_MAP_LOT,
  WEDDING_PARKING,
} from '../../config';
import { Map } from 'lucide-react';

export default function MapInfo() {
  const navigationApps = [
    {
      label: '네이버지도',
      icon: '/ico_nav03.png',
      href: `https://map.naver.com/p/search/${encodeURIComponent(WEDDING_ADDRESS)}`,
    },
    {
      label: '티맵',
      icon: '/ico_nav02.png',
      href: `https://www.tmap.co.kr/tmap2/mobile/route.jsp?name=${encodeURIComponent(
        `${WEDDING_LOCATION_NAME} ${WEDDING_LOCATION}`,
      )}&lon=${WEDDING_MAP_LOT}&lat=${WEDDING_MAP_LAT}`,
    },
    {
      label: '카카오내비',
      icon: '/ico_nav01.png',
      href: `https://map.kakao.com/link/to/${encodeURIComponent(
        WEDDING_LOCATION_NAME,
      )},${WEDDING_MAP_LAT},${WEDDING_MAP_LOT}`,
    },
  ];

  return (
    <div className='mt-10 mx-8'>
      <div className='flex justify-between items-center'>
        <p>
          {WEDDING_ADDRESS}
          <br />
          <strong>{WEDDING_LOCATION_NAME}</strong>
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Map className='w-5 h-5' />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => copy(WEDDING_ADDRESS)}>
              주소복사하기
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='mt-10 space-y-8 text-gray-500 dark:text-foreground'>
        <div className='flex items-center'>
          <span className='w-14 text-foreground'>지하철</span>
          <Separator orientation='vertical' className='bg-foreground' />
          <div className='text-xs space-y-1'>
            {WEDDING_LOCATION_SUBWAY.map((subway, index) => (
              <p key={index}>{subway}</p>
            ))}
          </div>
        </div>
        <div className='flex items-center'>
          <span className=' w-14 text-foreground'>버스</span>
          <Separator orientation='vertical' className='bg-foreground' />
          <div className='text-xs space-y-1'>
            {WEDDING_LOCATION_BUS.map((bus, index) => (
              <p key={index}>{bus}</p>
            ))}
          </div>
        </div>
        <div className='flex items-center'>
          <span className='w-14 text-foreground'>주차</span>
          <Separator orientation='vertical' className='bg-foreground' />
          <div className='text-xs space-y-1'>
            {WEDDING_PARKING.map((parking, index) => (
              <p key={index}>{parking}</p>
            ))}
            <div className='flex gap-0.5'>
              *
              <span>
                주차장 이용이 혼잡하오니 불편하시더라도 대중교통 이용을 권장
                드립니다.
              </span>
            </div>
          </div>
        </div>

        <div className='rounded-xl border border-gray-200 bg-gray-100 px-4 py-5'>
          <h3 className='text-sm font-semibold text-foreground'>네비게이션</h3>
          <p className='mt-2 text-xs text-gray-500'>
            원하시는 앱을 선택하시면 길안내가 시작됩니다.
          </p>
          <div className='mt-4 grid grid-cols-3 gap-2'>
            {navigationApps.map((app) => (
              <button
                key={app.label}
                type='button'
                onClick={() => window.open(app.href, '_blank')}
                className='flex h-10 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2 text-xs font-medium text-gray-700'
              >
                <img
                  src={app.icon}
                  alt={app.label}
                  className='h-4 w-4 object-contain'
                />
                <span>{app.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div >
  );
}
