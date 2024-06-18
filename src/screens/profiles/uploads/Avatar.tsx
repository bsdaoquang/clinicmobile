import {Button, Loading, Row, Section, colors} from '@bsdaoquang/rncomponent';
import auth from '@react-native-firebase/auth';
import React, {useState} from 'react';
import {Image} from 'react-native';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {Container, UploadButton} from '../../../components';
import TextComponent from '../../../components/TextComponent';
import {sizes} from '../../../constants/sizes';
import {profileRef} from '../../../firebase/firebaseConfig';
import {HandleFile} from '../../../utils/handleFile';
import {showToast} from '../../../utils/showToast';

const Avatar = ({navigation}: any) => {
  const [file, setfile] = useState<ImageOrVideo>();
  const [isUploading, setIsUploading] = useState(false);
  const user = auth().currentUser;

  const handleUploadFile = async () => {
    if (file && user) {
      setIsUploading(true);

      try {
        const res = await HandleFile.Upload(file);
        if (res) {
          await profileRef.doc(user.uid).update({
            avatar: {
              ...res,
              verify: false,
            },
          });
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
