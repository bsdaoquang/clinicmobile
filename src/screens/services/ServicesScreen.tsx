import {
  Button,
  Col,
  Loading,
  Row,
  Section,
  Space,
  globalStyles,
} from '@bsdaoquang/rncomponent';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useRef, useState} from 'react';
import {Container} from '../../components';
import TextComponent from '../../components/TextComponent';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {ServiceModel} from '../../models/ServiceModel';
import SwipeableFlatlist from 'rn-gesture-swipeable-flatlist';
import {MessageEdit} from 'iconsax-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Alert} from 'react-native';
import {showToast} from '../../utils/showToast';

const ServicesScreen = ({navigation}: any) => {
  const [services, setServices] = useState<ServiceModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = auth().currentUser;

  const ref = useRef<any>();

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

  const handleRemoveService = async (id: string) => {
    setIsLoading(true);
    try {
      await firestore().collection('services').doc(id).delete();
      showToast('Đã xoá dịch vụ');
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      console.log(error);
      showToast(error.message);
    }
  };

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
          onPress={() => navigation.navigate('AddService')}
          type="link"
          inline
        />
      }>
      {services.length > 0 ? (
        <SwipeableFlatlist
          ref={ref}
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
          renderRightActions={item => (
            <Row
              styles={{
                backgroundColor: '#e0e0e0',
                paddingHorizontal: 20,
                paddingTop: 12,
              }}>
              <Button
                icon={
                  <MessageEdit
                    size={24}
                    color={colors.primary}
                    variant="Bold"
                  />
                }
                onPress={() => {
                  ref.current?.closeAnyOpenRows();
                  navigation.navigate('AddService', {item});
                }}
                type="text"
                isShadow={false}
              />
              <Space width={16} />
              <Button
                icon={<Ionicons name="trash" size={24} color={colors.danger} />}
                onPress={() =>
                  Alert.alert(
                    'Xác nhận',
                    `Bạn chắn chắn muốn xoá dịch vụ ${item.title} chứ?`,
                    [
                      {
                        text: 'Huỷ bỏ',
                        onPress: () => {},
                      },
                      {
                        text: 'Xoá dịch vụ',
                        style: 'destructive',
                        onPress: () => handleRemoveService(item.id),
                      },
                    ],
                  )
                }
                type="text"
                isShadow={false}
              />
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

      <Loading loading={isLoading} />
    </Container>
  );
};

export default ServicesScreen;
