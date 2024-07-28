import {Button, Loading, Section} from '@bsdaoquang/rncomponent';
import React, {useState} from 'react';
import {Image} from 'react-native';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {useSelector} from 'react-redux';
import {HandleAPI} from '../../../apis/handleAPI';
import {Container, UploadButton} from '../../../components';
import TextComponent from '../../../components/TextComponent';
import {sizes} from '../../../constants/sizes';
import {authSelector} from '../../../redux/reducers/authReducer';
import {HandleFile} from '../../../utils/handleFile';
import {showToast} from '../../../utils/showToast';

const CV = ({navigation, route}: any) => {
  const [front, setFront] = useState<ImageOrVideo>();
  const [isUploading, setIsUploading] = useState(false);
  const auth = useSelector(authSelector);

  const handleUploadFile = async () => {
    if (front) {
      setIsUploading(true);
      try {
        const frontImg = await HandleFile.Upload(front);

        const res: any = await HandleAPI(
          `/doctors/update-document`,
          {
            type: 'cv',
            uid: auth._id,
            files: [frontImg],
            status: 0,
          },
          'post',
        );

        showToast(res.message);
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
    <></>
    // <View
    //   style={{
    //     width: sizes.width - 32,
    //     backgroundColor: colors.gray300,
    //     borderRadius: 12,
    //     marginVertical: 12,
    //     height: (sizes.width - 32) * (2 / 3),
    //   }}
    // />
  );

  const renderImage = (file: ImageOrVideo) => (
    <Image
      source={{uri: file.path}}
      style={{
        width: sizes.width - 32,
        // backgroundColor: colors.gray300,
        borderRadius: 12,
        marginVertical: 12,
        resizeMode: 'contain',
        height: sizes.width * 1.2,
      }}
    />
  );

  return (
    <Container isFlex back title={route.params ? route.params.title : ''}>
      <Section>
        <TextComponent text="Chụp đầy đủ thông tin, không mất góc, không loá sáng làm mất chữ, không méo hình làm biến dạng chữ viết" />
      </Section>
      <Section styles={{flex: 1}}>
        {front ? renderImage(front) : imageSkeleton}
      </Section>
      <Section>
        <UploadButton onSelectedFile={file => setFront(file)} />
      </Section>
      {front && (
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

export default CV;
