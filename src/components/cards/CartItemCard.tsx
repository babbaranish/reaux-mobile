import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamily, borderRadius, spacing } from '../../theme';
import { formatCurrency } from '../../utils/formatters';
import type { CartItem, Product } from '../../types/models';

interface CartItemCardProps {
  item: CartItem;
  onRemove: () => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({ item, onRemove }) => {
  const product = item.product as Product;
  const isPopulated = typeof product === 'object' && product !== null;

  const productName = isPopulated ? product.name : 'Product';
  const productPrice = isPopulated ? product.price : 0;
  const productImage = isPopulated ? product.images?.[0] : undefined;
  const lineTotal = productPrice * item.quantity;

  return (
    <View style={styles.container}>
      {/* Product Image */}
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: productImage }}
          style={styles.image}
          contentFit="cover"
          placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
          transition={200}
        />
      </View>

      {/* Product Details */}
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={2}>
          {productName}
        </Text>
        <Text style={styles.price}>{formatCurrency(productPrice)}</Text>
        <View style={styles.quantityRow}>
          <Text style={styles.quantityLabel}>Qty: </Text>
          <View style={styles.quantityBadge}>
            <Text style={styles.quantityText}>{item.quantity}</Text>
          </View>
          <Text style={styles.lineTotal}>{formatCurrency(lineTotal)}</Text>
        </View>
      </View>

      {/* Remove Button */}
      <TouchableOpacity
        onPress={onRemove}
        style={styles.removeButton}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        activeOpacity={0.7}
      >
        <Ionicons name="trash-outline" size={20} color={colors.status.error} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  imageWrap: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.border.light,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  details: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },
  name: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 18,
    color: colors.text.primary,
    marginBottom: 2,
  },
  price: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.text.secondary,
  },
  quantityBadge: {
    backgroundColor: colors.border.light,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  quantityText: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.text.primary,
  },
  lineTotal: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.text.primary,
  },
  removeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#fee2e2',
  },
});
