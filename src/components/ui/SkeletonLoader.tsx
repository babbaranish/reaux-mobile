import React, { useEffect } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
  Extrapolation,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius } from '../../theme';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 16,
  borderRadius: radius = borderRadius.md,
  style,
}) => {
  const shimmerTranslate = useSharedValue(-1);

  useEffect(() => {
    // Premium shimmer animation
    shimmerTranslate.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.bezier(0.4, 0.0, 0.2, 1) }),
        withTiming(-1, { duration: 0 })
      ),
      -1,
      false
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmerTranslate.value,
      [-1, 1],
      [-300, 300],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View
      style={[
        styles.skeleton,
        { width: width as any, height, borderRadius: radius },
        style,
      ]}
    >
      <Animated.View style={[styles.shimmerContainer, shimmerStyle]}>
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0)',
            'rgba(255, 255, 255, 0.5)',
            'rgba(255, 255, 255, 0.8)',
            'rgba(255, 255, 255, 0.5)',
            'rgba(255, 255, 255, 0)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.shimmerGradient}
        />
      </Animated.View>
    </View>
  );
};

/** A pre-built card skeleton for list placeholders */
export const SkeletonCard: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[styles.card, style]}>
    <SkeletonLoader width="100%" height={160} borderRadius={borderRadius.lg} />
    <View style={styles.cardBody}>
      <SkeletonLoader width="60%" height={18} />
      <SkeletonLoader width="90%" height={14} style={{ marginTop: 8 }} />
      <SkeletonLoader width="40%" height={14} style={{ marginTop: 8 }} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.border.light,
    overflow: 'hidden',
  },
  shimmerContainer: {
    width: '100%',
    height: '100%',
  },
  shimmerGradient: {
    width: 300,
    height: '100%',
  },
  card: {
    marginBottom: 16,
  },
  cardBody: {
    paddingTop: 12,
  },
});
