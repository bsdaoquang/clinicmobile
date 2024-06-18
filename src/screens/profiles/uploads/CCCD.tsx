import {Button, Loading, Section, colors} from '@bsdaoquang/rncomponent';
import auth from '@react-native-firebase/auth';
import React, {useState} from 'react';
import {Image, View} from 'react-native';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {Container, UploadButton} from '../../../components';
import TextComponent from '../../../components/TextComponent';
import {sizes} from '../../../constants/sizes';
import {profileRef} from '../../../firebase/firebaseConfig';
import {HandleFile} from '../../../utils/handleFile';
import {showToast} from '../../../utils/showToast';

const CCCD = ({navigation, route}: any) => {
  const [front, setFront] = useState<ImageOrVideo>();
  const [back, setBack] = useState<ImageOrVideo>();
  const [isUploading, setIsUploading] = useState(false);
  const user = auth().currentUser;

  const handleUploadFile = async () => {
    if (front && back && user) {
      setIsUploading(true);
      try {
        const frontImg = await HandleFile.Upload(front);
        const backImg = await HandleFile.Upload(back);

        await profileRef.doc(user.uid).update({
          cccd: {
            back: backImg,
            front: frontImg,
            verify: false,
          },
        });

        showToast(`Đã tải lên ${route.params.title ?? ''}`);
        navigation.goBack();
        setIsUploading(false);
      } catch (error: any) {
        console.log(error);
        showToast(error.message);
        setIsUploading(false);
      }
    }
  };
  const imageSkeleton = (
    <View
      style={{
        width: sizes.width - 32,
        backgroundColor: colors.gray300,
        borderRadius: 12,
        marginVertical: 12,
        height: (sizes.width - 32) * (2 / 3),
      }}
    />
  );

  const renderImage = (file: ImageOrVideo) => (
    <Image
      source={{uri: file.path}}
      style={{
        width: sizes.width - 32,
        backgroundColor: colors.gray300,
        borderRadius: 12,
        marginVertical: 12,
        resizeMode: 'contain',
        height: (sizes.width - 32) * (2 / 3),
      }}
    />
  );

  return (
    <Container isFlex back title={route.params ? route.params.title : ''}>
      <Section>
        <TextComponent text="Chụp đầy đủ thông tin, không mất góc, không loá sáng làm mất chữ, không méo hình làm biến dạng chữ viết" />
      </Section>
      <Section>
        <TextComponent text="Mặt trước" />
        {front ? renderImage(front) : imageSkeleton}
        <UploadButton onSelectedFile={file => setFront(file)} />
      </Section>
      <Section>
        <TextComponent text="Mặt sau" />
        {back ? renderImage(back) : imageSkeleton}
        <UploadButton onSelectedFile={file => setBack(file)} />
      </Section>
      {front && back && (
        <Section styles={{flex: 1}}>
          <Button
            title="Đồng ý"
            onPress={handleUploadFile}
            type="primary"
            radius={8}
          />
        </Section>
      )}

      <Loading loading={isUploading} mess="Đang upload hình ảnh..." />
    </Container>
  );
};

export default CCCD;
