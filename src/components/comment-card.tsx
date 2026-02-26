import { GuestbookEntry } from '@/lib/types';
import { Button } from '@/common/components/ui/button';

interface ICommentCardProps {
  message: GuestbookEntry;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

export function CommentCard({
  message,
  onEditClick,
  onDeleteClick,
}: ICommentCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
  };

  return (
    <div className='rounded-2xl border border-white/80 bg-white/90 p-4 text-sm shadow-[0_8px_20px_-16px_rgba(15,23,42,0.6)]'>
      <div className='mb-3 flex items-center justify-between'>
        <h3 className='text-sm font-semibold text-slate-800'>{message.name}</h3>
        <div className='flex items-center gap-1'>
          <Button
            className='h-7 rounded-full px-3 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800'
            variant='ghost'
            size='sm'
            onClick={onEditClick}
          >
            수정
          </Button>
          <Button
            className='h-7 rounded-full px-3 text-xs text-rose-500 hover:bg-rose-50 hover:text-rose-600'
            variant='ghost'
            size='sm'
            onClick={onDeleteClick}
          >
            삭제
          </Button>
        </div>
      </div>
      <p className='whitespace-pre-wrap text-sm font-medium leading-6 text-slate-700'>
        {message.comment}
      </p>
      <time className='mt-4 flex justify-end text-xs text-slate-400'>
        {formatDate(message.created_at)}
      </time>
    </div>
  );
}
