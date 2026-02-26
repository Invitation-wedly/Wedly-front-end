import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '@/common/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/common/components/ui/dialog';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Textarea } from '@/common/components/ui/textarea';
import type { GuestbookEntry } from '@/lib/types';
import supabase from '@/supabase-client';

interface ICommentEditDialogProps {
  message: GuestbookEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export default function CommentEditDialog({
  message,
  isOpen,
  onClose,
  onUpdated,
}: ICommentEditDialogProps) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen || !message) return;
    setName(message.name || '');
    setComment(message.comment || '');
    setPassword('');
  }, [isOpen, message]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message || isSubmitting) return;

    const trimmedComment = comment.trim();
    if (!password.trim()) {
      toast.error('비밀번호를 입력해주세요.');
      return;
    }

    if (!trimmedComment) {
      toast.error('메시지 내용을 작성해주세요.');
      return;
    }

    setIsSubmitting(true);

    const updateMessage = async () => {
      const { data: verifiedData } = await supabase
        .from('guestbook')
        .select('id')
        .eq('id', message.id)
        .eq('password', password)
        .single();

      if (!verifiedData) {
        throw new Error('비밀번호가 일치하지 않습니다.');
      }

      const { error } = await supabase
        .from('guestbook')
        .update({
          name: name.trim() || '익명',
          comment: trimmedComment,
        })
        .eq('id', message.id);

      if (error) throw error;
    };

    try {
      await toast.promise(updateMessage(), {
        loading: '메시지를 수정하고 있습니다...',
        success: '메시지가 수정되었습니다.',
        error: (err) => {
          return err instanceof Error
            ? err.message
            : '오류가 발생했습니다. 다시 시도해주세요.';
        },
      });

      onUpdated();
      onClose();
      setPassword('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setPassword('');
          onClose();
        }
      }}
    >
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>메시지 수정</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpdate} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='edit-name'>이름 (선택)</Label>
            <Input
              id='edit-name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='익명'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='edit-password'>비밀번호</Label>
            <Input
              id='edit-password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='작성 시 입력한 비밀번호'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='edit-comment'>축하 메시지</Label>
            <Textarea
              id='edit-comment'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='축하 메시지를 작성해주세요.'
              className='min-h-[100px]'
              required
            />
          </div>

          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                setPassword('');
                onClose();
              }}
            >
              취소
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting}
              className='bg-pink-600 text-white hover:bg-blue-700 disabled:bg-blue-300'
            >
              수정
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
