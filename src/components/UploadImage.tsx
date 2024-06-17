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

type Props = {
  multible?: boolean;
  onSelectedFile: (files: any) => void;
};

const UploadImage = (props: Props) => {
  const {onSelectedFile, multible} = props;
  return (
    <Section>
      <Row>
        <Col>
          <Button
            type="link"
            isShadow={false}
            title="Chụp ảnh"
            icon={<Ionicons name="camera" color={colors.primary} size={22} />}
            onPress={() => {}}
          />
        </Col>
        <Space width={16} />
        <Col>
          <Button
            type="link"
            isShadow={false}
            title="Thư viện"
            icon={<Entypo name="images" color={colors.primary} size={22} />}
            onPress={() => {}}
          />
        </Col>
      </Row>
    </Section>
  );
};

export default UploadImage;
