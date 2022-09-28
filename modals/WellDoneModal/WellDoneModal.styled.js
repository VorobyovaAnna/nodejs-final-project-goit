import styled from 'styled-components';

export const WellDoneModalStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  margin: auto;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.modal};

  @media screen and (max-width: 767px) {
    width: 280px;
  }
  @media screen and (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 394px;
  }
`;

export const Text = styled.p`
  text-align: center;
  font-size: 16px;
  line-height: 1.38;
  margin-top: 20px;
`;

export const Button = styled.button`
  min-width: 152px;
  min-height: 40px;
  padding: 5px;
  font-weight: 500;
  margin-top: 24px;
  cursor: pointer;
  border: none;

  font-size: 14px;
  line-height: 1.21;

  box-shadow: ${({ theme }) => theme.shadows.instrustion};
  transition: ${({ theme }) => theme.transition};

  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.accentColor};

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.hover};
  }
`;
