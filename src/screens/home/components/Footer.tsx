import {Button, Card, Row} from '@bsdaoquang/rncomponent';
import React, {useState} from 'react';
import {View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import TextComponent from '../../../components/TextComponent';
import auth from '@react-native-firebase/auth';
import firestorage from '@react-native-firebase/firestore';

type Props = {};

const Footer = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const user = auth().currentUser;

  const handleOnline = async () => {
    setIsLoading(true);
    try {
      await firestorage().collection('users').doc(user?.uid).update({
        isOnline: true,
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
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
          onPress={handleOnline}
          color="#219C90"
          styles={{paddingVertical: 8, width: '50%'}}
        />
      </Row>
      <Card>
        <TextComponent text="Bạn đang ở chế độ nghỉ ngơi" />
      </Card>
    </View>
  );
};

export default Footer;
