import {View} from 'react-native';
import React from 'react';
import TextComponent from '../../components/TextComponent';
import {Button} from '@bsdaoquang/rncomponent';
import auth from '@react-native-firebase/auth';

const HomeScreen = () => {
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <TextComponent text="Map view" />
      <Button title="logout" onPress={async () => await auth().signOut()} />
    </View>
  );
};

export default HomeScreen;
