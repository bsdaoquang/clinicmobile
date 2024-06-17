import {
  Button,
  Col,
  Row,
  Section,
  Space,
  colors,
} from '@bsdaoquang/rncomponent';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Container, UploadImage} from '../../../components';
import TextComponent from '../../../components/TextComponent';

const Avatar = ({navigation}: any) => {
  return (
    <Container isFlex back title="Cập nhật ảnh đại diện">
      <Section>
        <TextComponent text="Được sử dụng làm ảnh đại diện, giúp khách hàng dễ dàng nhận ra bạn" />
        <TextComponent
          text="Ảnh chân dung, ảnh thật của bạn"
          color={colors.gray500}
        />
      </Section>
      <Section styles={{flex: 1}}>
        <TextComponent text="ho" />
      </Section>
      <UploadImage onSelectedFile={files => console.log(files)} multible />
    </Container>
  );
};

export default Avatar;
