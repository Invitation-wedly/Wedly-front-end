import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/common/components/ui/accordion';
import { Separator } from '@/common/components/ui/separator';
import { copy } from '@/lib/copy';
import { cn } from '@/lib/utils';
import { Copy } from 'lucide-react';

export default function BankAccordion({
  title,
  bankList,
}: {
  title: string;
  bankList: { holder: string; bank: string; number: string }[];
}) {
  return (
    <div className='mt-8 mx-4'>
      <Accordion type='single' collapsible>
        <AccordionItem
          value='item-1'
          className='rounded-2xl border border-gray-200 bg-white shadow-sm'
        >
          <AccordionTrigger className='px-5 py-5 text-base font-semibold dark:text-background'>
            {title}
          </AccordionTrigger>
          <AccordionContent className='space-y-3 px-4 pb-5'>
            {bankList.map(({ holder, bank, number }, i) => (
              <div key={i} className='relative rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm'>
                <div className='pr-24'>
                  <div className='mb-2 flex items-center gap-2 text-sm text-muted-foreground'>
                    <div className='text-lg'>{holder}</div>
                    <Separator
                      orientation='vertical'
                      className='h-3 bg-foreground/40'
                    />
                    <div>{bank}</div>
                  </div>
                  <div className='text-lg leading-none tracking-wide'>
                    {number}
                  </div>
                </div>
                <button
                  type='button'
                  className={cn(
                    'absolute right-3 top-1/2 -translate-y-1/2',
                    'inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium',
                    'transition-colors hover:bg-gray-100',
                  )}
                  onClick={() => copy(`${bank} ${number}`)}
                >
                  <Copy className='h-4 w-4' />
                  복사
                </button>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
