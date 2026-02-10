# REAUX Labs Mobile - AI Development Guide

## Overview
REAUX Labs is a fitness/gym community + e-commerce mobile app built with **React Native**, **Expo SDK 54**, and **Expo Router v6** (file-based routing). It features social feeds, short-form video reels, diet plans, BMI tracking, a supplement marketplace, and a full admin panel. The backend API is hosted at `https://reaux-labs-be.onrender.com/api`.

Currency: **INR (₹)**. Locale: India.

---

## Tech Stack
- **Framework**: React Native 0.81.5 + Expo ~54.0.33
- **Routing**: expo-router ~6.0.23 (file-based, group routes with parentheses)
- **State**: Zustand ^5.0.11
- **API**: Axios ^1.13.5 with JWT auth interceptor
- **Lists**: @shopify/flash-list ^2.2.2 (always provide `estimatedItemSize`)
- **Images**: expo-image ~3.0.11
- **Video**: expo-video ~3.0.15
- **Storage**: expo-secure-store (JWT), AsyncStorage (general)
- **Icons**: @expo/vector-icons (Ionicons throughout)
- **Fonts**: SplineSans (Regular, Medium, Bold)
- **Dates**: date-fns ^4.1.0

---

## Project Structure

```
app/                          # Expo Router file-based screens
├── _layout.tsx               # Root: font loading, auth restore, SafeAreaProvider, Toast
├── index.tsx                 # Entry: redirects to /auth/login or /app/feed
├── (auth)/                   # Auth stack (dark bg, fade animations)
│   ├── login.tsx             # Email/password + invite code + social login
│   ├── register.tsx          # Name, email, phone, password
│   └── forgot-password.tsx   # Email-based password reset
└── (app)/                    # Main tab navigator
    ├── _layout.tsx           # Tabs: Feed, Reels, Diet, BMI, Shop*, Profile (*admin-only)
    ├── (feed)/               # Social feed
    │   ├── index.tsx         # Post list with category tabs, infinite scroll, FAB
    │   ├── [id].tsx          # Post detail + comments
    │   ├── upload.tsx        # Create post (text, image, hashtags, category)
    │   └── new-reel.tsx      # Create video reel (video picker, caption, link)
    ├── (reels)/              # Short-form video
    │   └── index.tsx         # Full-screen vertical video feed (TikTok-style)
    ├── (diet)/               # Diet plans
    │   ├── index.tsx         # Browse plans with category filters
    │   ├── [id].tsx          # Plan detail: meals, macros, follow/like
    │   ├── upload.tsx        # Create plan (admin)
    │   └── edit.tsx          # Edit plan (admin)
    ├── (health)/             # BMI tracking
    │   ├── index.tsx         # BMI calculator with sliders
    │   └── history.tsx       # BMI history chart + trend
    ├── (shop)/               # E-commerce marketplace
    │   ├── index.tsx         # Product grid, search, category tabs, floating cart
    │   ├── [id].tsx          # Product detail
    │   ├── cart.tsx          # Shopping cart
    │   ├── checkout.tsx      # Checkout with promo + address
    │   ├── address.tsx       # Add/edit shipping address
    │   ├── orders.tsx        # Order history with status filters
    │   ├── promo.tsx         # Apply promo code
    │   └── invoice/[id].tsx  # Order invoice/receipt
    ├── (profile)/
    │   ├── index.tsx         # My profile + settings + logout
    │   ├── edit.tsx          # Extended profile editing (DOB, gender, measurements)
    │   └── [id].tsx          # View another user's profile
    └── (admin)/              # Admin panel (RoleGuard: admin/superadmin)
        ├── index.tsx         # Admin dashboard with section links
        ├── analytics.tsx     # Platform analytics
        ├── sales-report.tsx  # Sales reports
        ├── fees.tsx          # Gym fee management
        ├── notifications.tsx # Notification management
        ├── gyms/             # Gym CRUD (superadmin)
        ├── products/         # Product CRUD
        ├── orders/           # Order management
        ├── users/            # User management + deactivation
        ├── challenges/       # Challenge CRUD
        └── promo/            # Promo banner management

src/
├── api/                      # Axios client + endpoint modules
│   ├── client.ts             # Base config, JWT interceptor, 401 redirect
│   ├── types.ts              # ApiResponse<T>, PaginatedResponse<T>, ApiError
│   ├── auth.ts               # Login, register, profile, avatar upload
│   ├── products.ts           # CRUD products
│   ├── cart.ts               # Cart operations
│   ├── orders.ts             # Order CRUD + status updates
│   ├── bmi.ts                # BMI record + history
│   ├── posts.ts              # Feed posts + comments + likes
│   ├── diets.ts              # Diet plan CRUD + follow/like
│   ├── reels.ts              # Reel CRUD + likes
│   ├── challenges.ts         # Challenge CRUD + join
│   ├── notifications.ts      # Notification CRUD + read status
│   ├── analytics.ts          # Admin stats + sales report
│   ├── users.ts              # Admin user management
│   ├── gyms.ts               # Gym CRUD
│   └── promos.ts             # Promo code CRUD + validation
├── stores/                   # Zustand stores (12 total)
│   ├── useAuthStore.ts       # Auth state, JWT, profile
│   ├── useFeedStore.ts       # Posts, likes, pagination
│   ├── useReelStore.ts       # Reels, likes, pagination
│   ├── useDietStore.ts       # Diet plans, follow/like
│   ├── useBmiStore.ts        # BMI records + history
│   ├── useProductStore.ts    # Products, search, category filter
│   ├── useCartStore.ts       # Cart items, totals
│   ├── useOrderStore.ts      # Orders, status updates
│   ├── useChallengeStore.ts  # Challenges, join
│   ├── useNotificationStore.ts # Notifications, read/unread
│   ├── useAdminStore.ts      # Admin stats, user management
│   └── useUIStore.ts         # Global loading, toast
├── components/
│   ├── ui/                   # Primitives: Button, Input, Avatar, Badge, Card,
│   │                         #   SearchBar, EmptyState, SkeletonLoader, Toast
│   ├── cards/                # Domain cards: PostCard, ReelCard, ProductCard,
│   │                         #   DietPlanCard, OrderCard, CartItemCard, BmiRecordCard,
│   │                         #   CommentCard, NotificationCard, PromoCard, UserCard
│   ├── layout/               # SafeScreen, Header
│   ├── guards/               # RoleGuard
│   └── media/                # VideoPlayer
├── hooks/                    # useDebounce, usePagination, useRefreshOnFocus, useImagePicker
├── theme/                    # Colors, typography, spacing (see below)
├── types/
│   └── models.ts             # All TypeScript interfaces
└── utils/
    ├── constants.ts          # API_URL, STORAGE_KEYS
    ├── storage.ts            # SecureStore (token) + AsyncStorage helpers
    └── formatters.ts         # formatDate, formatCurrency (INR), formatNumber, formatRelative
```

---

## Theme & Design System

### Colors
```
Primary:     #f9f506 (yellow), #fdfda3 (light), #c7c405 (dark)
Background:  #1c1c0d (dark), #f8f8f5 (light), #ffffff (white/card)
Border:      #e4e4e4 (gray), #f0f0f0 (light)
Text:        #1c1c0d (primary), rgba(28,28,13,0.7) (secondary), #999 (light), #fff (white)
             #1c1c0d (onPrimary - dark text on yellow backgrounds)
Status:      #22c55e (success), #ef4444 (error), #f59e0b (warning), #3b82f6 (info)
Overlay:     rgba(0,0,0,0.8/0.5), rgba(255,255,255,0.2)
```

### Typography
```
Font family: SplineSans-Regular, SplineSans-Medium, SplineSans-Bold
h1:    Bold 28/34    h2:   Bold 24/30    h3:   Bold 20/28    h4:   Bold 18/22
body:  Regular 16/24       bodyMedium: Medium 16/24     bodyBold: Bold 16/24
caption: Medium 14/20      small: Regular 12/16         micro: Bold 10/15
```

### Spacing
```
xs: 4   sm: 8   md: 12   lg: 16   xl: 20   xxl: 24   xxxl: 32
```

### Border Radius
```
sm: 4   md: 8   lg: 12   card: 16   xl: 20   pill: 9999   tag: 2
```

### Layout Constants
```
screenPadding: 16   tabBarHeight: 80   headerHeight: 56
```

### Shadows
```
card:   offset(0,10) opacity(0.1) radius(15) elevation(5)
button: offset(0,1) opacity(0.05) radius(2) elevation(2)
large:  offset(0,25) opacity(0.25) radius(50) elevation(10)
```

---

## Coding Conventions

### Component Patterns
- All screens wrapped in `<SafeScreen>` (safe area + status bar)
- Header component for app-bar: `<Header title="..." showBack onBack={} rightAction={} />`
- All lists use `FlashList` with `estimatedItemSize` (REQUIRED prop)
- Pagination: page-based, default limit 10 or 20
- Pull-to-refresh on all list screens
- Skeleton loaders for initial load states
- EmptyState component for empty lists
- Category filters as horizontal `ScrollView` with pill-shaped tabs
- Optimistic updates for likes, follows, cart operations (with rollback on error)
- `KeyboardAvoidingView` wrapping `ScrollView` on form screens

### State Management (Zustand)
- One store per domain feature
- Stores handle API calls directly
- Common state shape: `{ data, isLoading, error, pagination }`
- `clearError()` and `clearSelected*()` cleanup actions
- Optimistic UI updates with try/catch rollback

### API Layer
- Axios client with 30s timeout, auto JWT injection
- 401 responses clear token and redirect to login
- API responses follow `{ success, data, message }` or `{ success, data[], pagination }` shape
- FormData used for file uploads (images, videos)

### Navigation
- Expo Router file-based routing with group routes `(groupName)/`
- Dynamic routes: `[id].tsx`
- `router.push()` for navigation, `router.back()` for back
- `router.replace()` for auth redirects (no back stack)

### Styling
- `StyleSheet.create()` at bottom of each file
- Theme tokens imported from `src/theme`
- Never hardcode colors/spacing - always use theme constants
- `shadows.card` applied to card components
- `borderRadius.pill` for buttons and tabs
- `borderRadius.card` for card containers

### User Roles
- `user`: Standard member
- `admin`: Gym admin (can manage products, orders, diet plans, challenges)
- `superadmin`: Platform admin (can manage gyms, all admin features)
- Admin-only UI guarded by `<RoleGuard allowedRoles={['admin', 'superadmin']}>`
- Shop tab only visible to admins in tab bar config

### Common Gotchas
- Backend may return arrays as `undefined` instead of `[]` — always use optional chaining (`?.`) or nullish coalescing (`?? []`) when accessing array properties like `likes`, `followers`, `items`, `meals`, `tags`
- FlashList REQUIRES `estimatedItemSize` prop or layout breaks
- ScrollView inside flex containers needs `flexGrow: 0` to prevent stretching
- Header `right` slot uses `minWidth: 40` to accommodate variable-width actions
- Form screens need `KeyboardAvoidingView` with `behavior="padding"` on iOS

---

## API Endpoints Reference

| Domain | Endpoints |
|--------|-----------|
| Auth | `POST /auth/login`, `POST /auth/register`, `GET /auth/me`, `PUT /auth/profile`, `POST /auth/forgot-password` |
| Posts | `GET /posts`, `GET /posts/:id`, `POST /posts`, `POST /posts/:id/like`, `POST /posts/:id/comment` |
| Reels | `GET /reels`, `POST /reels` (multipart, 120s timeout), `POST /reels/:id/like` |
| Diets | `GET /diets`, `GET /diets/:id`, `POST /diets`, `PUT /diets/:id`, `POST /diets/:id/follow`, `POST /diets/:id/like` |
| BMI | `POST /bmi/record`, `GET /bmi/history`, `GET /bmi/latest` |
| Products | `GET /products`, `GET /products/:id`, `POST /products`, `PUT /products/:id` |
| Cart | `GET /cart`, `POST /cart/add`, `DELETE /cart/item/:productId` |
| Orders | `POST /orders/create`, `GET /orders/my`, `GET /orders`, `GET /orders/:id`, `PATCH /orders/:id/status` |
| Challenges | `GET /challenges`, `POST /challenges`, `POST /challenges/:id/join` |
| Notifications | `GET /notifications`, `PUT /notifications/read/:id`, `PATCH /notifications/mark-all-read` |
| Promos | `GET /promo`, `POST /promo/create`, `POST /promo/validate` |
| Admin | `GET /admin/stats`, `GET /admin/sales-report`, `GET/PUT /users`, `CRUD /gyms` |

---

## Key Data Models

```typescript
User        { _id, name, email, phone, role, avatar, height, weight, dateOfBirth, gender, gymId, status }
Post        { _id, author(User), content, mediaType, mediaUrl, isLiked, likesCount, commentsCount, hashtags, category }
Reel        { _id, author(User), videoUrl, caption, isLiked, likesCount, linkedProduct? }
DietPlan    { _id, title, description, category, image, meals[], totalCalories, followers[], likes[], tags[], isPublished }
Meal        { name, time, items: MealItem[] }
MealItem    { name, quantity, calories, protein, carbs, fat }
BmiRecord   { _id, userId, height, weight, bmi, category }
Product     { _id, name, description, price, compareAtPrice, images[], category, stock, nutrition }
Order       { _id, userId, items[], totalAmount, discount, finalAmount, promoCode, status, shippingAddress }
Cart        { _id, userId, items: CartItem[] }
CartItem    { product(Product), quantity }
Challenge   { _id, title, description, type, target, startDate, endDate, participants[] }
PromoCode   { _id, code, discountType, discountValue, minOrderAmount, maxDiscount, usageLimit, usedCount }
Notification { _id, userId, title, message, type, isRead }
```

**Roles**: `user | admin | superadmin`
**Order statuses**: `pending | confirmed | shipped | delivered | cancelled`
**Diet categories**: `weight-loss | muscle-gain | maintenance | keto | vegan | other`
**BMI categories**: `underweight | normal | overweight | obese`

---

## Component Quick Reference

| Component | Location | Key Props |
|-----------|----------|-----------|
| Button | `src/components/ui/Button.tsx` | `title, onPress, variant(primary/secondary/outline/ghost), size(sm/md/lg), loading, disabled, fullWidth, leftIcon` |
| Input | `src/components/ui/Input.tsx` | `label, placeholder, value, onChangeText, error, secureTextEntry, multiline, leftIcon, rightIcon` |
| Avatar | `src/components/ui/Avatar.tsx` | `uri, name (for initials fallback), size(default 40), borderColor` |
| Badge | `src/components/ui/Badge.tsx` | `text, variant(primary/success/error/warning/info/default), size(sm/md)` |
| Card | `src/components/ui/Card.tsx` | `children, style, onPress (makes touchable)` |
| SearchBar | `src/components/ui/SearchBar.tsx` | `value, onChangeText, placeholder` |
| EmptyState | `src/components/ui/EmptyState.tsx` | `icon, title, message, actionLabel, onAction` |
| SkeletonLoader | `src/components/ui/SkeletonLoader.tsx` | `width, height, borderRadius` |
| SafeScreen | `src/components/layout/SafeScreen.tsx` | `children, edges, statusBarStyle` |
| Header | `src/components/layout/Header.tsx` | `title, showBack, onBack, rightAction` |
| RoleGuard | `src/components/guards/RoleGuard.tsx` | `allowedRoles, children, fallbackRoute` |
