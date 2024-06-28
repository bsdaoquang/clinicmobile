import {Button, Section, Space, globalStyles} from '@bsdaoquang/rncomponent';
import React from 'react';
import {Image} from 'react-native';
import {Container, TextComponent} from '../components';

const Comingsoon = ({navigation}: any) => {
  return (
    <Container isScroll={false} back>
      <Section>
        <Image
          source={require('../assets/images/comming-soon.webp')}
          style={{
            width: '100%',
            height: 250,
            resizeMode: 'cover',
          }}
        />
      </Section>
      <Section flex={1} styles={[globalStyles.center]}>
        <TextComponent
          textAlign="center"
          lineHeight={22}
          text="Xin lỗi bạn, tính năng này đang được phát triển, chúng tôi sẽ cố gắng hoàn thành trong thời gian sớm nhất"
        />
        <Space height={20} />
        <TextComponent
          textAlign="center"
          lineHeight={22}
          text="Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi"
        />

        <Space height={20} />
        <Button
          title="Hỗ trợ"
          type="link"
          onPress={() => navigation.navigate('SupportScreen')}
        />
      </Section>
    </Container>
  );
};

export default Comingsoon;
