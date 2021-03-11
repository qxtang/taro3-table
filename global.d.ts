declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module 'react' {
    export const memo: any;
    export const useCallback: any;
    export const useEffect: any;
    export const useState: <T>(init: any) => [any, (data: any) => void];
    export type CSSProperties = any;

    interface PropsWithChildren<T> {
        [prop: string]: any;
    }
}
declare module '@tarojs/taro';
declare module '@tarojs/components';

declare namespace NodeJS {
    interface ProcessEnv {
        TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd'
    }
}

declare namespace JSX {
    interface Element {
        [prop: string]: any;
    }
}
