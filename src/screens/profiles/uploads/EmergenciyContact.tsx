import React, {useState} from 'react';
import {Container} from '../../../components';
import {Button, Input, Loading, Section} from '@bsdaoquang/rncomponent';
import auth from '@react-native-firebase/auth';
import {profileRef} from '../../../firebase/firebaseConfig';

const EmergenciyContact = ({navigation, route}: any) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const user = auth().currentUser;

  const handleChangeData = (val: string, key: string) => {
    const items: any = {...formData};
    items[`${key}`] = val;

    setFormData(items);
  };

  const handleSaveContact = async () => {
    setIsLoading(true);

    try {
      await profileRef.doc(user?.uid).update({
        emergenciycontact: formData,
      });

      setIsLoading(false);
      navigation.goBack();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <Container isFlex back title={route.params ? route.params.title : ''}>
      <Section>
        <Input
          label="Họ tên người thân"
          clear
          value={formData.name}
          onChange={val => handleChangeData(val, 'name')}
          placeholder="vd: Nguyễn Văn A"
        />
        <Input
          label="Số điện thoại liên hệ"
          clear
          value={formData.phone}
          onChange={val => handleChangeData(val, 'phone')}
          placeholder=""
          keyboardType="phone-pad"
        />
        <Input
          label="Địa chỉ tạm trú"
          clear
          autoComplete="postal-address"
          value={formData.address}
          onChange={val => handleChangeData(val, 'address')}
          placeholder=""
        />
      </Section>
      <Section>
        <Button type="primary" title="Lưu" onPress={handleSaveContact} />
      </Section>
      <Loading loading={isLoading} />
    </Container>
  );
};

export default EmergenciyContact;
