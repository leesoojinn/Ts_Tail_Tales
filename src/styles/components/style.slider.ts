import styled from "styled-components";
import Slider from "react-slick";

export const SliderContainer = styled.div`
  margin: 0 auto;
  max-width: 1200px;
`;

export const SliderCard = styled(Slider)`
  .slick-slide > div {
    width: 300%;
    padding: 10px;
    box-sizing: border-box;
    max-width: 1000px;
    margin-left: 30px;
  }

  .slick-prev {
    left: -40px;
    z-index: 1;
  }

  .slick-next {
    right: -40px;
    z-index: 1;
  }

  .slick-prev:before,
  .slick-next:before {
    color: #746464;
    opacity: 1;
    transition: all 0.3s ease;
  }

  .slick-prev.slick-disabled:before,
  .slick-next.slick-disabled:before {
    color: gray;
  }
`;
