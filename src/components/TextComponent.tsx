import {Text, TextProps} from '@bsdaoquang/rncomponent';
import React from 'react';
import {fontFamilies} from '../constants/fontFamilies';

const TextComponent = (props: TextProps) => {
  return (
    <Text
      {...props}
      text={props.text}
      styles={{
        fontFamily: props.font ?? fontFamilies.RobotoRegular,
        color: props.color ?? '#212121',
      }}
    />
  );
};

export default TextComponent;
