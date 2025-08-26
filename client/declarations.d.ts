import { IGoogle, ITapEventDetail } from 'interfaces/google';

export {};

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.gif';
declare module '*.avif';
declare module '*.webp';
declare module 'unidecode';

interface CustomEventMap {
  oneTapClick: CustomEvent<ITapEventDetail>;
}

declare global {
  interface Window {
    google?: IGoogle;
  }

  interface Document {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void,
    ): void;
    dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void;
  }
}
