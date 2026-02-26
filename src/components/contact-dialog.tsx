import { type ReactNode } from 'react';
import { Button } from '@/common/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/common/components/ui/dialog';

import { Mail, Phone, X } from 'lucide-react';

type Contact = {
  name: string;
  designation: string;
  phone: string;
};

export default function ContactDialog({
  groomList,
  priestList,
}: {
  groomList: Contact[];
  priestList: Contact[];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>연락하기</Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className='top-[50%] w-[min(92vw,420px)] max-w-[420px] gap-0 overflow-hidden rounded-sm border border-gray-200 bg-white p-0'
      >
        <div className='relative border-b border-gray-100 px-6 py-6'>
          <DialogTitle className='text-center text-[30px] leading-none'>
            연락하기
          </DialogTitle>
          <DialogClose
            className='absolute right-6 top-1/2 -translate-y-1/2 text-gray-700 transition-opacity hover:opacity-70'
            aria-label='닫기'
          >
            <X className='h-6 w-6' />
          </DialogClose>
        </div>
        <div className='max-h-[70vh] space-y-9 overflow-y-auto px-6 pb-8 pt-7'>
          <ContactSection title='신랑측' list={groomList} />
          <ContactSection title='신부측' list={priestList} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ContactSection({ title, list }: { title: string; list: Contact[] }) {
  return (
    <section>
      <h3 className='pb-4 text-[28px] leading-none text-gray-900'>{title}</h3>
      <div className='mb-2 h-px bg-gray-200' />
      <div className='space-y-2'>
        {list.map((contact, index) => (
          <ContactItem key={index} contact={contact} />
        ))}
      </div>
    </section>
  );
}

function ContactItem({ contact }: { contact: Contact }) {
  const dialNumber = getDialNumber(contact.phone);
  const isPhoneEnabled = Boolean(dialNumber);

  return (
    <div className='flex items-center gap-3 py-2'>
      <div className='w-16 text-sm text-gray-500'>{contact.designation}</div>
      <div className='flex-1 text-lg leading-none text-gray-900'>{contact.name}</div>
      <div className='flex items-center gap-2'>
        <ContactAction
          href={dialNumber ? `tel:${dialNumber}` : ''}
          disabled={!isPhoneEnabled}
          label={`${contact.name}에게 전화`}
        >
          <Phone className='h-[18px] w-[18px]' />
        </ContactAction>
        <ContactAction
          href={dialNumber ? `sms:${dialNumber}` : ''}
          disabled={!isPhoneEnabled}
          label={`${contact.name}에게 문자`}
        >
          <Mail className='h-[18px] w-[18px]' />
        </ContactAction>
      </div>
    </div>
  );
}

function ContactAction({
  href,
  disabled,
  label,
  children,
}: {
  href: string;
  disabled: boolean;
  label: string;
  children: ReactNode;
}) {
  if (disabled) {
    return (
      <span
        aria-label={label}
        aria-disabled='true'
        className='inline-flex h-11 w-14 items-center justify-center rounded-full border border-gray-200 text-gray-300'
      >
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      aria-label={label}
      className='inline-flex h-11 w-14 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 active:opacity-70'
    >
      {children}
    </a>
  );
}

function getDialNumber(phone: string): string | null {
  const normalized = phone.replace(/[^\d+]/g, '');
  if (normalized.replace(/\D/g, '').length < 7) return null;
  return normalized;
}
