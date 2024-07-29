import {Text, TextProps} from '@bsdaoquang/rncomponent';
import React from 'react';
import {fontFamilies} from '../constants/fontFamilies';
import {Platform} from 'react-native';

const TextComponent = (props: TextProps | any) => {
  return (
    <Text
      {...props}
      text={props.text}
      flex={props.flex}
      numberOfLine={props.numberOfLine}
      styles={{
        lineHeight: props.size ? props.size + 4 : 20,
        fontSize: props.size ? props.size : Platform.OS === 'ios' ? 16 : 14,
        fontFamily: props.font ?? fontFamilies.RobotoRegular,
        fontWeight: props.font
          ? props.font === fontFamilies.RobotoBold
            ? '700'
            : props.font === fontFamilies.RobotoMedium
            ? '500'
            : '600'
          : '400',
        color: props.color ?? '#212121',
        ...props.styles,
      }}
    />
  );
};

export default TextComponent;
