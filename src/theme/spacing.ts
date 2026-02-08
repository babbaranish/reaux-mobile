export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32,
} as const;

export const borderRadius = {
  sm: 4, md: 8, lg: 12, card: 16, xl: 20, pill: 9999, tag: 2,
} as const;

export const shadows = {
  card: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 15, elevation: 5 },
  button: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  large: { shadowColor: '#000', shadowOffset: { width: 0, height: 25 }, shadowOpacity: 0.25, shadowRadius: 50, elevation: 10 },
} as const;

export const layout = {
  screenPadding: 16,
  tabBarHeight: 80,
  headerHeight: 56,
} as const;
