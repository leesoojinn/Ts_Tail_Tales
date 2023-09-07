import React from "react";
import { FullPage, Slide } from "react-full-page";
import MainSliderOne from "../components/mains/MainSliderOne";
import MainSliderSecond from "../components/mains/MainSliderSecond";
import MainSliderThird from "../components/mains/MainSliderThird";
import MainSliderLast from "../components/mains/MainSliderLast";
import "../styles/style.main.css";

function Landing() {
  return (
    <FullPage controls controlsProps={{ className: "slide-navigation" }}>
      <Slide>
        <MainSliderOne />
      </Slide>
      <Slide>
        <MainSliderSecond />
      </Slide>
      <Slide>
        <MainSliderThird />
      </Slide>
      <Slide>
        <MainSliderLast />
      </Slide>
    </FullPage>
  );
}

export default Landing;
