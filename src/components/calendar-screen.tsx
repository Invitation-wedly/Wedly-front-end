import { Calendar } from '@/common/components/ui/calendar';
import { getWeddingCalendarRange, getWeddingScheduleDetails } from '../../config';
import { ko } from 'date-fns/locale';

export default function CalendarScreen() {
  const { date: weddingDate } = getWeddingScheduleDetails();
  const { from, to } = getWeddingCalendarRange();

  return (
    <>
      <h2 className='text-center text-xl font-en'>calendar</h2>
      <div className='flex justify-center my-4'>
        <img src='/ring.png' alt='반지' className='w-6 h-6 aspect-square' />
      </div>
      <div className='max-w-[400px] mx-auto md:max-w-[500px] lg:max-w-full'>
        <Calendar
          mode='single'
          selected={weddingDate}
          locale={ko}
          defaultMonth={weddingDate}
          disabled={(date) => {
            if (!from || !to) {
              return false;
            }

            return date < from || date > to;
          }}
        />
      </div>
    </>
  );
}
