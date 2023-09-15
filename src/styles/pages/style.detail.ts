import styled from "styled-components";

export const StDetailDivContainer = styled.div`
  position: relative;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: #fdfaf6;
`;

export const StDetailText = styled.div`
  margin-top: 100px;
  color: black;
  .backBtn {
    background: none;
    border: none;
    color: black;
  }
  .detailtext {
    margin: 0 auto;
    max-width: 350px;
    padding: 20px 0 20px;
  }

  strong {
    color: #746464;
  }

  @media (max-width: 770px) {
    padding-right: 35px;
  }
`;
export const BackIcon = styled.button`
  margin-left: 20px;
  font-size: 20px;
  font-weight: bolder;
  border-radius: 50%;
  color: black;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.7);
    color: #868686;
  }
`;
export const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: white;

  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 768px) {
    padding: 0 2rem;
    background: #fdfaf6;
  }

  .petimg {
    border-radius: 20px;
    border: none;
    height: 680px;

    @media (max-width: 770px) {
      height: 400px;
    }
  }

  .top {
    background: white;
    border: 1px solid black;
    padding: 15px 15px 15px 15px;
    border-radius: 20px;
    border: none;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);

    display: flex;
    flex-direction: column;

    @media (min-width: 768px) {
      flex-direction: row;
      gap: 2rem;
    }
  }

  .img-container {
    position: relative;
    height: fit-content;
    overflow: hidden;

    @media (min-width: 768px) {
      width: 50%;
      margin-bottom: 0;
    }

    img {
      width: 100%;
      aspect-ratio: 1/1;
      object-fit: cover;
    }
  }

  .description {
    font-size: 17px;
    font-family: "NanumSquareNeo-Regular";

    @media (min-width: 768px) {
      width: 50%;
    }

    .noticeNo {
      width: 100%;
      font-size: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #000000;
      padding-block: 1rem;

      .date {
        font-size: 1.7rem;
      }
    }

    .table {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto;
      font-size: ${(props) => props.theme.pSize};

      .row {
        display: grid;
        grid-template-columns: 0.5fr 1fr;
        text-align: center;
        grid-template-rows: auto;
        padding: 0.7rem 0.5rem;
        border-bottom: 1px solid ${(props) => props.theme.textBlack};

        span {
          display: flex;
          justify-content: center;
          align-items: center;

          &:nth-child(1) {
            border-right: 1px solid ${(props) => props.theme.textBlack};
            font-weight: 600;
          }
          &:nth-child(2) {
            padding-left: 0.5rem;
          }
        }
      }
    }
  }

  .location {
    font-size: ${(props) => props.theme.pSize};
    color: ${(props) => props.theme.textBlack};
    p {
      padding-bottom: 2rem;
      span {
        font-weight: 600;
      }
    }

    .kakaomap {
      padding-bottom: 20px;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
    }
  }
`;

export const InquiryButton = styled.button`
  margin: 0 auto;
  width: 232px;
  height: 44px;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 999px;
  background: #746464;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);

  font-family: "BMJUA-Regular";

  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const Title = styled.span`
  font-size: 20px;
  font-family: "BMJUA-Regular";
`;
