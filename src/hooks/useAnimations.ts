import { useEffect } from 'react';
import { useSharedValue, withSpring, withTiming, withSequence, withDelay, useAnimatedStyle, Easing, withRepeat, interpolate, Extrapolation } from 'react-native-reanimated';

// Premium easing curves for smooth, polished animations
const customEasing = {
  // Smooth entrance - starts slow, ends fast
  entrance: Easing.bezier(0.25, 0.1, 0.25, 1.0),
  // Smooth exit - starts fast, ends slow
  exit: Easing.bezier(0.4, 0.0, 0.2, 1.0),
  // Premium smooth - iOS-like smooth curve
  smooth: Easing.bezier(0.4, 0.0, 0.1, 1.0),
  // Overshoot - bouncy feel without spring
  overshoot: Easing.bezier(0.34, 1.56, 0.64, 1.0),
  // Anticipate - pulls back before moving forward
  anticipate: Easing.bezier(0.36, 0, 0.66, -0.56),
};

// Premium spring configurations
const springConfig = {
  // Gentle bounce - subtle, polished
  gentle: { damping: 20, stiffness: 90, mass: 0.8 },
  // Medium bounce - balanced feel
  medium: { damping: 15, stiffness: 120, mass: 1 },
  // Snappy - quick, responsive
  snappy: { damping: 18, stiffness: 180, mass: 0.6 },
  // Bouncy - playful, energetic
  bouncy: { damping: 10, stiffness: 100, mass: 0.8 },
  // Smooth - no overshoot, pure smoothness
  smooth: { damping: 25, stiffness: 100, mass: 1 },
};

/**
 * Premium fade-in animation with smooth easing
 */
export const useFadeIn = (delay = 0) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 600, easing: customEasing.entrance })
    );
    scale.value = withDelay(
      delay,
      withTiming(1, { duration: 600, easing: customEasing.smooth })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return animatedStyle;
};

/**
 * Premium slide-in animation with layered motion
 */
export const useSlideInUp = (delay = 0) => {
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withSpring(0, springConfig.gentle)
    );
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 500, easing: customEasing.entrance })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return animatedStyle;
};

/**
 * Premium scale press animation with micro-interaction
 */
export const useScalePress = () => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const onPressIn = () => {
    scale.value = withTiming(0.94, { duration: 100, easing: customEasing.exit });
    opacity.value = withTiming(0.8, { duration: 100 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, springConfig.snappy);
    opacity.value = withTiming(1, { duration: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return { animatedStyle, onPressIn, onPressOut };
};

/**
 * Premium heart/like animation with burst effect
 */
export const useLikeAnimation = (isLiked: boolean) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isLiked) {
      // Multi-stage burst animation
      scale.value = withSequence(
        withTiming(0.8, { duration: 80, easing: customEasing.exit }),
        withSpring(1.4, springConfig.bouncy),
        withSpring(1, springConfig.gentle)
      );
      rotation.value = withSequence(
        withTiming(-12, { duration: 80 }),
        withTiming(12, { duration: 80 }),
        withSpring(0, springConfig.gentle)
      );
    } else {
      scale.value = withSpring(1, springConfig.smooth);
      rotation.value = withSpring(0, springConfig.smooth);
    }
  }, [isLiked]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ],
  }));

  return animatedStyle;
};

/**
 * Premium shake animation with decay
 */
export const useShake = (trigger: boolean) => {
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (trigger) {
      // Shake with decreasing amplitude
      translateX.value = withSequence(
        withTiming(-12, { duration: 50, easing: Easing.linear }),
        withTiming(12, { duration: 50, easing: Easing.linear }),
        withTiming(-10, { duration: 50, easing: Easing.linear }),
        withTiming(10, { duration: 50, easing: Easing.linear }),
        withTiming(-6, { duration: 50, easing: Easing.linear }),
        withTiming(6, { duration: 50, easing: Easing.linear }),
        withSpring(0, springConfig.snappy)
      );
      // Subtle scale pulse
      scale.value = withSequence(
        withTiming(1.02, { duration: 100 }),
        withSpring(1, springConfig.gentle)
      );
    }
  }, [trigger]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value }
    ],
  }));

  return animatedStyle;
};

/**
 * Premium smooth rotation animation (loading spinners)
 */
export const useRotation = (isRotating: boolean) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isRotating) {
      // Smooth infinite rotation using withRepeat
      rotation.value = withRepeat(
        withTiming(360, { duration: 1200, easing: Easing.linear }),
        -1, // infinite
        false
      );
    } else {
      // Smooth stop
      rotation.value = withTiming(0, { duration: 300, easing: customEasing.exit });
    }
  }, [isRotating]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return animatedStyle;
};

/**
 * Premium bounce animation with sophisticated motion
 */
export const useBounce = (shouldBounce: boolean) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (shouldBounce) {
      // Bounce with vertical movement for depth
      scale.value = withSequence(
        withTiming(1.05, { duration: 100, easing: customEasing.anticipate }),
        withSpring(1.2, springConfig.bouncy),
        withSpring(0.95, springConfig.bouncy),
        withSpring(1, springConfig.gentle)
      );
      translateY.value = withSequence(
        withTiming(-8, { duration: 150, easing: customEasing.exit }),
        withSpring(0, springConfig.gentle)
      );
    }
  }, [shouldBounce]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ],
  }));

  return animatedStyle;
};

/**
 * Premium pulse animation with glow effect
 */
export const usePulse = (isPulsing: boolean) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isPulsing) {
      // Smooth infinite pulse
      scale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 800, easing: customEasing.smooth }),
          withTiming(1, { duration: 800, easing: customEasing.smooth })
        ),
        -1,
        false
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 800, easing: customEasing.smooth }),
          withTiming(1, { duration: 800, easing: customEasing.smooth })
        ),
        -1,
        false
      );
    } else {
      scale.value = withSpring(1, springConfig.smooth);
      opacity.value = withTiming(1, { duration: 300 });
    }
  }, [isPulsing]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return animatedStyle;
};

/**
 * Premium staggered list animation with sophisticated entrance
 */
export const useStaggeredFadeIn = (index: number, _totalItems: number = 10) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(25);
  const scale = useSharedValue(0.92);

  useEffect(() => {
    // Smooth stagger: 60ms between items, max 800ms total delay
    const delay = Math.min(index * 60, 800);

    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 500, easing: customEasing.entrance })
    );
    translateY.value = withDelay(
      delay,
      withSpring(0, springConfig.gentle)
    );
    scale.value = withDelay(
      delay,
      withSpring(1, springConfig.gentle)
    );
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ],
  }));

  return animatedStyle;
};

/**
 * Premium slide-in from left animation
 */
export const useSlideInLeft = (delay = 0) => {
  const translateX = useSharedValue(-30);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withDelay(
      delay,
      withSpring(0, springConfig.gentle)
    );
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 500, easing: customEasing.entrance })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return animatedStyle;
};

/**
 * Premium slide-in from right animation
 */
export const useSlideInRight = (delay = 0) => {
  const translateX = useSharedValue(30);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withDelay(
      delay,
      withSpring(0, springConfig.gentle)
    );
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 500, easing: customEasing.entrance })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return animatedStyle;
};

/**
 * Premium scale entrance with depth effect
 */
export const useScaleEntrance = (delay = 0) => {
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withSpring(1, springConfig.gentle)
    );
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 600, easing: customEasing.entrance })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return animatedStyle;
};

/**
 * Premium shimmer animation for skeleton loaders
 */
export const useShimmer = () => {
  const translateX = useSharedValue(-1);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateValue = interpolate(
      translateX.value,
      [-1, 1],
      [-300, 300],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateX: translateValue }],
    };
  });

  return animatedStyle;
};

/**
 * Premium success checkmark animation
 */
export const useCheckmark = (isVisible: boolean) => {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(-90);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      scale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withDelay(100, withSpring(1.2, springConfig.bouncy)),
        withSpring(1, springConfig.gentle)
      );
      rotation.value = withDelay(
        100,
        withSpring(0, springConfig.gentle)
      );
      opacity.value = withDelay(
        100,
        withTiming(1, { duration: 300 })
      );
    } else {
      scale.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ],
    opacity: opacity.value,
  }));

  return animatedStyle;
};

/**
 * Premium modal/sheet entrance from bottom
 */
export const useModalEntrance = (isVisible: boolean) => {
  const translateY = useSharedValue(400);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0, springConfig.smooth);
      opacity.value = withTiming(1, { duration: 300, easing: customEasing.entrance });
    } else {
      translateY.value = withTiming(400, { duration: 250, easing: customEasing.exit });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return animatedStyle;
};

/**
 * Premium card flip animation
 */
export const useFlip = (isFlipped: boolean) => {
  const rotateY = useSharedValue(0);

  useEffect(() => {
    if (isFlipped) {
      rotateY.value = withSpring(180, springConfig.medium);
    } else {
      rotateY.value = withSpring(0, springConfig.medium);
    }
  }, [isFlipped]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotateY.value}deg` }],
  }));

  return animatedStyle;
};

/**
 * Premium floating animation (continuous subtle movement)
 */
export const useFloat = (isFloating: boolean) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (isFloating) {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 2000, easing: customEasing.smooth }),
          withTiming(0, { duration: 2000, easing: customEasing.smooth })
        ),
        -1,
        false
      );
    } else {
      translateY.value = withSpring(0, springConfig.gentle);
    }
  }, [isFloating]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return animatedStyle;
};

/**
 * Premium parallax scroll effect
 * @param scrollY - Animated scroll position value
 * @param range - Scroll range for the effect
 * @param speed - Parallax speed multiplier (0-1 for slower, >1 for faster)
 */
export const useParallax = (scrollY: any, range: number = 200, speed: number = 0.5) => {
  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, range],
      [0, range * speed],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY }],
    };
  });

  return animatedStyle;
};

/**
 * Premium zoom entrance with rotation
 */
export const useZoomRotate = (delay = 0) => {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(-180);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withSpring(1, springConfig.bouncy)
    );
    rotation.value = withDelay(
      delay,
      withSpring(0, springConfig.medium)
    );
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 400, easing: customEasing.entrance })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ],
    opacity: opacity.value,
  }));

  return animatedStyle;
};

/**
 * Premium swipe gesture feedback
 * @param progress - Animated swipe progress value (0 to 1)
 */
export const useSwipeProgress = (progress: any) => {
  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [0, 100],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      progress.value,
      [0, 0.5, 1],
      [1, 0.8, 0],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      progress.value,
      [0, 1],
      [1, 0.9],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX },
        { scale }
      ],
      opacity,
    };
  });

  return animatedStyle;
};
