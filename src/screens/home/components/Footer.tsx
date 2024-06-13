import {View, Text} from 'react-native';
import React from 'react';
import {Button, Card, Row} from '@bsdaoquang/rncomponent';
import AntDesign from 'react-native-vector-icons/AntDesign';
import TextComponent from '../../../components/TextComponent';

type Props = {};

const Footer = (props: Props) => {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
      }}>
      <Row>
        <Button
          iconExtra
          icon={<AntDesign name="poweroff" size={18} color={'white'} />}
          title="Bật kết nối"
          onPress={() => {}}
          color="#219C90"
          styles={{paddingVertical: 8, width: '50%'}}
        />
      </Row>
      <Card>
        <TextComponent text="Bạn đang ở chế độ nghỉ ngơi " />
      </Card>
    </View>
  );
};

export default Footer;
