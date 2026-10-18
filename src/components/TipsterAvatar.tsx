import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface TipsterAvatarProps {
  name: string;
  source?: ImageSourcePropType | string | null;
  avatarBg?: string;
  size?: AvatarSize | number;
  showOnlinePulse?: boolean;
  showVerifiedBadge?: boolean;
  style?: ViewStyle;
  borderColor?: string;
  borderWidth?: number;
}

const SIZE_MAP: Record<AvatarSize, number> = {
  xs: 28,
  sm: 36,
  md: 48,
  lg: 64,
  xl: 96,
};

export default function TipsterAvatar({
  name,
  source,
  avatarBg = colors.cardInner,
  size = 'md',
  showOnlinePulse = false,
  showVerifiedBadge = false,
  style,
  borderColor = colors.cardBorder,
  borderWidth = 1.5,
}: TipsterAvatarProps) {
  const [hasError, setHasError] = useState(false);

  const dimension = typeof size === 'number' ? size : SIZE_MAP[size] || 48;
  const borderRadius = dimension / 2;
  const initial = name?.trim() ? name.trim().charAt(0).toUpperCase() : '?';

  // Normalize image source prop
  let imageSource: ImageSourcePropType | null = null;
  if (source && !hasError) {
    if (typeof source === 'string') {
      if (source.startsWith('http://') || source.startsWith('https://') || source.startsWith('file://')) {
        imageSource = { uri: source };
      }
    } else {
      imageSource = source as ImageSourcePropType;
    }
  }

  const fontSize = Math.max(11, Math.round(dimension * 0.42));
  const badgeSize = Math.max(12, Math.round(dimension * 0.32));
  const pulseSize = Math.max(8, Math.round(dimension * 0.24));

  return (
    <View
      style={[
        styles.container,
        {
          width: dimension,
          height: dimension,
          borderRadius,
          borderWidth,
          borderColor,
          backgroundColor: avatarBg,
        },
        style,
      ]}
    >
      {imageSource ? (
        <Image
          source={imageSource}
          style={{ width: dimension - borderWidth * 2, height: dimension - borderWidth * 2, borderRadius }}
          resizeMode="cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <Text style={[styles.initialText, { fontSize }]}>{initial}</Text>
      )}

      {/* Online activity indicator */}
      {showOnlinePulse && (
        <View
          style={[
            styles.pulseBadge,
            {
              width: pulseSize,
              height: pulseSize,
              borderRadius: pulseSize / 2,
              bottom: 0,
              right: 0,
            },
          ]}
        />
      )}

      {/* Verified checkmark badge */}
      {showVerifiedBadge && (
        <View
          style={[
            styles.verifiedBadge,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              bottom: -2,
              right: -2,
            },
          ]}
        >
          <Ionicons name="checkmark-circle" size={badgeSize} color={colors.secondary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    position: 'relative',
  },
  initialText: {
    color: colors.text,
    fontWeight: '800',
    textAlign: 'center',
  },
  pulseBadge: {
    position: 'absolute',
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: colors.card,
  },
  verifiedBadge: {
    position: 'absolute',
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
