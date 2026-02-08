import { StyleSheet } from 'react-native';

export const fontFamily = {
  regular: 'SplineSans-Regular',
  medium: 'SplineSans-Medium',
  bold: 'SplineSans-Bold',
} as const;

export const typography = StyleSheet.create({
  h1: { fontFamily: fontFamily.bold, fontSize: 28, lineHeight: 34 },
  h2: { fontFamily: fontFamily.bold, fontSize: 24, lineHeight: 30 },
  h3: { fontFamily: fontFamily.bold, fontSize: 20, lineHeight: 28 },
  h4: { fontFamily: fontFamily.bold, fontSize: 18, lineHeight: 22 },
  body: { fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 24 },
  bodyMedium: { fontFamily: fontFamily.medium, fontSize: 16, lineHeight: 24 },
  bodyBold: { fontFamily: fontFamily.bold, fontSize: 16, lineHeight: 24 },
  caption: { fontFamily: fontFamily.medium, fontSize: 14, lineHeight: 20 },
  captionRegular: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20 },
  small: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 16 },
  smallMedium: { fontFamily: fontFamily.medium, fontSize: 12, lineHeight: 16 },
  micro: { fontFamily: fontFamily.bold, fontSize: 10, lineHeight: 15 },
});
