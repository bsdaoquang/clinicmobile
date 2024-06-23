import {
  Button,
  Card,
  Input,
  Row,
  Section,
  Space,
} from '@bsdaoquang/rncomponent';
import {Call, Message2, SearchNormal1} from 'iconsax-react-native';
import React, {useState} from 'react';
import {Linking} from 'react-native';
import {Container} from '../components';
import TextComponent from '../components/TextComponent';
import {colors} from '../constants/colors';
import {fontFamilies} from '../constants/fontFamilies';

const SupportScreen = ({navigation}: any) => {
  const [searchKey, setSearchKey] = useState('');

  return (
    <Container title="Trung tâm hỗ trợ" back>
      <Section>
        <Input
          prefix={<SearchNormal1 size={20} color={colors.gray2} />}
          placeholder="Vấn đề của bạn là gì?"
          value={searchKey}
          onChange={val => setSearchKey(searchKey)}
          inline
        />
      </Section>
      <Section>
        <TextComponent
          text="Vấn đề thường gặp"
          font={fontFamilies.RobotoMedium}
        />
      </Section>

      <Card>
        <TextComponent
          text="Bạn cần hỗ trợ thêm?"
          font={fontFamilies.RobotoMedium}
        />
        <TextComponent
          text="Hãy liên hệ với chúng tôi để được hỗ trợ nhanh hơn"
          color={colors.gray2}
          size={14}
        />
        <Space height={16} />
        <Row justifyContent="space-around">
          <Button
            type="link"
            inline
            title="Trò chuyện"
            textStyleProps={{color: colors.primary, fontSize: 16}}
            isShadow={false}
            icon={<Message2 size={22} color={colors.primary} />}
            onPress={() => navigation.navigate('SupportForm')}
          />
          <Button
            color={colors.primary}
            size="small"
            inline
            title="Gọi cho tôi"
            textStyleProps={{color: colors.white, fontSize: 16}}
            isShadow={false}
            icon={<Call size={22} color={colors.white} variant="Bold" />}
            onPress={() => Linking.openURL(`tel:+84328323686`)}
          />
        </Row>
      </Card>
    </Container>
  );
};

export default SupportScreen;
