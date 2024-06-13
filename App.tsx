import React from 'react';
import Router from './src/routers/Router';
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar, View} from 'react-native';

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <Router />
      </View>
    </NavigationContainer>
  );
};

export default App;
