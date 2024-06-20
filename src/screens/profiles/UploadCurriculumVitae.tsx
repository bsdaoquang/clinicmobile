import {
  Button,
  Col,
  Row,
  Section,
  Space,
  colors,
} from '@bsdaoquang/rncomponent';
import auth from '@react-native-firebase/auth';
import React, {memo, useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {Container} from '../../components';
import TextComponent from '../../components/TextComponent';
import {fontFamilies} from '../../constants/fontFamilies';
import {profileRef} from '../../firebase/firebaseConfig';
import {HandleNotification} from '../../utils/handleNotification';

const UploadCurriculumVitae = ({navigation}: any) => {
  const [profileData, setProfileData] = useState<any>();

  const user = auth().currentUser;

  useEffect(() => {
    profileRef.doc(user?.uid).onSnapshot(snap => {
      if (snap.exists) {
        setProfileData(snap.data());
      }
    });
  }, []);

  useEffect(() => {
    const values: string[] = [];
    if (profileData) {
      profiles.forEach(item => {
        const val = profileData[`${item.key.toLocaleLowerCase()}`];
        if (!val) {
          values.push(item.key);
        }
      });
      if (values.length === 0) {
        profileRef.doc(user?.uid).update({
          status: 'pending',
        });

        // send notification to admin
        HandleNotification.pushNotification(
          '9QCbsLHRR5ZNihzyrExOWedAvJk2',
          {
            title: 'Đăng ký mới',
            body: 'Có người mới đăng ký cần xét duyệt',
          },
          {id: ''},
        );
      }
    }
  }, [profileData]);

  const profiles = [
    {
      key: 'Avatar',
      title: 'Ảnh chân dung',
      compulsory: true,
    },
    {
      key: 'CCCD',
      title: 'CMND / Thẻ căn cước / Hộ chiếu',
      compulsory: true,
    },
    {
      key: 'BangTotNghiep',
      title: 'Bằng tốt nghiệp cao nhất thuộc chuyên ngành liên quan',
      compulsory: true,
    },
    {
      key: 'PracticingCertificate',
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
  ];

  const RenderButtonText = memo(({item}: {item: any}) => {
    const val = profileData ? profileData[`${item.key}`] : undefined;
    return (
      <>
        {item.compulsory ? (
          val ? (
            <>
              <TextComponent
                text={!val.verify ? 'Chờ duyệt' : 'Đã duyệt'}
                color={!val.verify ? colors.gray500 : colors.success}
              />
            </>
          ) : (
            <Row>
              <TextComponent text="Bắt buộc" color={'coral'} />
              <Space width={8} />
              <SimpleLineIcons
                name="arrow-right"
                color={colors.gray700}
                size={16}
              />
            </Row>
          )
        ) : null}
      </>
    );
  });

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
            onPress={
              profileData && profileData[`${item.key.toLowerCase()}`]
                ? undefined
                : () => {
                    navigation.navigate(item.key, {title: item.title});
                  }
            }
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
            <RenderButtonText
              item={{
                ...item,
                key: `${item.key.toLowerCase()}`,
              }}
            />
          </Row>
        )}
        keyExtractor={item => item.key}
      />
    </Container>
  );
};

export default UploadCurriculumVitae;
