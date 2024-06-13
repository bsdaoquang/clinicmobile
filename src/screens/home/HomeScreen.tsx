import {View} from 'react-native';
import React from 'react';
import TextComponent from '../../components/TextComponent';

const HomeScreen = () => {
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <TextComponent text="Map view" />
    </View>
  );
};

export default HomeScreen;
