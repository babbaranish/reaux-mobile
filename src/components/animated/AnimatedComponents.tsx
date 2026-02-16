import React from 'react';
import Animated from 'react-native-reanimated';
import {
  useFadeIn,
  useSlideInUp,
  useSlideInLeft,
  useSlideInRight,
  useScaleEntrance,
  useZoomRotate,
  useStaggeredFadeIn,
  useFloat,
  useShimmer,
} from '../../hooks/useAnimations';
import type { ViewStyle } from 'react-native';

interface AnimatedWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  delay?: number;
}

/**
 * Wrapper component that fades in its children
 */
export const FadeInView: React.FC<AnimatedWrapperProps> = ({ children, style, delay = 0 }) => {
  const animatedStyle = useFadeIn(delay);

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

/**
 * Wrapper component that slides up and fades in its children
 */
export const SlideInUpView: React.FC<AnimatedWrapperProps> = ({ children, style, delay = 0 }) => {
  const animatedStyle = useSlideInUp(delay);

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

/**
 * Wrapper component for list items with staggered animation
 */
interface StaggeredListItemProps extends AnimatedWrapperProps {
  index: number;
  totalItems?: number;
}

export const StaggeredListItem: React.FC<StaggeredListItemProps> = ({
  children,
  style,
  index,
  totalItems = 10
}) => {
  const animatedStyle = useStaggeredFadeIn(index, totalItems);

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

/**
 * Premium wrapper component that slides in from left
 */
export const SlideInLeftView: React.FC<AnimatedWrapperProps> = ({ children, style, delay = 0 }) => {
  const animatedStyle = useSlideInLeft(delay);

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

/**
 * Premium wrapper component that slides in from right
 */
export const SlideInRightView: React.FC<AnimatedWrapperProps> = ({ children, style, delay = 0 }) => {
  const animatedStyle = useSlideInRight(delay);

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

/**
 * Premium wrapper component with scale entrance
 */
export const ScaleEntranceView: React.FC<AnimatedWrapperProps> = ({ children, style, delay = 0 }) => {
  const animatedStyle = useScaleEntrance(delay);

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

/**
 * Premium wrapper component with zoom + rotate entrance
 */
export const ZoomRotateView: React.FC<AnimatedWrapperProps> = ({ children, style, delay = 0 }) => {
  const animatedStyle = useZoomRotate(delay);

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

/**
 * Premium wrapper component with floating animation
 */
interface FloatingViewProps extends AnimatedWrapperProps {
  isFloating?: boolean;
}

export const FloatingView: React.FC<FloatingViewProps> = ({
  children,
  style,
  isFloating = true
}) => {
  const animatedStyle = useFloat(isFloating);

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

/**
 * Premium shimmer overlay for skeleton loaders
 */
export const ShimmerOverlay: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  const animatedStyle = useShimmer();

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        },
        style,
        animatedStyle
      ]}
    />
  );
};
