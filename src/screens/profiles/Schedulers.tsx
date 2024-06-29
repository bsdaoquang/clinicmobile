import {Section} from '@bsdaoquang/rncomponent';
import React from 'react';
import {Container, TextComponent} from '../../components';

const Schedulers = () => {
  return (
    <Container isScroll={false} back title="Lịch hẹn">
      <Section>
        <TextComponent text="Lịch hẹn khám bệnh, dùng khi bệnh nhân đã biết nhân viên y tế, đặt lịch khi nhân viên y tế không làm việc, phần này do nhân viên y tế tạo sau khi trò chuyện với bệnh nhân" />
      </Section>
    </Container>
  );
};

export default Schedulers;
