import { parse } from "date-fns";

export const SPLASH_TEXT = [`진배, 윤정 결혼합니다.`];

// 비디오 정보 (첫 화면 비디오가 있으면 배너 이미지 보다는 비디오가 우선적으로 보여짐)
export const VIDEO_URL = '/movie.mp4';
export const POSTER_URL = '';

// 배너 이미지 (맨위 처음에 보여지는 사진)
export const BANNERIMAGE =
  '/main.png';

// 결혼 초대장 문구 다음으로 보여질 이미지
export const WEDDING_INVITATION_IMAGE =
  '/image/invitation.jpeg';

// 지도 & 날짜 정보
export const WEDDING_DATE = '2026.05.10';
export const WEDDING_DATE_DAY = '일';
export const WEDDING_DATE2 = '2026-05-10';
export const WEDDING_TIME = '11:00';
export const WEDDING_LOCATION = '더 화이트베일 3층';
export const WEDDING_LOCATION_NAME = 'V홀';
export const WEDDING_ADDRESS = '서울 서초구 서초동 1445-14';
export const WEDDING_LOCATION_SUBWAY = [
  '[3호선] 남부터미널역 4-1번 출구 바로 앞',
  '[3호선] 남부터미널역 4번 출구 도보 2분 이내'
];
export const WEDDING_LOCATION_BUS = [
  '지선버스(G, 초록색) : 4319(사당-남부터미널-잠실)',
  '간선버스(B, 파란색) : 461(장지동-남부터미널-여의도), 641(문래동-남부터미널-양재동)',
  '직행・공항버스 : 5300-1(수원-남부터미널-강남역), 8501(수원대-남부터미널-양재꽃시장)',
];
export const WEDDING_PARKING = ['맞은편 전용 주차장(주차타워) 이용.', '(주소 : 서초동 1426-5번지 or 서초구 서초중앙로2길 10)'];
export const WEDDING_MAP_LOT = 127.0179212; // 경도
export const WEDDING_MAP_LAT = 37.4838261; // 위도
export const BEST_PHOTO_FORM_URL = 'https://forms.gle/L8cEBH2nQtxpUTFx9';
export const BEST_PHOTO_FORM_DESCRIPTION =
  '여러분이 생각하시는 최고의 사진을 10장 올려주세요';

export function getWeddingScheduleDetails() {
  const dateString = `${WEDDING_DATE2} ${WEDDING_TIME}`;
  const date = parse(dateString, 'yyyy-MM-dd HH:mm', new Date());
  const isValidDate = !isNaN(date.getTime());

  return {
    dateString,
    date,
    isValidDate
  }
}

// 신랑 & 신부 정보
export const GROOM_NAME = '정진배';
export const GROOM_FATHER_NAME = '정하용';
export const GROOM_MOTHER_NAME = '강영숙';
export const BRIDE_NAME = '김윤정';
export const BRIDE_FATHER_NAME = '김명호';
export const BRIDE_MOTHER_NAME = '박영이';

// 연락처
export const GROOM_CONTACT = [
  { designation: '신랑', name: GROOM_NAME, phone: '010-2191-8382' },
  { designation: '신랑 아버지', name: GROOM_FATHER_NAME, phone: '010-3115-3994' },
  { designation: '신랑 어머니', name: GROOM_MOTHER_NAME, phone: '010-3467-8382' },
];
export const BRIDE_CONTACT = [
  { designation: '신부', name: BRIDE_NAME, phone: '010-2025-4505' },
  { designation: '신부 아버지', name: BRIDE_FATHER_NAME, phone: '010-6752-4505' },
  { designation: '신부 어머니', name: BRIDE_MOTHER_NAME, phone: '010-6757-4505' },
];

// 계좌번호 정보
export const GROOM_ACCOUNTS = [
  { holder: '정진배', bank: '우리은행', number: '1002-395-082800' },
  { holder: '정하용', bank: '신한은행', number: '389-12-19703-0' },
  { holder: '강영숙', bank: '새마을금고', number: '0901-10-009213-1' },
];

export const BRIDE_ACCOUNTS = [
  { holder: '김윤정', bank: '농협', number: '302-2025-4505-51' },
  { holder: '김명호', bank: '우리은행', number: '217-070282-02-101' },
  { holder: '박영이', bank: '농협', number: '211084-52-250604' },
];

// 갤러리 이미지
const GALLERY_IMAGE_FILES = Array.from(
  { length: 21 },
  (_, index) => `gallery-${index + 1}.jpeg`,
);

export const GALLERY_IMAGES = GALLERY_IMAGE_FILES.map((file) => ({
  src: `/image/${file}`,
  display: `/image/view/${file}`,
  thumbnail: `/image/thumb/${file}`,
  alt: `Wedding photo ${file.replace('.jpeg', '').replace('gallery-', '')}`,
}));
