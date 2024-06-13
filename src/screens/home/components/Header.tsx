import {View, Text, StatusBar, Image} from 'react-native';
import React from 'react';
import {Badge, Card, Row} from '@bsdaoquang/rncomponent';
import TextComponent from '../../../components/TextComponent';
import {fontFamilies} from '../../../constants/fontFamilies';
import AntDesign from 'react-native-vector-icons/AntDesign';

type Props = {};

const Header = (props: Props) => {
  return (
    <View
      style={{
        backgroundColor: 'transparent',
        position: 'absolute',
        top: StatusBar.currentHeight,
        right: 0,
        left: 0,
        paddingHorizontal: 10,
        paddingTop: 10,
      }}>
      <Row justifyContent="space-between">
        <Card styles={{paddingVertical: 4, marginBottom: 0}} onPress={() => {}}>
          <Row>
            <View>
              <TextComponent
                text="VND"
                size={8}
                font={fontFamilies.RobotoBold}
              />
              <TextComponent
                text="900.000"
                font={fontFamilies.RobotoBold}
                size={16}
              />
            </View>
            <View
              style={{
                width: 1,
                backgroundColor: '#e0e0e0',
                height: '100%',
                marginHorizontal: 12,
              }}
            />

            <Row>
              <AntDesign name="star" size={16} color={'#FFC700'} />
              <TextComponent
                text=" 5.00"
                size={16}
                font={fontFamilies.RobotoMedium}
              />
            </Row>
          </Row>
        </Card>
        <View>
          <Badge
            dotStylesProps={{
              top: 0,
              right: 0,
            }}
            dotColor="#e0e0e0">
            <Image
              source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDCKK0X8qO8cLiVCeGQxMbgJmRayqriLiyTny0cXpUczhSl2WCpTwqjF2kvkxrrB2l8NY&usqp=CAU',
              }}
              style={{
                width: 50,
                height: 50,
                borderWidth: 1,
                borderColor: 'white',
                borderRadius: 100,
              }}
            />
          </Badge>
        </View>
      </Row>
    </View>
  );
};

export default Header;
