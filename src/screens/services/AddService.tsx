import {
  Button,
  Input,
  Loading,
  replaceName,
  Section,
  Space,
} from '@bsdaoquang/rncomponent';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {Container} from '../../components';
import TextComponent from '../../components/TextComponent';
import {colors} from '../../constants/colors';
import {profileSelector} from '../../redux/reducers/profileReducer';
import {showToast} from '../../utils/showToast';
import {HandleAPI} from '../../apis/handleAPI';

const AddService = ({navigation, route}: any) => {
  const service = route.params ? route.params.item : undefined;

  const profile = useSelector(profileSelector);

  const initState = service
    ? {
        title: service.title ?? '',
        description: service.description ?? '',
        price: service.price ? service.price.toString() : '',
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
    const api = service
      ? `/doctors/update-service?id=${service._id}`
      : `/doctors/add-new-service`;
    const data = {
      ...formData,
      uid: profile._id,
      slug: replaceName(formData.title),
      price: formData.price ? parseInt(formData.price) : 0,
    };
    setIsLoading(true);
    try {
      setErrorText('');

      const res: any = await HandleAPI(api, data, service ? 'put' : 'post');

      showToast(res.message);
      setIsLoading(false);
      navigation.navigate(
        'ServicesScreen',
        {
          isReload: service ? true : false,
        },
        {
          merge: true,
        },
      );
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
          color={colors.gray}
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
          label="Giới thiệu"
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
          text="Không bắt buộc, giá tiền này là chi phí cho 1 lần bạn đến thực hiện dịch vụ, chưa bao gồm các chi phí phát sinh như vật tư y tế tiêu hao, phí di chuyển..."
          size={13}
          color={colors.gray}
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
