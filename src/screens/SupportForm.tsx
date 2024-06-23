import React, {useState} from 'react';
import {Container, TextComponent} from '../components';
import {Button, Input, Section} from '@bsdaoquang/rncomponent';
import {colors} from '../constants/colors';
import {showToast} from '../utils/showToast';

const SupportForm = ({navigation}: any) => {
  const [content, setContent] = useState('');

  const handleSendSupportMess = async () => {
    // Gửi tin nhắn đến admin
    // chuyển sang màn hình trò chuyện
    //
    showToast('Vấn đề của bạn đã được tiếp nhận');
    navigation.goBack();
  };

  return (
    <Container title="Liên hệ hỗ trợ" back>
      <Section>
        <TextComponent text="Xin chào! Vấn đề mà bạn đang gặp phải là gì?" />
        <TextComponent
          text="Chúng tôi rất tiếc về vấn đề mà bạn đang gặp phải, để chúng tôi có thể hỗ trợ bạn tốt nhất, hãy mô tả chi tiết vấn đề của bạn ở bên dưới, sau đó bấm gửi, chúng tôi sẽ cố gắng giải quyết vấn đề của bạn một cách nhanh nhất có thể."
          size={13}
          lineHeight={19}
          color={colors.gray2}
        />
      </Section>
      <Section>
        <Input
          textAreal
          radius={12}
          value={content}
          onChange={val => setContent(val)}
          clear
          placeholder="Vấn đề của bạn"
        />
      </Section>
      <Section>
        <Button
          title="Gửi"
          onPress={() => handleSendSupportMess()}
          color={colors.primary}
          radius={12}
        />
      </Section>
    </Container>
  );
};

export default SupportForm;
