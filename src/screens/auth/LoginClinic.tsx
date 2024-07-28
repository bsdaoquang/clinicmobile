import {Section} from '@bsdaoquang/rncomponent';
import React from 'react';
import {Container, TextComponent} from '../../components';

const LoginClinic = () => {
  return (
    <Container title="Đăng nhập phòng khám" back>
      <Section>
        <TextComponent text="Login clinic" />
      </Section>
    </Container>
  );
};

export default LoginClinic;
