import styled from "styled-components";

export const Div = styled.div`
  background-color: #fdfaf6;

  position: relative;
  position: absolute;
  padding-bottom: 160px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;

  .filtered {
    display: flex;
    justify-content: center;
    padding: 100px 0 15px 0;
    margin-top: 20px;
    margin-bottom: 30px;
  }
  .highlighted {
    color: #d73131;
  }

  .deadline {
    font-weight: bolder;
    color: white;
    font-weight: bold;
  }
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;
  gap: 50px;
  margin-bottom: 20px;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;

  @media (max-width: 770px) {
    overflow-y: scroll;
    max-height: calc(100vh - 150px);
  }
`;

export const FilteredSection = styled.div`
  background-image: url("/image/homes/home1.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  object-fit: cover;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5em;
  padding: 100px 0 15px 0;
  margin-bottom: 30px;
  height: 300px;
  object-fit: cover;
  color: white;
  font-weight: bold;

  .highlighted {
    color: #ffb9b9;
  }

  @media (max-width: 770px) {
    background-image: url("/image/homes/home3.jpg");
    font-size: 2em;
    justify-content: center;
    text-align: center;

    .highlighted {
      white-space: nowrap;
    }

    @media (max-width: 375px) {
      font-size: 1.7em;
    }
  }
`;

export const NewLifeSection = styled.div`
  background-image: url("/image/homes/home2.jpg");
  background-size: contain;
  background-position: top center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5em;
  padding: 100px 0 15px 0;
  margin-bottom: 30px;
  object-fit: cover;
  height: 300px;
  font-weight: bold;
  filter: brightness(0.7);

  @media (max-width: 770px) {
    font-size: 2em;
    justify-content: center;
    text-align: center;
    color: aliceblue;

    .highlighted {
      white-space: nowrap;
    }

    @media (max-width: 375px) {
      font-size: 1.7em;
    }
  }
`;

export const PaginationWrap = styled.div`
  padding-bottom: 20px;
  margin-top: 25px;
  text-align: center;
`;
