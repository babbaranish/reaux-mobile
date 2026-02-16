import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useSharedValue, withSpring, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';
import { colors, borderRadius, spacing, shadows } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, style, onPress }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.97, {
      duration: 100,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1)
    });
    opacity.value = withTiming(0.9, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 18,
      stiffness: 180,
      mass: 0.6
    });
    opacity.value = withTiming(1, { duration: 150 });
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={[styles.card, shadows.card, style, animatedStyle]}>
          {children}
        </Animated.View>
      </Pressable>
    );
  }

  return <View style={[styles.card, shadows.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.card,
    padding: spacing.lg,
  },
});
