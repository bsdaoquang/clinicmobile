import {View, Text} from 'react-native';
import React from 'react';
import {Col, Row, colors, globalStyles} from '@bsdaoquang/rncomponent';
import {TextComponent} from '../../../components';
import {fontFamilies} from '../../../constants/fontFamilies';

const RatingStatistic = () => {
  return (
    <View style={{paddingVertical: 12}}>
      <Row>
        <View style={[globalStyles.center, {paddingHorizontal: 20}]}>
          <TextComponent
            text={'5.0'}
            size={38}
            color={colors.gray700}
            font={fontFamilies.RobotoBold}
          />
          <TextComponent text={`123 Đánh giá`} size={13} color={colors.gray} />
        </View>
        <Col>
          {Array.from({length: 5}).map((item, index) => (
            <Row key={`ratingItem${index}`} styles={{marginBottom: 8}}>
              <TextComponent text={`${index + 1}`} size={12} />
              <Col styles={{paddingHorizontal: 8}}>
                <View
                  style={{
                    // flex: 1,
                    height: 6,
                    borderRadius: 100,
                    backgroundColor: colors.gray100,
                  }}>
                  <View
                    style={{
                      width: `${(Math.floor(Math.random() * 10) / 10) * 100}%`,
                      height: 6,
                      borderRadius: 100,
                      backgroundColor: colors.success,
                    }}
                  />
                </View>
              </Col>
              <TextComponent
                text={`${Math.floor(Math.random() * 10)}`}
                size={12}
              />
            </Row>
          ))}
        </Col>
      </Row>
    </View>
  );
};

export default RatingStatistic;
