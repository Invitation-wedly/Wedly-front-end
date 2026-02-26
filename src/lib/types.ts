declare global {
  interface Window {
    naver: any;
    Kakao: any;
    navermap_authFailure?: () => void;
  }
}

export interface GuestbookEntry {
  id: number;
  name: string;
  password: string;
  comment: string;
  created_at: string;
}

export interface GuestbookFormData {
  name: string;
  password: string;
  comment: string;
}

export {};
