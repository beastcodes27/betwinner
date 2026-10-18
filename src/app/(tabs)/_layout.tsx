import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

interface DockIconProps {
  name: keyof typeof Ionicons.glyphMap;
  focusedName: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  color: any;
  badge?: number;
}

function DockIcon({ name, focusedName, focused, color, badge }: DockIconProps) {
  return (
    <View style={[styles.dockIconBox, focused && styles.dockIconBoxActive]}>
      <Ionicons name={focused ? focusedName : name} size={22} color={color} />
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
      {focused && <View style={styles.activeGlowDot} />}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 24 : 16,
          left: 16,
          right: 16,
          height: 68,
          borderRadius: 34,
          backgroundColor: colors.tabBar,
          borderWidth: 1.5,
          borderColor: colors.tabBarBorder,
          borderTopWidth: 1.5,
          borderTopColor: colors.tabBarBorder,
          elevation: 12,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.5,
          shadowRadius: 18,
          paddingHorizontal: 10,
          paddingBottom: Platform.OS === 'ios' ? 12 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: -2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <DockIcon
              name="home-outline"
              focusedName="home"
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="betslip"
        options={{
          title: 'Betslip',
          tabBarIcon: ({ color, focused }) => (
            <DockIcon
              name="receipt-outline"
              focusedName="receipt"
              focused={focused}
              color={color}
              badge={2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="following"
        options={{
          title: 'Following',
          tabBarIcon: ({ color, focused }) => (
            <DockIcon
              name="star-outline"
              focusedName="star"
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <DockIcon
              name="person-outline"
              focusedName="person"
              focused={focused}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  dockIconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 36,
    borderRadius: 18,
    position: 'relative',
  },
  dockIconBoxActive: {
    backgroundColor: colors.dockItemActive,
  },
  activeGlowDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.secondary,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 4,
    backgroundColor: colors.secondary,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '800',
  },
});
