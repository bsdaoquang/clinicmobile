import {Text, TextProps} from '@bsdaoquang/rncomponent';
import React from 'react';
import {fontFamilies} from '../constants/fontFamilies';

const TextComponent = (props: TextProps) => {
  return (
    <Text
      {...props}
      text={props.text}
      styles={{
        fontSize: props.size ?? 14,
        fontFamily: props.font ?? fontFamilies.RobotoRegular,
        color: props.color ?? '#212121',
      }}
    />
  );
};

export default TextComponent;
