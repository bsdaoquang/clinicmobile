import {View, Text, FlatList} from 'react-native';
import React from 'react';
import {Container} from '../../components';
import {
  Button,
  Col,
  Row,
  Section,
  Space,
  colors,
} from '@bsdaoquang/rncomponent';
import TextComponent from '../../components/TextComponent';
import {fontFamilies} from '../../constants/fontFamilies';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const UploadCurriculumVitae = ({navigation}: any) => {
  const profiles = [
    {
      key: 'Avatar',
      title: 'Ảnh chân dung',
      compulsory: true,
    },
    {
      key: 'ID',
      title: 'CMND / Thẻ căn cước / Hộ chiếu',
      compulsory: true,
    },
    {
      key: 'Certificate',
      title: 'Bằng tốt nghiệp cao nhất thuộc chuyên ngành liên quan',
      compulsory: true,
    },
    {
      key: 'Practicing certificate',
      title: 'Chứng chỉ hành nghề',
      compulsory: true,
    },
    {
      key: 'Driver',
      title: 'Bằng lái xe',
      compulsory: true,
    },
    {
      key: 'CV',
      compulsory: true,
      title:
        'Xác minh lý lịch về án tích: Lý lịch tư pháp / Giấy hẹn lý lịch tư pháp/Biên lai bưu điện/Thư xác nhận về việc giải quyết thủ tục cấp lý lịch tư pháp trễ hạn',
    },
    {
      key: 'EmergenciyContact',
      compulsory: true,
      title: 'Thông tin liên hệ khẩn cấp và địa chỉ tạm trú',
    },
    {
      key: 'CollectiveCommitment',
      title: 'Cam kết',
    },
    {
      key: 'Terms',
      title: 'Điều khoản dịch vụ',
    },
  ];

  return (
    <Container
      isScroll={false}
      title=""
      back
      right={<Button title="Hỗ trợ" type="link" inline onPress={() => {}} />}>
      <Section>
        <TextComponent
          text="Tải lên hồ sơ cá nhân"
          font={fontFamilies.RobotoMedium}
          size={16}
        />
      </Section>
      <FlatList
        data={profiles}
        renderItem={({item}) => (
          <Row
            onPress={() => {
              navigation.navigate(item.key);
            }}
            styles={{
              marginHorizontal: 16,
              borderBottomColor: '#e0e0e0',
              borderBottomWidth: 1,
              paddingVertical: 14,
            }}>
            <Col>
              <TextComponent text={item.title} />
            </Col>
            <Space width={16} />
            {item.compulsory && (
              <TextComponent text="Bắt buộc" color={'coral'} />
            )}
            <Space width={8} />
            <SimpleLineIcons
              name="arrow-right"
              color={colors.gray700}
              size={16}
            />
          </Row>
        )}
        keyExtractor={item => item.key}
      />
    </Container>
  );
};

export default UploadCurriculumVitae;
