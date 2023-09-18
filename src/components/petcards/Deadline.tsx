import React from "react";
import Slider from "react-slick";

function Deadline() {
  // 슬라이더 설정
  const settings = {
    dots: true,
    infinite: true, // 무한 루프 여부
    speed: 500,
    slidesToShow: 3, // 화면에 보여질 슬라이드 개수
    slidesToScroll: 3, // 스크롤 시 이동할 슬라이드 개수
  };

  return (
    <div>
      <h2> Multiple items </h2>
      {/* Slider 컴포넌트를 사용하여 이미지 슬라이드 구현 */}
      <Slider {...settings}>
        <div>
          <h3>1</h3>
        </div>
        <div>
          <h3>2</h3>
        </div>
        <div>
          <h3>3</h3>
        </div>
        <div>
          <h3>4</h3>
        </div>
        <div>
          <h3>5</h3>
        </div>
        <div>
          <h3>6</h3>
        </div>
        <div>
          <h3>7</h3>
        </div>
        <div>
          <h3>8</h3>
        </div>
        <div>
          <h3>9</h3>
        </div>
      </Slider>
    </div>
  );
}

export default Deadline;
