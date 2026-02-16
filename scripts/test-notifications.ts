/**
 * Test Notifications Script
 *
 * This script helps you test notifications functionality by creating mock data.
 *
 * Usage:
 * 1. Import this in any screen temporarily
 * 2. Call createMockNotifications()
 * 3. Navigate to Profile → Notifications to see them
 */

import { useNotificationStore } from '../src/stores/useNotificationStore';

export const createMockNotifications = () => {
  const store = useNotificationStore.getState();

  const mockNotifications = [
    {
      _id: '1',
      userId: 'user123',
      title: 'New Follower',
      message: 'John Doe started following you',
      type: 'community' as const,
      isRead: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '2',
      userId: 'user123',
      title: 'Order Shipped',
      message: 'Your order #12345 has been shipped',
      type: 'order' as const,
      isRead: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      _id: '3',
      userId: 'user123',
      title: 'Challenge Invitation',
      message: 'You have been invited to join "30 Day Fitness Challenge"',
      type: 'challenge' as const,
      isRead: false,
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      _id: '4',
      userId: 'user123',
      title: 'Diet Plan Liked',
      message: 'Someone liked your "Keto Meal Plan"',
      type: 'community' as const,
      isRead: true, // Already read
      createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      updatedAt: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      _id: '5',
      userId: 'user123',
      title: 'Membership Assigned',
      message: 'You have been assigned a Premium Monthly membership',
      type: 'system' as const,
      isRead: false,
      createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      updatedAt: new Date(Date.now() - 345600000).toISOString(),
    },
  ];

  // Manually set the notifications in the store
  store.notifications = mockNotifications;
  store.unreadCount = mockNotifications.filter(n => !n.isRead).length;
  store.pagination = {
    page: 1,
    limit: 10,
    pages: 1,
    total: mockNotifications.length,
  };

  console.log('✅ Mock notifications created:', mockNotifications.length);
  console.log('📬 Unread count:', store.unreadCount);
};

// For quick testing in development
export const testNotificationActions = async () => {
  const store = useNotificationStore.getState();

  console.log('🧪 Testing notification actions...');

  // Test 1: Mark single notification as read
  if (store.notifications.length > 0) {
    const firstUnread = store.notifications.find(n => !n.isRead);
    if (firstUnread) {
      console.log('Testing markAsRead for:', firstUnread._id);
      await store.markAsRead(firstUnread._id);
      console.log('✅ Mark as read test complete');
    }
  }

  // Test 2: Mark all as read
  console.log('Testing markAllAsRead...');
  await store.markAllAsRead();
  console.log('✅ Mark all as read test complete');

  // Test 3: Refresh
  console.log('Testing refresh...');
  await store.refreshNotifications();
  console.log('✅ Refresh test complete');
};
