import { parse } from "date-fns";

export const SPLASH_TEXT = [`진배, 윤정 결혼합니다.`];

// 비디오 정보 (첫 화면 비디오가 있으면 배너 이미지 보다는 비디오가 우선적으로 보여짐)
export const VIDEO_URL = '';
export const POSTER_URL = '';

// 배너 이미지 (맨위 처음에 보여지는 사진)
export const BANNERIMAGE =
  '/main.png';

// 결혼 초대장 문구 다음으로 보여질 이미지
export const WEDDING_INVITATION_IMAGE =
  '/main.png';

// 지도 & 날짜 정보
export const WEDDING_DATE = '2026.05.10';
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
  '○○○○ 하차: ○○○, ○○○, ○○○, ○○○, ○○○, ○○○, ○○○, ○○○',
  '○○○○ 하차: ○○○, ○○○, ○○○',
];
export const WEDDING_PARKING = ['맞은편 전용 주차장(주차타워) 이용.', '(주소 : 서초동 1426-5번지 or 서초구 서초중앙로2길 10)'];
export const WEDDING_MAP_LOT = 126.810144; // 경도
export const WEDDING_MAP_LAT = 37.558830; // 위도

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
  { designation: '신랑 父', name: GROOM_FATHER_NAME, phone: '010-3115-3994' },
  { designation: '신랑 母', name: GROOM_MOTHER_NAME, phone: '010-3467-8382' },
];
export const BRIDE_CONTACT = [
  { designation: '신부', name: BRIDE_NAME, phone: '○○○-○○○-○○○○' },
  { designation: '신부 父', name: BRIDE_FATHER_NAME, phone: '○○○-○○○-○○○○' },
  { designation: '신부 母', name: BRIDE_MOTHER_NAME, phone: '○○○-○○○-○○○○' },
];

// 계좌번호 정보
export const GROOM_ACCOUNTS = [
  { holder: '○○○', bank: '○○은행', number: '○○○-○○○-○○○○' },
  { holder: '○○○', bank: '○○은행', number: '○○○-○○○-○○○○' },
  { holder: '○○○', bank: '○○은행', number: '○○○-○○○-○○○○' },
];

export const BRIDE_ACCOUNTS = [
  { holder: '○○○', bank: '○○은행', number: '○○○-○○○-○○○○' },
  { holder: '○○○', bank: '○○', number: '○○○-○○○-○○○○' },
  { holder: '○○○', bank: '○○○뱅크', number: '○○○-○○○-○○○○' },
];

// 갤러리 이미지
export const GALLERY_IMAGES = [
  '/main.png',
  '/main.png',
  '/main.png',
  '/main.png',
  '/main.png',
  '/main.png',
  '/main.png',
  '/main.png',
  '/main.png',
  '/main.png',
  '/main.png',
  '/main.png',
  '/main.png',
  '/main.png',
  '/main.png',
  '/main.png',
  '/main.png',
  '/main.png',
  '/main.png'
];
