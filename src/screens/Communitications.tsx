import {Section} from '@bsdaoquang/rncomponent';
import React from 'react';
import {Container, TextComponent} from '../components';

const Communitications = ({navigation}: any) => {
  return (
    <Container back title="Cộng đồng">
      <Section>
        <TextComponent text="Người dùng có thể đặt câu hỏi và đăng câu trả lời cho các câu hỏi của người dùng khác. hoặc các bài viết của admin" />
      </Section>
    </Container>
  );
};

export default Communitications;
