import {Section, Space, globalStyles} from '@bsdaoquang/rncomponent';
import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {colors} from '../constants/colors';
import {useStatusBar} from '../hooks/useStatusBar';
import TextComponent from '../components/TextComponent';
import {fontFamilies} from '../constants/fontFamilies';

const Splash = () => {
  useStatusBar({
    style: 'light-content',
  });
  return (
    <View style={{flex: 1, backgroundColor: colors.primary}}>
      <Section styles={[globalStyles.center, {flex: 1}]}>
        <TextComponent
          text="Doctor Bee"
          size={38}
          font={fontFamilies.RobotoBold}
          color="white"
        />
        <TextComponent
          text="Hệ thống chăm sóc sức khoẻ tại nhà"
          size={18}
          color="white"
        />

        <Space height={20} />
        <ActivityIndicator size={22} color={colors.white} />
      </Section>
    </View>
  );
};

export default Splash;
