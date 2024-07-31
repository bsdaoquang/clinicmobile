import {Section} from '@bsdaoquang/rncomponent';
import React from 'react';
import {Container, TextComponent} from '../../components';
import {useStatusBar} from '../../hooks/useStatusBar';

const HomeClinic = ({navigation}: any) => {
  useStatusBar({
    style: 'dark-content',
  });

  return (
    <Container>
      <Section>
        <TextComponent text="fafaf" />
      </Section>
    </Container>
  );
};

export default HomeClinic;
