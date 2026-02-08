import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontFamily, spacing } from '../../theme';
import { Avatar } from '../ui/Avatar';
import { formatRelative } from '../../utils/formatters';
import type { Comment, User } from '../../types/models';

interface CommentCardProps {
  comment: Comment;
}

export const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const author =
    typeof comment.author === 'object' ? (comment.author as User) : null;
  const authorName = author?.name ?? 'User';
  const authorAvatar = author?.avatar;

  return (
    <View style={styles.container}>
      <Avatar uri={authorAvatar} name={authorName} size={34} />
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.authorName} numberOfLines={1}>
            {authorName}
          </Text>
          <Text style={styles.timestamp}>
            {formatRelative(comment.createdAt)}
          </Text>
        </View>
        <Text style={styles.content}>{comment.content}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignItems: 'flex-start',
  },
  body: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 2,
  },
  authorName: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.primary,
  },
  timestamp: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.text.light,
  },
  content: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
  },
});
