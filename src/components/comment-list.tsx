import { useEffect, useState } from 'react';
import { GuestbookEntry } from '@/lib/types';
import supabase from '@/supabase-client';
import { CommentCard } from '@/components/comment-card';
import CommentDeleteDialog from './comment-delete-dialog';
import CommentEditDialog from './comment-edit-dialog';
import Intersect from '@/common/components/intersect';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import LoaderLoading from '@/common/components/loader-loading';

interface ICommentListProps {
  onMessageAdded?: () => void;
}

const LIST_SIZE = 5;

export default function CommentList({ onMessageAdded }: ICommentListProps) {
  const [messages, setMessages] = useState<GuestbookEntry[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingMessage, setEditingMessage] = useState<GuestbookEntry | null>(
    null,
  );
  const [visibleCount, setVisibleCount] = useState(LIST_SIZE);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMessages(data);
    }
    setIsLoading(false);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + LIST_SIZE);
  };

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel('guestbook_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'guestbook' },
        (payload) => {
          setMessages((prev) => [payload.new as GuestbookEntry, ...prev]);
          onMessageAdded?.();
        },
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'guestbook' },
        (payload) => {
          setMessages((prev) =>
            prev.filter((msg) => msg.id !== payload.old.id),
          );
          onMessageAdded?.();
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'guestbook' },
        (payload) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === payload.new.id ? (payload.new as GuestbookEntry) : msg,
            ),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onMessageAdded]);

  return (
    <div className='space-y-3'>
      {isLoading ? (
        <div className='rounded-2xl border border-white/80 bg-white/70 py-8'>
          <LoaderLoading />
        </div>
      ) : messages.length === 0 ? (
        <div className='flex flex-col items-center justify-center space-y-2 rounded-2xl border border-dashed border-emerald-300/80 bg-white/70 py-10'>
          <p className='text-sm text-emerald-700'>아직 메시지가 없습니다.</p>
          <p className='text-sm text-slate-600'>첫 번째 메시지를 남겨보세요!</p>
        </div>
      ) : (
        <>
          {messages.slice(0, visibleCount).map((message, index) => (
            <Intersect key={message.id} type='data-animate'>
              <CommentCard
                message={message}
                onEditClick={() => setEditingMessage(message)}
                onDeleteClick={() => setDeleteId(message.id)}
                data-animate-stage={(index % LIST_SIZE) + 1}
              />
            </Intersect>
          ))}

          <CommentEditDialog
            message={editingMessage}
            isOpen={editingMessage !== null}
            onClose={() => setEditingMessage(null)}
            onUpdated={fetchMessages}
          />

          <CommentDeleteDialog
            id={deleteId!}
            isOpen={deleteId !== null}
            onClose={() => setDeleteId(null)}
            onDelete={fetchMessages}
          />

          {visibleCount < messages.length && (
            <div className='flex justify-center pt-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleLoadMore}
                className='h-9 rounded-full border border-emerald-200 bg-white/80 px-4 text-emerald-700 hover:bg-emerald-50'
              >
                더보기
                <ChevronDown className='w-4 h-4' />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
