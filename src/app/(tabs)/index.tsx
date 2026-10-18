import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>DAILY WINNING PREDICTIONS</Text>
          <Text style={styles.headerTitle}>BETWINNER</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.7}>
          <Ionicons name="notifications-outline" size={22} color={colors.text} />
          <View style={styles.badgeDot} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerInfo}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{"TODAY'S HIGHLIGHT"}</Text>
            </View>
            <Text style={styles.bannerTitle}>Banker of the Day</Text>
            <Text style={styles.bannerOdds}>Odds: 1.85 • 88% Confidence</Text>
          </View>
          <Ionicons name="shield-checkmark" size={44} color={colors.secondary} />
        </View>

        {/* Section title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Tips</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Match tip card 1 */}
        <View style={styles.tipCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.leagueText}>PREMIER LEAGUE • 19:30</Text>
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>85% Confidence</Text>
            </View>
          </View>

          <View style={styles.matchTeams}>
            <View style={styles.teamRow}>
              <Text style={styles.teamName}>Arsenal</Text>
              <Text style={styles.teamOdds}>1.65</Text>
            </View>
            <View style={styles.teamRow}>
              <Text style={styles.teamName}>Chelsea</Text>
              <Text style={styles.teamOdds}>4.20</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.predictionBox}>
              <Text style={styles.predictionLabel}>TIP:</Text>
              <Text style={styles.predictionValue}>Home Win (1)</Text>
            </View>
            <TouchableOpacity style={styles.addToSlipBtn} activeOpacity={0.7}>
              <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
              <Text style={styles.addToSlipText}>Add to slip</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Match tip card 2 */}
        <View style={styles.tipCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.leagueText}>LA LIGA • 21:00</Text>
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>80% Confidence</Text>
            </View>
          </View>

          <View style={styles.matchTeams}>
            <View style={styles.teamRow}>
              <Text style={styles.teamName}>Real Madrid</Text>
              <Text style={styles.teamOdds}>1.52</Text>
            </View>
            <View style={styles.teamRow}>
              <Text style={styles.teamName}>Barcelona</Text>
              <Text style={styles.teamOdds}>2.40</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.predictionBox}>
              <Text style={styles.predictionLabel}>TIP:</Text>
              <Text style={styles.predictionValue}>Over 2.5 Goals</Text>
            </View>
            <TouchableOpacity style={styles.addToSlipBtn} activeOpacity={0.7}>
              <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
              <Text style={styles.addToSlipText}>Add to slip</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  headerSub: {
    color: colors.secondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  badgeDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  bannerCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 20,
  },
  bannerInfo: {
    flex: 1,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accentAlpha,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },
  tagText: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: '700',
  },
  bannerTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  bannerOdds: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  seeAllText: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '600',
  },
  tipCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leagueText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  confidenceBadge: {
    backgroundColor: colors.accentAlpha,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  confidenceText: {
    color: colors.secondary,
    fontSize: 11,
    fontWeight: '700',
  },
  matchTeams: {
    marginBottom: 12,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  teamName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  teamOdds: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  predictionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  predictionLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  predictionValue: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: '700',
  },
  addToSlipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  addToSlipText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
});
