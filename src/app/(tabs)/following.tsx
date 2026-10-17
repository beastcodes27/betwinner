import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

export default function FollowingScreen() {
  const [activeTab, setActiveTab] = useState<'tips' | 'leagues' | 'tipsters'>('tips');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Following</Text>
      </View>

      {/* Pill switcher */}
      <View style={styles.pillContainer}>
        <TouchableOpacity
          style={[styles.pill, activeTab === 'tips' && styles.pillActive]}
          onPress={() => setActiveTab('tips')}
        >
          <Text style={[styles.pillText, activeTab === 'tips' && styles.pillTextActive]}>
            Saved Tips
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pill, activeTab === 'leagues' && styles.pillActive]}
          onPress={() => setActiveTab('leagues')}
        >
          <Text style={[styles.pillText, activeTab === 'leagues' && styles.pillTextActive]}>
            Leagues
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pill, activeTab === 'tipsters' && styles.pillActive]}
          onPress={() => setActiveTab('tipsters')}
        >
          <Text style={[styles.pillText, activeTab === 'tipsters' && styles.pillTextActive]}>
            Tipsters
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'tips' && (
          <View>
            <View style={styles.followingCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.leagueText}>PREMIER LEAGUE • TODAY 19:30</Text>
                <Ionicons name="star" size={18} color={colors.secondary} />
              </View>
              <Text style={styles.matchTitle}>Arsenal vs Chelsea</Text>
              <View style={styles.tipRow}>
                <Text style={styles.tipBadge}>Tip: Arsenal to Win</Text>
                <Text style={styles.oddsText}>Odds: 1.65</Text>
              </View>
            </View>

            <View style={styles.followingCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.leagueText}>SERIE A • TOMORROW 20:45</Text>
                <Ionicons name="star" size={18} color={colors.secondary} />
              </View>
              <Text style={styles.matchTitle}>Inter vs Juventus</Text>
              <View style={styles.tipRow}>
                <Text style={styles.tipBadge}>Tip: Both Teams to Score (BTTS)</Text>
                <Text style={styles.oddsText}>Odds: 1.80</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'leagues' && (
          <View>
            {['Premier League (England)', 'Champions League (Europe)', 'La Liga (Spain)', 'Serie A (Italy)'].map(
              (league, idx) => (
                <View key={idx} style={styles.leagueItem}>
                  <Ionicons name="football-outline" size={24} color={colors.primary} />
                  <Text style={styles.leagueName}>{league}</Text>
                  <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                </View>
              )
            )}
          </View>
        )}

        {activeTab === 'tipsters' && (
          <View>
            {[
              { name: 'Alex Banker', rate: '84% Win Rate', followers: '12.4k' },
              { name: 'Goal Master', rate: '79% Win Rate', followers: '8.9k' },
              { name: 'High Odds Daily', rate: '68% Win Rate', followers: '15.1k' },
            ].map((tipster, idx) => (
              <View key={idx} style={styles.tipsterCard}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={20} color={colors.text} />
                </View>
                <View style={styles.tipsterInfo}>
                  <Text style={styles.tipsterName}>{tipster.name}</Text>
                  <Text style={styles.tipsterRate}>{tipster.rate} • {tipster.followers} followers</Text>
                </View>
                <TouchableOpacity style={styles.followingBtn}>
                  <Text style={styles.followingBtnText}>Following</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  pillContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  pillTextActive: {
    color: colors.background,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  followingCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  leagueText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  matchTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  tipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  tipBadge: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  oddsText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  leagueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  leagueName: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  tipsterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tipsterInfo: {
    flex: 1,
  },
  tipsterName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  tipsterRate: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  followingBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  followingBtnText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
});

