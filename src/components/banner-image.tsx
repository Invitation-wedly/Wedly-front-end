import { BANNERIMAGE } from "../../config";

export default function BannerImage() {
  return (
    <div className='relative w-full aspect-4/5'>
      <img
        src={BANNERIMAGE}
        alt='웨딩 배너 이미지'
        className='w-full h-full object-cover'
      />
    </div>
  );
}
