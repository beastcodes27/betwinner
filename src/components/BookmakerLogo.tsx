import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import { colors } from '@/constants/theme';

export interface BookmakerLogoProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
}

const BOOKMAKER_ASSETS: Record<string, ImageSourcePropType> = {
  betika: require('../../assets/logos/betika.png'),
  sportybet: require('../../assets/logos/sportybet.png'),
  '1xbet': require('../../assets/logos/1xbet.png'),
  mozzartbet: require('../../assets/logos/mozzartbet.png'),
  mozzart: require('../../assets/logos/mozzartbet.png'),
  betway: require('../../assets/logos/betway.png'),
};

const SIZE_MAP = {
  xs: { width: 62, height: 16 },
  sm: { width: 78, height: 20 },
  md: { width: 96, height: 25 },
  lg: { width: 118, height: 31 },
};

export default function BookmakerLogo({ name, size = 'sm', style }: BookmakerLogoProps) {
  const normalizedKey = (name || '').trim().toLowerCase().replace(/[\s-_]/g, '');
  const assetSource = BOOKMAKER_ASSETS[normalizedKey];
  const dimensions = SIZE_MAP[size];

  if (assetSource) {
    return (
      <View style={[styles.container, style]}>
        <Image
          source={assetSource}
          style={[
            styles.image,
            {
              width: dimensions.width,
              height: dimensions.height,
            },
          ]}
          resizeMode="contain"
        />
      </View>
    );
  }

  // Graceful fallback for any other bookmaker
  return (
    <View style={[styles.fallbackContainer, styles[`fallback_${size}`], style]}>
      <Text style={[styles.fallbackText, styles[`fallbackText_${size}`]]}>
        {(name || '').toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    borderRadius: 4,
  },
  fallbackContainer: {
    backgroundColor: colors.badgeGreenBg,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.badgeGreenBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback_xs: {
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  fallback_sm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  fallback_md: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  fallback_lg: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  fallbackText: {
    color: colors.secondary,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  fallbackText_xs: {
    fontSize: 8,
  },
  fallbackText_sm: {
    fontSize: 9,
  },
  fallbackText_md: {
    fontSize: 10,
  },
  fallbackText_lg: {
    fontSize: 12,
  },
});
