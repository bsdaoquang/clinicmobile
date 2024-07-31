import {
  Button,
  Card,
  Col,
  globalStyles,
  Loading,
  Row,
  Section,
  Space,
} from '@bsdaoquang/rncomponent';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {HandleAPI} from '../../apis/handleAPI';
import {Container} from '../../components';
import TextComponent from '../../components/TextComponent';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {ServiceModel} from '../../models/ServiceModel';
import {profileSelector} from '../../redux/reducers/profileReducer';
import {showToast} from '../../utils/showToast';
import {VND} from '../../utils/handleCurrency';
import {Edit2, Trash} from 'iconsax-react-native';

const ServicesScreen = ({navigation, route}: any) => {
  const [services, setServices] = useState<ServiceModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const profile = useSelector(profileSelector);

  useEffect(() => {
    setIsLoading(true);
    getServices();
  }, []);

  useEffect(() => {
    if (route.params && route.params.isReload) {
      getServices();
    }
  }, [route.params]);

  const handleRemoveService = async (id: string) => {
    setIsDeleting(true);
    try {
      const res: any = await HandleAPI(
        `/doctors/remove-service?id=${id}`,
        undefined,
        'delete',
      );
      showToast(res.message);
      setIsDeleting(false);
      await getServices();
    } catch (error: any) {
      setIsDeleting(false);
      console.log(error);
      showToast(error.message);
    }
  };

  const getServices = async () => {
    const api = `/doctors/get-services?id=${profile._id}`;
    try {
      const res = await HandleAPI(api);
      res.data && setServices(res.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <Container
      isScroll={false}
      title="Dịch vụ của bạn"
      back={navigation.canGoBack()}
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
      {isLoading ? (
        <Section flex={1} styles={[globalStyles.center]}>
          <ActivityIndicator color={colors.gray2} />
        </Section>
      ) : services.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={services}
          renderItem={({item, index}) => (
            <Card>
              <Row styles={{marginBottom: 8}}>
                <Col>
                  <TextComponent
                    text={item.title}
                    size={16}
                    font={fontFamilies.RobotoMedium}
                  />
                </Col>
                <Space width={12} />
                <Row>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('AddService', {item})}>
                    <Edit2 size={20} color={colors.primary} />
                  </TouchableOpacity>
                  <Space width={12} />
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert(
                        'Xác nhận',
                        `Bạn chắc chắn muốn xoá dịch vụ "${item.title}"?`,
                        [
                          {
                            style: 'cancel',
                            text: 'Huỷ',
                          },
                          {
                            style: 'destructive',
                            text: 'Đồng ý',
                            onPress: async () => handleRemoveService(item._id),
                          },
                        ],
                      )
                    }>
                    <Trash size={20} color={colors.danger} />
                  </TouchableOpacity>
                </Row>
              </Row>
              {item.description && (
                <TextComponent
                  text={item.description}
                  size={14}
                  color={colors.gray2}
                  numberOfLine={3}
                />
              )}
              {item.price ? (
                <TextComponent
                  styles={{marginTop: 8}}
                  size={16}
                  text={VND.format(item.price)}
                  font={fontFamilies.RobotoMedium}
                />
              ) : null}
            </Card>
          )}
        />
      ) : (
        <Section flex={1} styles={[globalStyles.center]}>
          <TextComponent text="Không tìm thấy dịch vụ" color={colors.gray2} />
          <Space height={8} />
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

      <Loading loading={isDeleting} mess="Đang xoá dịch vụ" />
    </Container>
  );
};

export default ServicesScreen;
