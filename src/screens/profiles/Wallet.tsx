import {
  Card,
  Col,
  DateTime,
  Row,
  Section,
  Space,
  globalStyles,
} from '@bsdaoquang/rncomponent';
import React, {useState} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {Container, TextComponent} from '../../components';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {ProfileModel} from '../../models/ProfileModel';
import {Status} from '../../models/Status';
import {TransactionModel} from '../../models/TransactionModel';
import {profileSelector} from '../../redux/reducers/profileReducer';
import {VND} from '../../utils/handleCurrency';

const Wallet = ({navigation}: any) => {
  const [transactions, setTransactions] = useState<TransactionModel[]>([]);

  const profile: ProfileModel = useSelector(profileSelector);

  return profile ? (
    <Container isScroll={false} back title="Ví">
      <Card styles={[globalStyles.center]}>
        <TextComponent text="Số dư khả dụng" />
        <TextComponent
          color={colors.primary}
          text={VND.format(profile.amount)}
          font={fontFamilies.RobotoBold}
          size={30}
        />

        <Space height={20} />
        <Row>
          <TouchableOpacity
            style={[globalStyles.center, {flex: 1}]}
            onPress={() => navigation.navigate('RechargeScreen')}>
            <MaterialCommunityIcons
              name="bank-transfer-in"
              size={22}
              color={colors.gray}
            />

            <TextComponent text=" Nạp tiền" size={12} color={colors.gray} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[globalStyles.center, {flex: 1}]}
            onPress={() => navigation.navigate('Comingsoon')}>
            <MaterialCommunityIcons
              name="bank-transfer-out"
              size={22}
              color={colors.gray}
            />
            <TextComponent text=" Rút tiền" size={12} color={colors.gray} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[globalStyles.center, {flex: 1}]}
            onPress={() => navigation.navigate('Comingsoon')}>
            <MaterialCommunityIcons
              name="bank-transfer"
              size={22}
              color={colors.gray}
            />
            <TextComponent text=" Chuyển" size={12} color={colors.gray} />
          </TouchableOpacity>
        </Row>
      </Card>

      <Section>
        <TextComponent
          text="Lịch sử giao dịch"
          font={fontFamilies.RobotoBold}
          size={16}
        />
      </Section>
      {transactions.length > 0 ? (
        <FlatList
          data={transactions}
          renderItem={({item}) => (
            <Row
              styles={{
                marginHorizontal: 16,
                marginBottom: 20,
              }}
              key={item.id}>
              <View
                style={[
                  globalStyles.center,
                  {
                    width: 40,
                    height: 40,
                    borderRadius: 100,
                    backgroundColor:
                      item.status === 2
                        ? colors.success
                        : item.status === 3
                        ? colors.danger
                        : colors.gray2,
                  },
                ]}>
                <Feather
                  name={
                    item.type === 'deposit'
                      ? 'arrow-down-left'
                      : item.type === 'withdraw'
                      ? 'arrow-up-right'
                      : item.type === 'transfer'
                      ? 'external-link'
                      : 'clock'
                  }
                  size={20}
                  color={colors.white}
                />
              </View>
              <Space width={12} />
              <Col>
                <TextComponent
                  size={16}
                  text={item.content}
                  font={fontFamilies.RobotoMedium}
                />
                <TextComponent
                  text={DateTime.GetDateTimeString(item.createdAt)}
                  size={12}
                  color={colors.gray2}
                />
                <TextComponent
                  text={Status[item.status]}
                  size={13}
                  color={
                    item.status === 2
                      ? colors.success
                      : item.status === 3
                      ? colors.danger
                      : colors.gray2
                  }
                />
              </Col>
              <TextComponent
                text={`${
                  item.type === 'deposit'
                    ? '+'
                    : item.type === 'transfer' || item.type === 'withdraw'
                    ? '-'
                    : ''
                }${VND.format(parseInt(item.amount))}`}
                size={16}
                font={fontFamilies.RobotoMedium}
                color={
                  item.status === 2
                    ? colors.success
                    : item.status === 3
                    ? colors.danger
                    : colors.text
                }
              />
            </Row>
          )}
        />
      ) : (
        <Section>
          <TextComponent
            color={colors.gray2}
            text="Chưa có giao dịch phát sinh"
          />
        </Section>
      )}
    </Container>
  ) : (
    <Container>
      <Section>
        <TextComponent text="" />
      </Section>
    </Container>
  );
};

export default Wallet;
