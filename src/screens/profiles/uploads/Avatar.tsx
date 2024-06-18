import {Button, Loading, Row, Section, colors} from '@bsdaoquang/rncomponent';
import React, {useState} from 'react';
import {Container, UploadButton} from '../../../components';
import TextComponent from '../../../components/TextComponent';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {Image} from 'react-native';
import {sizes} from '../../../constants/sizes';
import {HandleFile} from '../../../utils/handleFile';
import {showToast} from '../../../utils/showToast';
import auth from '@react-native-firebase/auth';
import {profileRef, userRef} from '../../../firebase/firebaseConfig';

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
      <UploadButton
        imageSize={{
          width: 512,
          height: 512,
        }}
        onSelectedFile={file => setfile(file)}
        multible
      />
      <Loading loading={isUploading} mess="Đang upload hình ảnh..." />
    </Container>
  );
};

export default Avatar;
