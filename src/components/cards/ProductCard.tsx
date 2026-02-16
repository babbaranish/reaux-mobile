import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, withSequence, withSpring, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamily, borderRadius, spacing, shadows } from '../../theme';
import { formatCurrency } from '../../utils/formatters';
import type { Product } from '../../types/models';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = spacing.md;
const CARD_WIDTH = (SCREEN_WIDTH - spacing.xl * 2 - CARD_GAP) / 2;

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
}) => {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  // Card fade-in animation on mount
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) });
    scale.value = withSpring(1, { damping: 15, stiffness: 100 });
  }, []);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  // Add to cart animation
  const addToCartScale = useSharedValue(1);
  const addToCartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addToCartScale.value }],
  }));

  const handleAddToCart = (e: any) => {
    e.stopPropagation?.();
    // Trigger bounce animation
    addToCartScale.value = withSequence(
      withSpring(1.2, { damping: 10, stiffness: 300 }),
      withSpring(0.9, { damping: 10, stiffness: 300 }),
      withSpring(1, { damping: 10, stiffness: 300 })
    );
    onAddToCart();
  };

  return (
    <Animated.View style={cardAnimatedStyle}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[styles.container, shadows.card]}
      >
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.images?.[0] }}
          style={styles.image}
          contentFit="cover"
          placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
          transition={200}
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discountPercent}% OFF</Text>
          </View>
        )}

        {/* Add to Cart Button */}
        <TouchableOpacity
          onPress={handleAddToCart}
          activeOpacity={0.7}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        >
          <Animated.View style={[styles.addButton, addToCartAnimatedStyle]}>
            <Ionicons name="add" size={22} color={colors.text.onPrimary} />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Product Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        {product.category && (
          <Text style={styles.vendor} numberOfLines={1}>
            {product.category}
          </Text>
        )}

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatCurrency(product.price)}</Text>
          {hasDiscount && (
            <Text style={styles.comparePrice}>
              {formatCurrency(product.compareAtPrice!)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.card,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.border.light,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.status.error,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  discountText: {
    fontFamily: fontFamily.bold,
    fontSize: 10,
    color: colors.text.white,
  },
  addButton: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.button,
  },
  info: {
    padding: spacing.md,
  },
  name: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 18,
    color: colors.text.primary,
    marginBottom: 2,
  },
  vendor: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  price: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.text.primary,
  },
  comparePrice: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.light,
    textDecorationLine: 'line-through',
  },
});
