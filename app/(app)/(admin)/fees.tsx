import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../../src/components/layout/SafeScreen';
import { Header } from '../../../src/components/layout/Header';
import { Card } from '../../../src/components/ui/Card';
import { Button } from '../../../src/components/ui/Button';
import { Avatar } from '../../../src/components/ui/Avatar';
import { SearchBar } from '../../../src/components/ui/SearchBar';
import { RoleGuard } from '../../../src/components/guards/RoleGuard';
import { formatCurrency } from '../../../src/utils/formatters';
import { colors, fontFamily, spacing, borderRadius } from '../../../src/theme';

// Placeholder fee data for UI structure
interface FeeEntry {
  id: string;
  name: string;
  avatar?: string;
  amount: number;
  dueDate: string;
}

const MOCK_UPCOMING: FeeEntry[] = [
  { id: '1', name: 'John Doe', amount: 2500, dueDate: '2025-02-15' },
  { id: '2', name: 'Jane Smith', amount: 3000, dueDate: '2025-02-20' },
  { id: '3', name: 'Rahul Kumar', amount: 2500, dueDate: '2025-02-25' },
];

const MOCK_RECEIVED: FeeEntry[] = [
  { id: '4', name: 'Priya Patel', amount: 2500, dueDate: '2025-01-15' },
  { id: '5', name: 'Arjun Singh', amount: 3000, dueDate: '2025-01-10' },
];

interface FeeRowProps {
  entry: FeeEntry;
  actionLabel: string;
  actionVariant: 'primary' | 'outline';
  onAction: (id: string) => void;
}

const FeeRow: React.FC<FeeRowProps> = ({ entry, actionLabel, actionVariant, onAction }) => (
  <View style={styles.feeRow}>
    <Avatar name={entry.name} uri={entry.avatar} size={40} />
    <View style={styles.feeInfo}>
      <Text style={styles.feeName} numberOfLines={1}>{entry.name}</Text>
      <Text style={styles.feeAmount}>{formatCurrency(entry.amount)}</Text>
    </View>
    <Button
      title={actionLabel}
      onPress={() => onAction(entry.id)}
      variant={actionVariant}
      size="sm"
    />
  </View>
);

export default function FeesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [upcoming, setUpcoming] = useState(MOCK_UPCOMING);
  const [received, setReceived] = useState(MOCK_RECEIVED);

  const filteredUpcoming = upcoming.filter((e) =>
    e.name?.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredReceived = received.filter((e) =>
    e.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalMonthly = upcoming.reduce((sum, e) => sum + e.amount, 0);
  const totalQuarterly = totalMonthly * 3;

  const handleMarkPaid = (id: string) => {
    const entry = upcoming.find((e) => e.id === id);
    if (entry) {
      setUpcoming((prev) => prev.filter((e) => e.id !== id));
      setReceived((prev) => [entry, ...prev]);
    }
  };

  const handleMarkUnpaid = (id: string) => {
    const entry = received.find((e) => e.id === id);
    if (entry) {
      setReceived((prev) => prev.filter((e) => e.id !== id));
      setUpcoming((prev) => [entry, ...prev]);
    }
  };

  return (
    <RoleGuard allowedRoles={['admin', 'superadmin']}>
      <SafeScreen>
        <Header
          title="Fees"
          showBack
          onBack={() => router.back()}
        />

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Summary Cards */}
          <View style={styles.summaryRow}>
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Monthly Fees</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalMonthly)}</Text>
            </Card>
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Quarterly Fees</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalQuarterly)}</Text>
            </Card>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Search candidates..."
            />
          </View>

          {/* Upcoming Fees */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Fees</Text>
            {filteredUpcoming.length > 0 ? (
              filteredUpcoming.map((entry) => (
                <FeeRow
                  key={entry.id}
                  entry={entry}
                  actionLabel="Mark as Paid"
                  actionVariant="primary"
                  onAction={handleMarkPaid}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>No upcoming fees</Text>
            )}
          </View>

          {/* Received Fees */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Received Fees</Text>
            {filteredReceived.length > 0 ? (
              filteredReceived.map((entry) => (
                <FeeRow
                  key={entry.id}
                  entry={entry}
                  actionLabel="Mark as Unpaid"
                  actionVariant="outline"
                  onAction={handleMarkUnpaid}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>No received fees</Text>
            )}
          </View>

          {/* Export Button */}
          <Button
            title="Export Data"
            onPress={() => {}}
            variant="secondary"
            size="lg"
            fullWidth
            leftIcon={
              <Ionicons name="download-outline" size={20} color={colors.text.white} />
            }
          />
        </ScrollView>
      </SafeScreen>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 40,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  summaryLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.text.primary,
  },
  searchContainer: {
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    lineHeight: 24,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  feeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  feeInfo: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },
  feeName: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    lineHeight: 20,
    color: colors.text.primary,
  },
  feeAmount: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.secondary,
    marginTop: 2,
  },
  emptyText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.light,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
