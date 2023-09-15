import styled from "styled-components";

export const Container = styled.div`
  padding: 10px;
  transform: scale(0.9);
  display: flex;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 20px;
  background-color: #746464;
  border-radius: 200px;
  margin: 0 auto;
  width: 100%;
  max-width: 1000px;
  margin-top: 100px;
  margin-bottom: 50px;

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 5px;
  }

  .label {
    display: flex;
    justify-content: center;
    white-space: nowrap;
  }

  .form {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .box-form {
    flex: 1;
  }

  .input {
    margin-left: 10px;
    padding: 5px 5px 5px 5px;
    border-radius: 5px;
    border: 2px solid gray;
  }

  .select {
    margin-left: 10px;
    padding: 5px 5px 5px 5px;
    border-radius: 5px;
    border: 2px solid gray;
  }

  .date,
  .location,
  .breed {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .icon {
    font-size: 24px;
    color: white;
  }
`;

export const FlexContainer = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const CalenderContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 10px;
  @media (max-width: 768px) {
    width: 200px;
  }
`;

export const CalenderInput = styled.input`
  margin: 10px;
  padding: 5px;
  border-radius: 5px;
  border: 2px solid gray;
`;
