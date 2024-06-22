import {
  Button,
  Col,
  Row,
  Section,
  Space,
  globalStyles,
} from '@bsdaoquang/rncomponent';
import React, {useEffect, useState} from 'react';
import {Container} from '../../components';
import TextComponent from '../../components/TextComponent';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {FlatList} from 'react-native';
import {ServiceModel} from '../../models/ServiceModel';
import {colors} from '../../constants/colors';
import {AddSquare} from 'iconsax-react-native';
import {fontFamilies} from '../../constants/fontFamilies';

const ServicesScreen = ({navigation}: any) => {
  const [services, setServices] = useState<ServiceModel[]>([]);
  const user = auth().currentUser;

  useEffect(() => {
    firestore()
      .collection('services')
      .where('uid', '==', user?.uid)
      .onSnapshot(snap => {
        if (snap.empty) {
        } else {
          const items: ServiceModel[] = [];
          snap.forEach((item: any) => {
            items.push({
              id: item.id,
              ...item.data(),
            });
          });

          setServices(items);
        }
      });
  }, []);

  /*
    {"createdAt": 1719029151592, "description": "Lấy mẫu xét nghiệm tại nhà", "id": "qkmECf8HlrlnOkZXNlcx", "price": "", "searchIndex": ["lay", "mau", "xet", "nghiem", "tai", "nha"], "title": "Lấy mẫu xét nghiệm tại nhà", "uid": "9QCbsLHRR5ZNihzyrExOWedAvJk2", "updatedAt": 1719029151592}
  */

  return (
    <Container
      isScroll={false}
      title="Dịch vụ của bạn"
      back
      right={
        <Button
          title="Thêm mới"
          isShadow={false}
          iconPosition="right"
          // textStyleProps={{
          //   color: colors.primary,
          // }}
          // icon={<AddSquare size={24} color={colors.primary} variant="Bold" />}
          onPress={() => navigation.navigate('AddService')}
          type="link"
          inline
        />
      }>
      {services.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={services}
          renderItem={({item, index}) => (
            <Row
              styles={{
                marginHorizontal: 16,
                paddingVertical: 12,
                borderBottomColor: '#e0e0e0',
                borderBottomWidth: index < services.length - 1 ? 1 : 0,
              }}>
              <Col>
                <TextComponent
                  text={item.title}
                  font={fontFamilies.RobotoMedium}
                />
                {item.description && (
                  <TextComponent
                    text={item.description}
                    size={14}
                    color={colors.gray2}
                    numberOfLine={2}
                  />
                )}
              </Col>
              {item.price && (
                <TextComponent
                  text={parseInt(item.price).toLocaleString()}
                  font={fontFamilies.RobotoMedium}
                />
              )}
            </Row>
          )}
        />
      ) : (
        <Section flex={1} styles={[globalStyles.center]}>
          <TextComponent text="Khách hàng sẽ tìm thấy bạn dựa trên những dịch vụ mà bạn cung cấp" />
          <TextComponent text="Bạn chưa có dịch vụ nào được cung cấp, hãy tạo dịch vụ của bạn" />
          <Space height={12} />
          <Row justifyContent="flex-start">
            <Button
              title="Thêm dịch vụ"
              onPress={() => navigation.navigate('AddService')}
              type="link"
              isShadow={false}
            />
          </Row>
        </Section>
      )}
    </Container>
  );
};

export default ServicesScreen;
