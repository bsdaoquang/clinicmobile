import {
  Button,
  Input,
  Loading,
  Section,
  Space,
  replaceName,
} from '@bsdaoquang/rncomponent';
import auth from '@react-native-firebase/auth';
import React, {useState} from 'react';
import {Container} from '../../components';
import TextComponent from '../../components/TextComponent';
import {colors} from '../../constants/colors';
import fs from '@react-native-firebase/firestore';
import {showToast} from '../../utils/showToast';

const AddService = ({navigation, route}: any) => {
  const service = route.params ? route.params.item : undefined;

  const user = auth().currentUser;
  const initState = service
    ? {
        title: service.title ?? '',
        description: service.description ?? '',
        price: service.price ?? '',
      }
    : {
        title: '',
        description: '',
        price: '',
      };
  const [formData, setFormData] = useState(initState);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleChangeData = (val: string, key: string) => {
    const items: any = {...formData};
    items[`${key}`] = val;
    setFormData(items);
  };

  const handleAddNewService = async () => {
    setIsLoading(true);
    try {
      setErrorText('');
      if (service) {
        await fs()
          .collection('services')
          .doc(service.id)
          .update({
            ...formData,
            updatedAt: Date.now(),
            searchIndex: replaceName(formData.title).split('-'),
            slug: replaceName(formData.title),
          });
      } else {
        await fs()
          .collection('services')
          .add({
            ...formData,
            uid: user?.uid,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            searchIndex: replaceName(formData.title).split('-'),
            slug: replaceName(formData.title),
          });
      }

      setIsLoading(false);
      showToast(
        service ? 'Đã cập nhật dịch vụ của bạn' : 'Tạo dịch vụ thành công!!',
      );
      navigation.goBack();
    } catch (error: any) {
      setIsLoading(false);
      console.log(error);
      setErrorText(error.message);
    }
  };

  return (
    <Container title="Tạo dịch vụ" back>
      <Section>
        <TextComponent
          text="Khách hàng sẽ tìm thấy bạn dựa trên dịch vụ bạn cung cấp, do đó hãy tạo tên dịch vụ sao cho khách hàng có thể dễ dàng tìm thấy, không quá dài, không chứa ký tự đặc biệt"
          size={13}
          color={colors.gray2}
        />
        <Space height={12} />
        <TextComponent
          text="Dịch vụ của bạn phải phù hợp với chuyên ngành của bạn, chúng tôi sẽ rà soát thường xuyên và khoá tài khoản cố tình cung cấp dịch vụ không đúng chuyên môn đã đăng ký"
          size={13}
          color={colors.gray2}
        />
      </Section>
      <Section>
        <Input
          value={formData.title}
          onChange={val => handleChangeData(val, 'title')}
          label="Tên dịch vụ"
          clear
          placeholder="Tên dịch vụ"
          max={150}
          required
          radius={12}
          helpText="Nhập tên dịch vụ"
        />
        <Input
          value={formData.description}
          onChange={val => handleChangeData(val, 'description')}
          label="Mô tả"
          clear
          placeholder="Giới thiệu về dịch vụ của bạn"
          radius={12}
          rows={3}
          textAreal
          max={1500}
        />
        <Input
          value={formData.price}
          onChange={val => handleChangeData(val, 'price')}
          label="Giá tiền cho 1 lần thực hiện"
          clear
          keyboardType="number-pad"
          radius={12}
          inline
        />
        <TextComponent
          text="Không bắt buộc, giá tiền này là chi phí cho 1 lần bạn đến thực hiện dịch vụ, chưa bao gồm các chi phí phát sinh như vật tư y tế tiêu hao..."
          size={13}
          color={colors.gray2}
        />
      </Section>
      {errorText && (
        <Section>
          <TextComponent text={errorText} color={colors.danger} size={13} />
        </Section>
      )}
      <Section>
        <Button
          color={colors.primary}
          disable={!formData.title}
          onPress={handleAddNewService}
          title="Đồng ý"
          radius={12}
        />
      </Section>

      <Loading loading={isLoading} />
    </Container>
  );
};

export default AddService;
