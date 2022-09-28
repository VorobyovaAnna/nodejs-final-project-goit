import {
  ExitModalStyled,
  Text,
  ButtonsDiv,
  ButtonOrange,
  ButtonWhite,
} from './ExitModal.styled';

export default function ExitModal( { onClose, onLogOut }) {
    return (
    <ExitModalStyled>
      <Text>Якщо Ви вийдете з програми
незбережені дані будуть втрачені</Text>
      <ButtonsDiv>
        <ButtonWhite type="button" onClick={onClose}>Відміна</ButtonWhite>
        <ButtonOrange type="button" onClick={onLogOut}>Вийти</ButtonOrange>
      </ButtonsDiv>
    </ExitModalStyled>
  );
}
