import Layout from '@/common/components/layout';
import Intersect from '@/common/components/intersect';
import SplashScreen from '@components/splash-screen';
import VideoPlayer from '@/components/video-player';
import WeddingInvitation from '@/components/wedding-invitation';
import Phrase from '@/components/phrase';
import Contact from '@/components/contact';
import WeddingDayTemplate from './common/components/ui/specific/wedding/WeddingDayTemplate';
import Gallery from '@/components/gallery';
import MapNaver from '@/components/map-naver';
import MapInfo from '@/components/map-info';
import BankAccordion from '@/components/bank-accordion';
import CommentFormDialog from '@/components/comment-form-dialog';
import CommentList from '@/components/comment-list';
import Share from '@/components/share';
import BannerImage from '@/components/banner-image';
import BackgroundMusic from '@/components/background-music';
import { useState } from 'react';
import { Camera, ExternalLink } from 'lucide-react';
import {
  BRIDE_ACCOUNTS,
  BEST_PHOTO_FORM_DESCRIPTION,
  BEST_PHOTO_FORM_URL,
  GALLERY_IMAGES,
  GROOM_ACCOUNTS,
  POSTER_URL,
  VIDEO_URL,
  WEDDING_INVITATION_IMAGE,
} from '../config';

function App() {
  const [hasVideoError, setHasVideoError] = useState(false);
  const [, setMessageAdded] = useState(false);
  const hasVideo = Boolean(VIDEO_URL) && !hasVideoError;

  return (
    <>
      <SplashScreen />
      <Layout>
        <BackgroundMusic />
        {/* 비디오 또는 배너 이미지 */}
        <section className='w-full'>
          {hasVideo ? (
            <VideoPlayer
              videoUrl={VIDEO_URL}
              posterUrl={POSTER_URL}
              onVideoError={() => setHasVideoError(true)}
            />
          ) : (
            <Intersect>
              <BannerImage />
            </Intersect>
          )}
        </section>
        {/* 결혼 초대장 */}
        <section className='bg-background mt-10'>
          <Intersect>
            <WeddingInvitation />
            <div className='mt-10'>
              <img
                className='w-full h-full  pointer-events-none'
                src={WEDDING_INVITATION_IMAGE}
                alt='결혼사진'
              />
            </div>
          </Intersect>
        </section>
        {/* 결혼 청접장 문구 & 연락처 */}
        <section className='text-sm mt-20'>
          <Intersect>
            <Phrase />
          </Intersect>
          <Intersect>
            <Contact />
          </Intersect>
        </section>
        {/* 결혼식 날짜 */}
        <section className='my-20'>
          <Intersect>
            <WeddingDayTemplate />
          </Intersect>
        </section>
        {/* 결혼식 갤러리 */}
        <section className='my-20'>
          <Intersect>
            <Gallery images={GALLERY_IMAGES} />
          </Intersect>
        </section>
        {/* 찾아오시는 길*/}
        <section className='my-20'>
          <Intersect>
            <h2 className='text-center pb-10'>오시는 길</h2>
            <MapNaver />
            <MapInfo />
          </Intersect>
        </section>
        {/* 계좌번호 */}
        <section className='my-24'>
          <Intersect>
            <div className='flex flex-col justify-center items-center'>
              <h2 className='text-center text-2xl mb-5'>마음 전하실 곳</h2>
              <div className='text-center text-base leading-8'>
                참석이 어려우신 분들을 위해
                <br />
                계좌번호를 기재하였습니다.
                <br />
                너그러운 마음으로 양해 부탁드립니다.
              </div>
            </div>
            <BankAccordion title='신랑측 계좌번호' bankList={GROOM_ACCOUNTS} />
            <BankAccordion title='신부측 계좌번호' bankList={BRIDE_ACCOUNTS} />
          </Intersect>
        </section>
        {/* 방명록 */}
        <section className='my-20 '>
          <Intersect className='space-y-8'>
            <h2 className='text-center'>축하 메시지</h2>
            <div className='text-center'>
              <CommentFormDialog
                onSuccess={() => setMessageAdded((prev) => !prev)}
              />
            </div>

            <CommentList
              onMessageAdded={() => setMessageAdded((prev) => !prev)}
            />
          </Intersect>
        </section>
        {/* 공유하기 */}
        <footer className='relative mt-20 pb-10'>
          <div className='flex items-center justify-center'>
            <Share />
          </div>
          <div className='mx-auto mt-8 w-full max-w-md px-6'>
            <div className='relative overflow-hidden rounded-2xl border border-rose-200/70 bg-gradient-to-br from-rose-50 via-white to-amber-50 px-5 py-6 shadow-[0_10px_30px_-15px_rgba(190,24,93,0.45)]'>
              <div className='pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-rose-200/50 blur-2xl' />
              <div className='relative z-10 text-center'>
                <div className='inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-rose-600 ring-1 ring-rose-200'>
                  <Camera className='h-3.5 w-3.5' />
                  BEST PHOTO
                </div>
                <p className='mt-3 text-sm leading-6 text-gray-700'>
                  {BEST_PHOTO_FORM_DESCRIPTION}
                </p>
                <a
                  href={BEST_PHOTO_FORM_URL}
                  target='_blank'
                  rel='noreferrer'
                  className='group mx-auto mt-4 inline-flex h-11 w-full max-w-xs items-center justify-center gap-1.5 rounded-full bg-rose-500 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-600'
                >
                  사진 업로드하러 가기
                  <ExternalLink className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </Layout>
    </>
  );
}

export default App;
