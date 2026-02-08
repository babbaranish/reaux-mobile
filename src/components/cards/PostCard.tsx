import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, fontFamily, spacing, borderRadius } from '../../theme';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { formatRelative, formatNumber } from '../../utils/formatters';
import type { Post, User, Role } from '../../types/models';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_MARGIN = spacing.lg;
const CARD_WIDTH = SCREEN_WIDTH - CARD_MARGIN * 2;
const IMAGE_HEIGHT = 280;

interface PostCardProps {
  post: Post;
  onPress?: () => void;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}

const getRoleBadge = (role: Role): { text: string; variant: 'primary' | 'success' | 'info' } | null => {
  if (role === 'admin') return { text: 'Admin', variant: 'primary' };
  if (role === 'superadmin') return { text: 'Coach', variant: 'success' };
  return null;
};

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onPress,
  onLike,
  onComment,
  onShare,
}) => {
  const author = typeof post.author === 'object' ? post.author as User : null;
  const authorName = author?.name ?? 'Unknown';
  const authorAvatar = author?.avatar;
  const authorRole = author?.role as Role | undefined;
  const roleBadge = authorRole ? getRoleBadge(authorRole) : null;
  const hasImage = post.mediaType === 'image' && post.mediaUrl;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.card}
    >
      {/* Image background */}
      {hasImage ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: post.mediaUrl }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
          {/* Gradient overlay at bottom for text readability */}
          <View style={styles.imageOverlay} />

          {/* Author overlay on image */}
          <View style={styles.authorOverlay}>
            <Avatar uri={authorAvatar} name={authorName} size={36} />
            <View style={styles.authorInfo}>
              <View style={styles.authorNameRow}>
                <Text style={styles.authorNameLight} numberOfLines={1}>
                  {authorName}
                </Text>
                {roleBadge && (
                  <Badge text={roleBadge.text} variant={roleBadge.variant} size="sm" />
                )}
              </View>
              <Text style={styles.timestampLight}>
                {formatRelative(post.createdAt)}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        /* Text-only post: author row at top */
        <View style={styles.authorRow}>
          <Avatar uri={authorAvatar} name={authorName} size={40} />
          <View style={styles.authorInfo}>
            <View style={styles.authorNameRow}>
              <Text style={styles.authorName} numberOfLines={1}>
                {authorName}
              </Text>
              {roleBadge && (
                <Badge text={roleBadge.text} variant={roleBadge.variant} size="sm" />
              )}
            </View>
            <Text style={styles.timestamp}>
              {formatRelative(post.createdAt)}
            </Text>
          </View>
        </View>
      )}

      {/* Caption / content */}
      {post.content ? (
        <View style={styles.contentContainer}>
          <Text style={styles.content} numberOfLines={3}>
            {post.content}
          </Text>
        </View>
      ) : null}

      {/* Hashtags */}
      {post.hashtags && post.hashtags.length > 0 && (
        <View style={styles.hashtagRow}>
          {post.hashtags.slice(0, 4).map((tag) => (
            <Text key={tag} style={styles.hashtag}>
              #{tag}
            </Text>
          ))}
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          onPress={onLike}
          style={styles.actionButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={post.isLiked ? 'heart' : 'heart-outline'}
            size={22}
            color={post.isLiked ? colors.status.error : colors.text.secondary}
          />
          <Text style={styles.actionCount}>
            {formatNumber(post.likesCount)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onComment}
          style={styles.actionButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={colors.text.secondary}
          />
          <Text style={styles.actionCount}>
            {formatNumber(post.commentsCount)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onShare}
          style={styles.actionButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name="share-outline"
            size={20}
            color={colors.text.secondary}
          />
        </TouchableOpacity>

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Product link badge */}
        {post.category && (
          <Badge text={post.category} variant="default" size="sm" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.card,
    marginHorizontal: CARD_MARGIN,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },

  // Image section
  imageContainer: {
    width: '100%',
    height: IMAGE_HEIGHT,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    // Gradient effect using a semi-transparent bottom
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  // Author overlay on image
  authorOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.overlay.medium,
  },
  authorInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  authorNameLight: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.white,
  },
  timestampLight: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(255,255,255,0.7)',
  },

  // Author row (text-only posts)
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
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

  // Content
  contentContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  content: {
    ...typography.body,
    color: colors.text.primary,
  },

  // Hashtags
  hashtagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    gap: spacing.sm,
  },
  hashtag: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    lineHeight: 18,
    color: colors.primary.yellowDark,
  },

  // Actions
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionCount: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.secondary,
  },
});
