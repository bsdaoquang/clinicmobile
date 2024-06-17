import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Platform, StatusBar, StatusBarStyle } from 'react-native';

export const useStatusBar = ({ style, hidden, color }: {
  style?: StatusBarStyle,
  hidden?: boolean;
  color?: string;
}) => {
  useFocusEffect(
    useCallback(() => {
      color &&
        StatusBar.setBackgroundColor(color);
      Platform.OS === 'android' &&
        StatusBar.setTranslucent(true);
      StatusBar.setHidden(hidden ?? false);
      style &&
        StatusBar.setBarStyle(style);
    }, []),
  );
};
