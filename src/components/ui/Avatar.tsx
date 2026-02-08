import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { colors, fontFamily } from '../theme';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  borderColor?: string;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 40,
  borderColor = colors.primary.yellow,
}) => {
  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: 2,
    borderColor,
  };

  const fontSize = size * 0.38;

  if (uri) {
    return (
      <View style={[styles.container, containerStyle]}>
        <Image
          source={{ uri }}
          style={[
            styles.image,
            {
              width: size - 4,
              height: size - 4,
              borderRadius: (size - 4) / 2,
            },
          ]}
          contentFit="cover"
          transition={200}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.initialsContainer, containerStyle]}>
      <Text
        style={[
          styles.initials,
          { fontSize, lineHeight: fontSize * 1.2 },
        ]}
      >
        {name ? getInitials(name) : '?'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    backgroundColor: colors.border.light,
  },
  initialsContainer: {
    backgroundColor: colors.primary.yellowLight,
  },
  initials: {
    fontFamily: fontFamily.bold,
    color: colors.text.primary,
  },
});
