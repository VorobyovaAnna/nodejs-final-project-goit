import { CongratsModalStyled, Text, Button } from './CongratsModal.styled';
import { ReactComponent as ThumbUpIcon } from '../../images/svg';

export default function CongratsModal({ text, onBtnClick }) {
  return (
    <CongratsModalStyled>
      <ThumbUpIcon style={{ fill: '#FF6B08' }} />
      <Text>
      Вітаю! <br /> Ще одна книга прочитана.<br /> {text}
      </Text>
      <Button type="button" onClick={onBtnClick}>
      Готово
      </Button>
    </CongratsModalStyled>
  );
}
