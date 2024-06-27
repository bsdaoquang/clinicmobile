import {
  Col,
  Input,
  Row,
  Section,
  Space,
  colors,
  replaceName,
} from '@bsdaoquang/rncomponent';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {FlatList, Image, Modal, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TextComponent} from '../components';
import {fontFamilies} from '../constants/fontFamilies';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export interface BankModel {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
}

const PaymentMethod = (props: Props) => {
  const {visible, onClose} = props;

  const [banks, setBanks] = useState<BankModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bankSelected, setBankSelected] = useState<BankModel>();
  const [searchKey, setSearchKey] = useState('');
  const [results, setResults] = useState<BankModel[]>([]);

  const user = auth().currentUser;

  useEffect(() => {
    getBankList();
  }, []);

  useEffect(() => {
    if (!searchKey) {
      setResults(banks);
    } else {
      const items = banks.filter(element =>
        replaceName(element.name).includes(replaceName(searchKey)),
      );
      setResults(items);
    }
  }, [searchKey]);

  const getBankList = async () => {
    const api = `https://api.vietqr.io/v2/banks`;
    setIsLoading(true);
    try {
      const res = await axios(api);

      if (res && res.data && res.status === 200) {
        const data = res.data.data;

        setBanks(data);
      }
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <Modal
      style={{flex: 1}}
      transparent
      statusBarTranslucent
      animationType="slide"
      visible={visible}>
      <View style={{flex: 1, backgroundColor: 'white', marginTop: 40}}>
        <Section>
          <Row>
            <Col>
              <TextComponent
                text="Chọn ngân hàng"
                font={fontFamilies.RobotoMedium}
                size={16}
              />
            </Col>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={24} color={colors.black} />
            </TouchableOpacity>
          </Row>
        </Section>
        <Section>
          <Input
            value={searchKey}
            placeholder="Tên ngân hàng"
            clear
            radius={12}
            onChange={val => setSearchKey(val)}
          />
          <FlatList
            style={{marginBottom: 100}}
            showsVerticalScrollIndicator={false}
            data={results}
            renderItem={({item}) => (
              <Row
                onPress={() => setBankSelected(item)}
                key={item.id}
                styles={{marginBottom: 16}}
                alignItems="flex-start">
                <Image
                  source={{uri: item.logo}}
                  style={{
                    width: 80,
                    height: 30,
                    resizeMode: 'contain',
                  }}
                />
                <Space width={12} />
                <Col>
                  <TextComponent text={item.shortName} transform="uppercase" />
                  <TextComponent
                    text={item.name}
                    size={13}
                    color={colors.gray600}
                  />
                </Col>
              </Row>
            )}
          />
        </Section>
      </View>
    </Modal>
  );
};

export default PaymentMethod;
