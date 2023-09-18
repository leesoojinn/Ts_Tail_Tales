import React from "react";
import { FullPage, Slide } from "react-full-page";
import MainSliderIntroduction from "../components/mains/MainSliderIntroduction";
import MainSliderAnimals from "../components/mains/MainSliderAnimals";
import MainSliderFunction from "../components/mains/MainSliderFunction";
import MainSliderFooter from "../components/mains/MainSliderFooter";
import "../styles/style.main.css";

function Landing() {
  return (
    <FullPage controls controlsProps={{ className: "slide-navigation" }}>
      {/* 각 슬라이드를 FullPage 컴포넌트 안에 배치 */}
      <Slide>
        <MainSliderIntroduction />
      </Slide>
      <Slide>
        <MainSliderAnimals />
      </Slide>
      <Slide>
        <MainSliderFunction />
      </Slide>
      <Slide>
        <MainSliderFooter />
      </Slide>
    </FullPage>
  );
}

export default Landing;
