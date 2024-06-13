import {View, Text, ActivityIndicator} from 'react-native';
import React from 'react';
import {Container} from '../components';
import {Section} from '@bsdaoquang/rncomponent';

const Splash = () => {
  return (
    <Container isScroll={false}>
      <Section>
        <ActivityIndicator size={22} />
      </Section>
    </Container>
  );
};

export default Splash;
