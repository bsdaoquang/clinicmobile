import {Text, TextProps} from '@bsdaoquang/rncomponent';
import React from 'react';
import {fontFamilies} from '../constants/fontFamilies';

const TextComponent = (props: TextProps | any) => {
  return (
    <Text
      {...props}
      text={props.text}
      flex={props.flex}
      styles={{
        lineHeight: 20,
        fontSize: props.size ?? 14,
        fontFamily: props.font ?? fontFamilies.RobotoRegular,
        color: props.color ?? '#212121',
        ...props.styles,
      }}
    />
  );
};

export default TextComponent;
