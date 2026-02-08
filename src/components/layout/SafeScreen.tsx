import React from 'react';
import { StyleSheet, StatusBar, ViewStyle } from 'react-native';
import {
  SafeAreaView,
  Edge,
} from 'react-native-safe-area-context';
import { colors } from '../theme';

interface SafeScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: Edge[];
  statusBarStyle?: 'dark-content' | 'light-content';
}

export const SafeScreen: React.FC<SafeScreenProps> = ({
  children,
  style,
  edges = ['top', 'left', 'right'],
  statusBarStyle = 'dark-content',
}) => {
  return (
    <SafeAreaView edges={edges} style={[styles.container, style]}>
      <StatusBar barStyle={statusBarStyle} backgroundColor="transparent" translucent />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
});
