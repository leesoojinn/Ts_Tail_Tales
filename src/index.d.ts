declare module "react-full-page" {
  import * as React from "react";

  export interface ControlComponentsProps {
    getCurrentSlideIndex: () => number;
    onNext: () => void;
    onPrev: () => void;
    scrollToSlide: (n: number) => void;
    slidesCount: number;
    children: React.ReactNode;
  }

  export interface FullPageProps {
    initialSlide?: number;
    duration?: number;
    controls?: boolean | React.FC<ControlComponentsProps>;

    controlProps?: string;
    beforeChange?: () => void;
    afterChange?: () => void;
    scrollMode?: "full-page" | "normal";
    children: React.ReactNode;
  }

  export interface SlideProps {
    children: React.ReactNode;
    style?: { maxHeight: string };
  }

  export const FullPage: React.FC<FullPageProps>;

  export const Slide: React.FC<SlideProps>;
}
