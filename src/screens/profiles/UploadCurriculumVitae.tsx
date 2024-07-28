import {
  Button,
  Col,
  Row,
  Section,
  Space,
  colors,
} from '@bsdaoquang/rncomponent';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {FlatList, Linking} from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {useDispatch, useSelector} from 'react-redux';
import {HandleAPI} from '../../apis/handleAPI';
import {Container} from '../../components';
import TextComponent from '../../components/TextComponent';
import {fontFamilies} from '../../constants/fontFamilies';
import {
  DocumentModel,
  DocumentStatus,
  DocumentStatusColor,
} from '../../models/DocumentModel';
import {authSelector} from '../../redux/reducers/authReducer';
import {addProfile} from '../../redux/reducers/profileReducer';
import {showToast} from '../../utils/showToast';
import {sendMail} from '../../utils/sendMail';

const UploadCurriculumVitae = ({navigation}: any) => {
  const [documents, setDocuments] = useState<DocumentModel[]>([]);
  const auth = useSelector(authSelector);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const isFocus = useIsFocused();
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
      compulsory: false,
      title: 'Thông tin liên hệ khẩn cấp và địa chỉ tạm trú',
      onPress: () => {
        navigation.navigate('EmergenciyContact', {
          title: 'Thông tin liên hệ khẩn cấp và địa chỉ tạm trú',
        });
      },
    },
  ];

  useEffect(() => {
    isFocus && getDocuments();
  }, [isFocus]);

  useEffect(() => {
    const items: string[] = [];
    documents.forEach(item => {
      items.push(item.type);
    });

    if (items.length === profiles.length - 1) {
      handleUpdateProfile();
    }
  }, [documents]);

  const getDocuments = async () => {
    const api = `/doctors/documents?id=${auth._id}`;
    setIsLoading(true);
    try {
      const res = await HandleAPI(api);
      res && res.data && setDocuments(res.data);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      showToast(error.message);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const res = await HandleAPI(
        `/doctors/update?id=${auth._id}`,
        {status: 'pending'},
        'put',
      );

      res && res.data && dispatch(addProfile(res.data));
      //Send mail to admin
      // send email to admin
      await sendMail('bsdaoquang@gmail.com', {
        html: '<h1>Có người đăng ký mới đang chờ duyệt hồ sơ</h1>',
        subject: 'Hồ sơ đang chờ duyệt',
      });
      navigation.navigate('VerifyStatus');
    } catch (error) {
      console.log(error);
    }
  };

  const renderButtonText = (item: any) => {
    const val = documents.find(
      element => element.type === item.key.toLowerCase(),
    );

    return (
      <>
        {item.compulsory ? (
          val ? (
            <>
              <TextComponent
                text={DocumentStatus[val.status]}
                color={DocumentStatusColor[val.status]}
              />
            </>
          ) : (
            <Row
              onPress={() =>
                navigation.navigate(item.key, {title: item.title})
              }>
              <TextComponent text={'Bắt buộc'} color={'coral'} />
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
  };

  return (
    <Container
      isScroll={false}
      title="Hồ sơ cá nhân"
      back
      right={
        <Button
          title="Hỗ trợ"
          type="link"
          inline
          onPress={() => Linking.openURL('https://yhocso.com/helps')}
        />
      }>
      <FlatList
        data={profiles}
        renderItem={({item}) => (
          <Row
            onPress={item.onPress ? () => item.onPress() : undefined}
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
            {item.compulsory ? (
              renderButtonText(item)
            ) : (
              <SimpleLineIcons
                name="arrow-right"
                color={colors.gray700}
                size={16}
              />
            )}
          </Row>
        )}
        keyExtractor={item => item.key}
      />
    </Container>
  );
};

export default UploadCurriculumVitae;
