import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

export default function BetslipScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Betslip</Text>
        <TouchableOpacity style={styles.clearBtn}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Slip items */}
        <View style={styles.slipCard}>
          <View style={styles.cardTop}>
            <View>
              <Text style={styles.leagueText}>PREMIER LEAGUE</Text>
              <Text style={styles.matchText}>Arsenal vs Chelsea</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="close-circle-outline" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.selectionRow}>
            <View>
              <Text style={styles.tipType}>Match Winner</Text>
              <Text style={styles.tipPick}>Arsenal (1)</Text>
            </View>
            <View style={styles.oddsBadge}>
              <Text style={styles.oddsText}>1.65</Text>
            </View>
          </View>
        </View>

        <View style={styles.slipCard}>
          <View style={styles.cardTop}>
            <View>
              <Text style={styles.leagueText}>LA LIGA</Text>
              <Text style={styles.matchText}>Real Madrid vs Barcelona</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="close-circle-outline" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.selectionRow}>
            <View>
              <Text style={styles.tipType}>Total Goals</Text>
              <Text style={styles.tipPick}>Over 2.5 Goals</Text>
            </View>
            <View style={styles.oddsBadge}>
              <Text style={styles.oddsText}>1.52</Text>
            </View>
          </View>
        </View>

        {/* Total Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Selections</Text>
            <Text style={styles.summaryValue}>2</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Combined Odds</Text>
            <Text style={styles.summaryHighlight}>2.51</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Estimated Win Rate</Text>
            <Text style={styles.winRateText}>~72%</Text>
          </View>

          <TouchableOpacity style={styles.copyCodeBtn} activeOpacity={0.8}>
            <Ionicons name="copy-outline" size={18} color={colors.background} />
            <Text style={styles.copyCodeText}>Copy Booking Code</Text>
          </TouchableOpacity>
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  clearBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  slipCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  leagueText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  matchText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  selectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  tipType: {
    color: colors.textMuted,
    fontSize: 12,
  },
  tipPick: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  oddsBadge: {
    backgroundColor: 'rgba(0, 210, 106, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  oddsText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  summaryValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  summaryHighlight: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  winRateText: {
    color: colors.secondary,
    fontSize: 15,
    fontWeight: '700',
  },
  copyCodeBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  copyCodeText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '700',
  },
});

