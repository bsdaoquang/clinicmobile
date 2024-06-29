import {Section} from '@bsdaoquang/rncomponent';
import React from 'react';
import {Container, TextComponent} from '../../components';

const Histories = ({navigation}: any) => {
  return (
    <Container isScroll={false} back title="Lịch sử nhận bệnh">
      <Section>
        <TextComponent text="Hiển thị lịch sử nhận bệnh của người dùng" />
      </Section>
    </Container>
  );
};

export default Histories;
