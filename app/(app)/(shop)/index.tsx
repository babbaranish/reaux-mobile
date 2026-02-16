import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../../src/components/layout/SafeScreen';
import { SearchBar } from '../../../src/components/ui/SearchBar';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { SkeletonLoader } from '../../../src/components/ui/SkeletonLoader';
import { ProductCard } from '../../../src/components/cards/ProductCard';
import { useProductStore } from '../../../src/stores/useProductStore';
import { useCartStore } from '../../../src/stores/useCartStore';
import { useAuthStore } from '../../../src/stores/useAuthStore';
import { useDebounce } from '../../../src/hooks/useDebounce';
import { useRefreshOnFocus } from '../../../src/hooks/useRefreshOnFocus';
import { formatCurrency } from '../../../src/utils/formatters';
import { colors, fontFamily, borderRadius, spacing, shadows, layout } from '../../../src/theme';

const CATEGORIES = ['All', 'Whey', 'Creatine', 'BCAA', 'Pre-Workout', 'Vitamins'];

export default function MarketplaceScreen() {
  const {
    products,
    isLoading,
    pagination,
    searchQuery,
    category,
    fetchProducts,
    setSearchQuery,
    setCategory,
  } = useProductStore();

  const { fetchCart, addToCart, itemCount, cartTotal } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  const [refreshing, setRefreshing] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 400);

  // Initial fetch
  useEffect(() => {
    fetchProducts(1);
    fetchCart();
  }, []);

  // Refetch when search or category changes
  useEffect(() => {
    fetchProducts(1, debouncedSearch, category);
  }, [debouncedSearch, category]);

  useRefreshOnFocus(
    useCallback(() => {
      fetchCart();
    }, []),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchProducts(1), fetchCart()]);
    setRefreshing(false);
  }, [category, debouncedSearch]);

  const handleLoadMore = useCallback(() => {
    if (isLoading || pagination.page >= pagination.pages) return;
    fetchProducts(pagination.page + 1);
  }, [isLoading, pagination]);

  const handleCategoryPress = useCallback(
    (cat: string) => {
      if (cat === 'All') {
        setCategory('');
      } else {
        setCategory(cat === category ? '' : cat);
      }
    },
    [category],
  );

  const handleAddToCart = useCallback(
    (productId: string) => {
      addToCart(productId, 1);
    },
    [],
  );

  const count = itemCount();
  const total = cartTotal();

  const renderProduct = useCallback(
    ({ item }: { item: any }) => (
      <ProductCard
        product={item}
        onPress={() => router.push(`/(app)/(shop)/${item._id}`)}
        onAddToCart={() => handleAddToCart(item._id)}
      />
    ),
    [handleAddToCart],
  );

  const ListHeader = useCallback(
    () => (
      <View>
        {/* Promo Banner */}
        {/* <TouchableOpacity
          style={styles.promoBanner}
          activeOpacity={0.8}
          onPress={() => router.push('/(app)/(shop)/promo')}
        >
          <View style={styles.promoContent}>
            <Ionicons name="pricetag" size={20} color={colors.text.onPrimary} />
            <View style={styles.promoTextWrap}>
              <Text style={styles.promoTitle}>Apply Promo Code</Text>
              <Text style={styles.promoSub}>
                Get 15% OFF on all supplements
              </Text>
            </View>
          </View>
          <View style={styles.promoApplyBtn}>
            <Text style={styles.promoApplyText}>Apply</Text>
          </View>
        </TouchableOpacity> */}

        {/* Admin Dashboard Button */}
        {/* {isAdmin && (
          <TouchableOpacity style={styles.adminBtn} activeOpacity={0.7}>
            <Ionicons name="bar-chart-outline" size={18} color={colors.text.white} />
            <Text style={styles.adminBtnText}>Superadmin Sales Dashboard</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.text.white} />
          </TouchableOpacity>
        )} */}

        {/* Section: In House Products */}
        <Text style={styles.sectionTitle}>In House Products</Text>
      </View>
    ),
    [isAdmin],
  );

  const ListFooter = useCallback(() => {
    if (isLoading && pagination.page > 1) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={colors.primary.yellow} />
        </View>
      );
    }
    return <View style={styles.footerSpacer} />;
  }, [isLoading, pagination.page]);

  return (
    <SafeScreen>
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.header}>Marketplace</Text>

        {/* Search */}
        <View style={styles.searchWrap}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search products..."
          />
        </View>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
          style={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat) => {
            const isActive = cat === category || (cat === 'All' && !category);
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => handleCategoryPress(cat)}
                style={[styles.categoryTab, isActive && styles.categoryTabActive]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isActive && styles.categoryTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Products Grid */}
        {products.length === 0 && !isLoading ? (
          <EmptyState
            icon="storefront-outline"
            title="No Products Found"
            message="Try adjusting your search or filters"
          />
        ) : (
          <FlashList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item._id}
            numColumns={2}
            // estimatedItemSize={220}
            ListHeaderComponent={ListHeader}
            ListFooterComponent={ListFooter}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary.yellow}
              />
            }
            ItemSeparatorComponent={() => <View style={{ width: spacing.md }} />}
          />
        )}

        {/* Skeleton loading for first load */}
        {isLoading && products.length === 0 && (
          <View style={styles.loadingOverlay}>
            <View style={styles.skeletonGrid}>
              {[1, 2, 3, 4].map((i) => (
                <View key={i} style={styles.skeletonItem}>
                  <SkeletonLoader width="100%" height={140} borderRadius={12} />
                  <SkeletonLoader width="70%" height={14} style={{ marginTop: 10 }} />
                  <SkeletonLoader width="40%" height={14} style={{ marginTop: 6 }} />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Floating Cart Badge */}
        {count > 0 && (
          <TouchableOpacity
            style={[styles.floatingCart, shadows.large]}
            activeOpacity={0.85}
            onPress={() => router.push('/(app)/(shop)/cart')}
          >
            <View style={styles.floatingCartLeft}>
              <Ionicons name="cart" size={22} color={colors.text.onPrimary} />
              <View style={styles.cartCountBadge}>
                <Text style={styles.cartCountText}>{count}</Text>
              </View>
            </View>
            <Text style={styles.floatingCartText}>View Cart</Text>
            <Text style={styles.floatingCartTotal}>{formatCurrency(total)}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    lineHeight: 34,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  searchWrap: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },

  // Categories
  categoriesScroll: {
    marginBottom: spacing.lg,
    flexGrow: 0,
  },
  categoriesContent: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  categoryTab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.border.light,
    marginRight: spacing.sm,
  },
  categoryTabActive: {
    backgroundColor: colors.primary.yellow,
  },
  categoryText: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.text.secondary,
  },
  categoryTextActive: {
    color: colors.text.onPrimary,
    fontFamily: fontFamily.bold,
  },

  // Promo Banner
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary.yellow,
    borderRadius: borderRadius.card,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  promoTextWrap: {
    flex: 1,
  },
  promoTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.text.onPrimary,
  },
  promoSub: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: 'rgba(28, 28, 13, 0.7)',
    marginTop: 1,
  },
  promoApplyBtn: {
    backgroundColor: colors.background.dark,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
  },
  promoApplyText: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.text.white,
  },

  // Admin
  adminBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.dark,
    borderRadius: borderRadius.card,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  adminBtnText: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.text.white,
    flex: 1,
  },

  // Section
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    lineHeight: 22,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },

  // List
  listContent: {
    paddingHorizontal: spacing.xl,
  },

  footerLoader: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  footerSpacer: {
    height: layout.tabBarHeight + 60,
  },

  // Loading
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background.light,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  skeletonItem: {
    width: '47%',
    marginBottom: spacing.md,
  },

  // Floating Cart
  floatingCart: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.xl,
    right: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary.yellow,
    borderRadius: borderRadius.card,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    height: 56,
  },
  floatingCartLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  cartCountBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: colors.background.dark,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartCountText: {
    fontFamily: fontFamily.bold,
    fontSize: 10,
    color: colors.text.white,
  },
  floatingCartText: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.text.onPrimary,
  },
  floatingCartTotal: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: colors.text.onPrimary,
  },
});
