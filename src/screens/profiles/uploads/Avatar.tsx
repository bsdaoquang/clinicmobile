import {
  Button,
  Loading,
  Row,
  Section,
  Space,
  colors,
} from '@bsdaoquang/rncomponent';
import React, {useState} from 'react';
import {Image} from 'react-native';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {useSelector} from 'react-redux';
import {Container, UploadButton} from '../../../components';
import TextComponent from '../../../components/TextComponent';
import {sizes} from '../../../constants/sizes';
import {authSelector} from '../../../redux/reducers/authReducer';
import {HandleFile} from '../../../utils/handleFile';
import {showToast} from '../../../utils/showToast';
import {HandleAPI} from '../../../apis/handleAPI';

const Avatar = ({navigation}: any) => {
  const [file, setfile] = useState<ImageOrVideo>();
  const [isUploading, setIsUploading] = useState(false);
  const auth = useSelector(authSelector);

  const handleUploadFile = async () => {
    if (file && auth) {
      setIsUploading(true);

      try {
        const res = await HandleFile.Upload(file);

        if (res) {
          await HandleAPI(
            `/doctors/update-document`,
            {
              type: 'avatar',
              uid: auth._id,
              files: [res],
              status: 0,
            },
            'post',
          );

          await HandleAPI(
            `/doctors/update?id=${auth._id}`,
            {
              photoUrl: res.downloadUrl,
            },
            'put',
          );
        }
        setIsUploading(false);
        navigation.goBack();
        showToast('Đã tải lên hình đại diện');
      } catch (error: any) {
        console.log(error);
        showToast(error.message);
        setIsUploading(false);
      }
    }
  };

  return (
    <Container isFlex back title="Cập nhật ảnh đại diện">
      <Section>
        <TextComponent text="Được sử dụng làm ảnh đại diện, giúp khách hàng dễ dàng nhận ra bạn" />
        <Space height={8} />
        <TextComponent
          text="Ảnh chân dung, ảnh thật của bạn"
          color={colors.gray500}
        />
      </Section>
      <Section styles={{flex: 1}}>
        {file && (
          <>
            <Row styles={{flex: 1}}>
              <Image
                source={{uri: file.path}}
                style={{
                  width: sizes.width - 32,
                  height: sizes.width - 32,
                  resizeMode: 'contain',
                }}
              />
            </Row>

            <Button
              title="Đồng ý"
              onPress={handleUploadFile}
              type="primary"
              radius={8}
            />
          </>
        )}
      </Section>
      <UploadButton useFrontCamera onSelectedFile={file => setfile(file)} />
      <Loading loading={isUploading} mess="Đang upload hình ảnh..." />
    </Container>
  );
};

export default Avatar;
