import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { colors, borderRadius } from '../../theme';

interface VideoPlayerProps {
  uri: string;
  posterUri?: string;
  width?: number | string;
  height?: number;
  autoplay?: boolean;
  loop?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  uri,
  width = '100%',
  height = 300,
  autoplay = false,
  loop = true,
}) => {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = loop;
    if (autoplay) p.play();
  });

  return (
    <View style={[styles.container, { width: width as any, height }]}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.background.dark,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
