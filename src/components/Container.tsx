import {Loading, Row} from '@bsdaoquang/rncomponent';
import {useNavigation} from '@react-navigation/native';
import React, {ReactNode} from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Text} from '.';
import {fontFamilies} from '../constants/fontFamilies';

interface Props {
  children: ReactNode;
  isScroll?: boolean;
  isLoading?: boolean;
  isSafe?: boolean;
  title?: string;
  back?: boolean;
  left?: ReactNode;
  right?: ReactNode;
  isFlex?: boolean;
  color?: string;
  bottomComponent?: ReactNode;
}

const Container = (props: Props) => {
  const {
    children,
    isScroll,
    isLoading,
    isSafe,
    title,
    back,
    left,
    right,
    isFlex,
    color,
    bottomComponent,
  } = props;

  const navigation: any = useNavigation();

  const renderChildren =
    isScroll === undefined || isScroll !== false ? (
      <ScrollView
        contentContainerStyle={{flexGrow: isFlex ? 1 : 0}}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        automaticallyAdjustContentInsets={false}
        style={[{flex: 1, paddingTop: 8}]}>
        {children}
      </ScrollView>
    ) : (
      children
    );

  return isSafe === false ? (
    <>
      <View style={[{backgroundColor: 'white', flex: 1}]}>
        {renderChildren}
      </View>

      <Loading loading={isLoading ? true : false} />
    </>
  ) : (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: color ?? 'white',
        paddingTop: Platform.OS === 'android' ? 20 : 0,
      }}>
      <View style={[{flex: 1, backgroundColor: 'white'}]}>
        {(title || back || left || right) && (
          <Row
            styles={[
              {
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 56,
                backgroundColor: color ?? 'white',
                paddingHorizontal: 16,
              },
            ]}>
            {back && (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={[
                  {
                    minWidth: 32,
                    minHeight: 48,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}>
                <MaterialIcons
                  name="arrow-back-ios"
                  color={'#212121'}
                  size={22}
                />
              </TouchableOpacity>
            )}

            {left && left}
            <View style={{flex: 1}}>
              {title && (
                <Text
                  text={title}
                  color={color ?? '#212121'}
                  font={fontFamilies.RobotoMedium}
                  numberOfLine={1}
                  size={16}
                />
              )}
            </View>
            {right && right}
          </Row>
        )}
        {renderChildren}
        {bottomComponent && bottomComponent}
      </View>
      <Loading loading={isLoading ? true : false} />
    </SafeAreaView>
  );
};

export default Container;
