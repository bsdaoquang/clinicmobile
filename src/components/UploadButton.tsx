import {Button, Col, Row, Section, Space} from '@bsdaoquang/rncomponent';
import React from 'react';
import ImageCropPicker, {
  ImageOrVideo,
  Options,
  openCropper,
} from 'react-native-image-crop-picker';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {showToast} from '../utils/showToast';
import {colors} from '../constants/colors';

type Props = {
  onSelectedFile: (files: ImageOrVideo) => void;
  type?: 'file' | 'image';
  useFrontCamera?: boolean;
};

const UploadButton = (props: Props) => {
  const {onSelectedFile, type, useFrontCamera} = props;

  const options: Options = {
    mediaType: 'photo',
    useFrontCamera: useFrontCamera ?? false,
  };

  return !type || type === 'image' ? (
    <Section>
      <Row>
        <Col>
          <Button
            inline
            type="link"
            isShadow={false}
            title="Chụp ảnh"
            textStyleProps={{color: colors.primary}}
            icon={<Ionicons name="camera" color={colors.primary} size={22} />}
            onPress={async () =>
              await ImageCropPicker.openCamera({...options})
                .then(async file =>
                  openCropper({path: file.path, mediaType: 'photo'}),
                )
                .then(img => onSelectedFile(img))
                .catch(error => {
                  console.log(error);
                  showToast(error.message);
                })
            }
          />
        </Col>
        <Space width={16} />
        <Col>
          <Button
            inline
            type="link"
            isShadow={false}
            title="Chọn từ Thư viện"
            textStyleProps={{color: colors.primary}}
            icon={<Entypo name="images" color={colors.primary} size={22} />}
            onPress={async () =>
              await ImageCropPicker.openPicker({...options})
                .then(file =>
                  openCropper({
                    path: file.path,
                    mediaType: 'photo',
                  }),
                )
                .then(img => onSelectedFile(img))
                .catch(error => {
                  console.log(error);
                  showToast(error.message);
                })
            }
          />
        </Col>
      </Row>
    </Section>
  ) : (
    <></>
  );
};

export default UploadButton;
