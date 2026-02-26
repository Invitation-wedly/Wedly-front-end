import { useState } from 'react';
import type { GuestbookFormData } from '@/lib/types';
import { toast } from 'react-hot-toast';
import supabase from '@/supabase-client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Label } from '@/common/components/ui/label';
import { Input } from '@/common/components/ui/input';
import { Textarea } from '@/common/components/ui/textarea';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommentFormDialogProps {
  onSuccess?: () => void;
}

export default function CommentFormDialog({
  onSuccess,
}: CommentFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState('');
  const [comment, setComment] = useState('');
  const canSubmit = Boolean(password.trim() && comment.trim()) && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data: GuestbookFormData = {
      name: (formData.get('name') as string) || '익명',
      password: formData.get('password') as string,
      comment: formData.get('comment') as string,
    };

    if (!data.password) {
      toast.error('비밀번호를 입력해주세요.');
      setIsSubmitting(false);
      return;
    }

    if (!data.comment) {
      toast.error('메시지 내용을 작성해주세요.');
      setIsSubmitting(false);
      return;
    }

    try {
      await toast.promise(
        async () => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          const result = await supabase.from('guestbook').insert([data]);
          if (result.error) throw result.error;
          return result;
        },
        {
          loading: '요청중...',
          success: '축하 메시지가 등록되었습니다! 🎉',
          error: '오류가 발생했습니다. 다시 시도해주세요.',
        },
      );

      setOpen(false);
      e.currentTarget.reset();
      setPassword('');
      setComment('');
      onSuccess?.();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setPassword('');
          setComment('');
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant='outline' className='rounded-full'>
          <Send className='w-4 h-4 mr-2' />
          보내기
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>축하 메시지 작성</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name' className='text-sm'>
              이름 (선택)
            </Label>
            <Input id='name' name='name' placeholder='익명' />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='password' className='text-sm'>
              비밀번호
            </Label>
            <Input
              id='password'
              name='password'
              type='password'
              placeholder='삭제시 필요합니다'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='comment' className='text-sm'>
              축하 메시지
            </Label>
            <Textarea
              id='comment'
              name='comment'
              placeholder='축하 메시지를 작성해주세요.'
              className='min-h-[100px]'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <Button
            type='submit'
            disabled={!canSubmit}
            className={cn(
              'w-full disabled:opacity-100',
              canSubmit
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : 'bg-gray-200 text-gray-400 hover:bg-gray-200',
            )}
          >
            메시지 등록하기
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
