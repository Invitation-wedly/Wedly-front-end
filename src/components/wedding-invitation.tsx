import { Separator } from '@/common/components/ui/separator';
import {
    GROOM_NAME,
    BRIDE_NAME,
    WEDDING_DATE,
    WEDDING_TIME,
    WEDDING_LOCATION, WEDDING_LOCATION_NAME, WEDDING_DATE_DAY,
} from '../../config';

export default function WeddingInvitation() {
  return (
    <>
      <h2 className='text-center text-xl font-en '>WEDDING INVITATION</h2>

      <div className='flex justify-center my-4'>
        <img src='/ring.png' alt='반지' className='w-6 h-6 aspect-square' />
      </div>
      <div className='text-center'>
        <div className='flex justify-center items-center gap-1 h-3 space-x-0.5'>
          <span>{GROOM_NAME}</span>
          {/*<Separator orientation='vertical' className='bg-foreground' />*/}
            <span style={{ color: '#ff0000' }}>♥</span>
          <span>{BRIDE_NAME}</span>
        </div>
        <div className='mt-4 text-sm text-gy-6 leading-7'>
          {WEDDING_DATE}. ({WEDDING_DATE_DAY}) {WEDDING_TIME}
          <br />
          {WEDDING_LOCATION} / {WEDDING_LOCATION_NAME}
        </div>
      </div>
    </>
  );
}
