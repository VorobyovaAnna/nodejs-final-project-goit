import { WellDoneModalStyled, Text, Button } from './WellDoneModal.styled';
import { ReactComponent as ThumbUpIcon } from '../../images/svg';

export default function WellDoneModal({ onBtnClick }) {
  const handleNewTraining = () => {
    onBtnClick();
  };

  return (
    <WellDoneModalStyled>
      <ThumbUpIcon style={{ fill: '#A6ABB9' }} />
      <Text>
        Ти молодчина, 
        <br />
        але потрібно швидше! 
        <br />
        Наступного разу тобі все вдасться
      </Text>
      <Button type="button" onClick={handleNewTraining}>
      Новє тренування
      </Button>
    </WellDoneModalStyled>
  );
}
