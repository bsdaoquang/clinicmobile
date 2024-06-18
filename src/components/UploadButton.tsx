import {
  Button,
  Col,
  Row,
  Section,
  Space,
  colors,
} from '@bsdaoquang/rncomponent';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageCropPicker, {
  ImageOrVideo,
  Options,
} from 'react-native-image-crop-picker';
import {showToast} from '../utils/showToast';

type Props = {
  multible?: boolean;
  onSelectedFile: (files: ImageOrVideo) => void;
  type?: 'file' | 'image';
  imageSize?: {
    width: number;
    height: number;
  };
  croping?: boolean;
};

const UploadButton = (props: Props) => {
  const {onSelectedFile, multible, type, imageSize, croping} = props;

  const options: Options = imageSize
    ? {
        width: imageSize.width,
        height: imageSize.height,
        mediaType: 'photo',
      }
    : {
        mediaType: 'photo',
      };

  return !type || type === 'image' ? (
    <Section>
      <Row>
        <Col>
          <Button
            type="link"
            isShadow={false}
            title="Chụp ảnh"
            icon={<Ionicons name="camera" color={colors.primary} size={22} />}
            onPress={async () =>
              await ImageCropPicker.openCamera({...options, croping: true})
                .then(file => onSelectedFile(file))
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
            type="link"
            isShadow={false}
            title="Thư viện"
            icon={<Entypo name="images" color={colors.primary} size={22} />}
            onPress={async () =>
              await ImageCropPicker.openPicker({...options, croping: true})
                .then(file => onSelectedFile(file))
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
