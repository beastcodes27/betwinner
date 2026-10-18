import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { MOCK_SLIPS, TipsterSlip } from '@/data/mockSlips';
import { useAppUI } from '@/context/UIContext';

type CategoryFilter = 'All' | 'Free' | 'Banker' | 'Goals' | 'VIP';

export default function BetslipScreen() {
  const { showToast, showPopup } = useAppUI();
  const [selectedFilter, setSelectedFilter] = useState<CategoryFilter>('All');
  const [activeSlip, setActiveSlip] = useState<TipsterSlip | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredSlips = MOCK_SLIPS.filter((slip) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Free') return slip.isFree;
    return slip.category === selectedFilter;
  });

  const handleCopyCode = (code: string, bookmaker?: string) => {
    setCopiedCode(code);
    showToast({
      type: 'success',
      title: 'Booking Code Copied!',
      message: `${bookmaker ? bookmaker.toUpperCase() + ': ' : ''}${code} copied. Load it directly into your betting app!`,
    });
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>COMMUNITY MARKETPLACE</Text>
          <Text style={styles.headerTitle}>Tipster Bet Slips</Text>
        </View>
        <TouchableOpacity
          style={styles.headerActionBtn}
          activeOpacity={0.7}
          onPress={() =>
            showPopup({
              type: 'info',
              icon: 'options-outline',
              title: 'Filter Marketplace',
              message:
                'Filter tipster slips by minimum odds, bookmakers (Betika, SportyBet, 1xBet), and stake amount.',
              primaryText: 'Close',
            })
          }
        >
          <Ionicons name="filter-outline" size={20} color={colors.secondary} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {(['All', 'Free', 'Banker', 'Goals', 'VIP'] as CategoryFilter[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.filterPill, selectedFilter === tab && styles.filterPillActive]}
              onPress={() => setSelectedFilter(tab)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterPillText, selectedFilter === tab && styles.filterPillTextActive]}>
                {tab === 'All' ? 'All Slips' : tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Slips List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredSlips.map((slip) => (
          <View key={slip.id} style={styles.slipCard}>
            {/* 1. Tipster Profile Header */}
            <View style={styles.tipsterRow}>
              <View style={[styles.avatar, { backgroundColor: slip.tipster.avatarBg }]}>
                <Text style={styles.avatarText}>{slip.tipster.name.charAt(0)}</Text>
              </View>

              <View style={styles.tipsterInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.tipsterName}>{slip.tipster.name}</Text>
                  {slip.tipster.verified && (
                    <Ionicons name="checkmark-circle" size={16} color={colors.secondary} />
                  )}
                </View>
                <View style={styles.statsRow}>
                  <Text style={styles.winRateText}>{slip.tipster.winRate}</Text>
                  <Text style={styles.dotDivider}>•</Text>
                  <Text style={styles.badgeText}>{slip.tipster.badge}</Text>
                </View>
              </View>

              {/* Amount / Price Badge */}
              <View style={[styles.amountBadge, slip.isFree ? styles.freeBadge : styles.paidBadge]}>
                <Text style={[styles.amountText, slip.isFree ? styles.freeText : styles.paidText]}>
                  {slip.amount}
                </Text>
              </View>
            </View>

            {/* Slip Title */}
            <Text style={styles.slipTitle}>{slip.title}</Text>

            {/* Key Metrics: Odds, Validity Time, Picks */}
            <View style={styles.metricsContainer}>
              {/* Total Odds */}
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>TOTAL ODDS</Text>
                <View style={styles.oddsValueRow}>
                  <Text style={styles.oddsNumber}>{slip.totalOdds.toFixed(2)}</Text>
                  <Text style={styles.oddsTag}>ODDS</Text>
                </View>
              </View>

              {/* Picks Count */}
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>SELECTIONS</Text>
                <View style={styles.picksValueRow}>
                  <Ionicons name="football-outline" size={15} color={colors.textSecondary} />
                  <Text style={styles.picksNumber}>{slip.matchesCount} Matches</Text>
                </View>
              </View>

              {/* Validity Time */}
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>VALIDITY</Text>
                <View style={styles.validityRow}>
                  <Ionicons name="time-outline" size={15} color={colors.secondary} />
                  <Text style={styles.validityTime}>{slip.validityTime}</Text>
                </View>
              </View>
            </View>

            {/* Bottom Actions: Betting Company & Booking Code + View Slip Button */}
            <View style={styles.cardFooter}>
              {/* Betting Company & Booking Code (Replaces confidence %) */}
              <TouchableOpacity
                style={[
                  styles.bookmakerCodePill,
                  copiedCode === slip.bookingCode && styles.bookmakerCodePillCopied,
                ]}
                onPress={() => handleCopyCode(slip.bookingCode, slip.bookmaker)}
                activeOpacity={0.7}
              >
                <View style={styles.bookmakerBadge}>
                  <Text style={styles.bookmakerBadgeText}>{slip.bookmaker.toUpperCase()}</Text>
                </View>
                <View style={styles.codeRow}>
                  <Text style={styles.codeText}>{slip.bookingCode}</Text>
                  <Ionicons
                    name={copiedCode === slip.bookingCode ? 'checkmark-circle' : 'copy-outline'}
                    size={14}
                    color={copiedCode === slip.bookingCode ? colors.secondary : colors.textMuted}
                  />
                </View>
              </TouchableOpacity>

              {/* View Slip Button */}
              <TouchableOpacity
                style={styles.viewSlipBtn}
                onPress={() => setActiveSlip(slip)}
                activeOpacity={0.8}
              >
                <Text style={styles.viewSlipText}>View Slip</Text>
                <Ionicons name="arrow-forward" size={15} color={colors.textOnPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Interactive View Slip Modal */}
      <Modal
        visible={!!activeSlip}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveSlip(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalSubtitle}>{activeSlip?.tipster.name}&apos;S BETSLIP</Text>
                <Text style={styles.modalTitle}>{activeSlip?.title}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setActiveSlip(null)}
                style={styles.closeBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Modal Summary Bar */}
            <View style={styles.modalSummaryBar}>
              <View style={styles.modalSummaryItem}>
                <Text style={styles.modalSummaryLabel}>Total Odds</Text>
                <Text style={styles.modalSummaryOdds}>{activeSlip?.totalOdds.toFixed(2)}</Text>
              </View>
              <View style={styles.modalSummaryDivider} />
              <View style={styles.modalSummaryItem}>
                <Text style={styles.modalSummaryLabel}>Validity</Text>
                <Text style={styles.modalSummaryValue}>{activeSlip?.validityTime}</Text>
              </View>
              <View style={styles.modalSummaryDivider} />
              <View style={styles.modalSummaryItem}>
                <Text style={styles.modalSummaryLabel}>Price</Text>
                <Text style={[styles.modalSummaryValue, activeSlip?.isFree ? styles.freeText : styles.paidText]}>
                  {activeSlip?.amount}
                </Text>
              </View>
            </View>

            {/* Matches list */}
            <ScrollView style={styles.modalMatchesList} showsVerticalScrollIndicator={false}>
              <Text style={styles.matchesSectionTitle}>
                Match Selections ({activeSlip?.selections.length})
              </Text>

              {activeSlip?.selections.map((match, index) => (
                <View key={match.id} style={styles.matchItemCard}>
                  <View style={styles.matchItemHeader}>
                    <Text style={styles.matchIndex}>#{index + 1} {match.league}</Text>
                    <Text style={styles.matchTime}>{match.kickoff}</Text>
                  </View>
                  <Text style={styles.matchTeamsText}>{match.match}</Text>
                  <View style={styles.matchPickRow}>
                    <View style={styles.pickBadge}>
                      <Text style={styles.pickLabel}>PICK:</Text>
                      <Text style={styles.pickValue}>{match.pick}</Text>
                    </View>
                    <View style={styles.itemOddsBadge}>
                      <Text style={styles.itemOddsText}>@{match.odds.toFixed(2)}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Booking Code Bar */}
            <View style={styles.bookingCodeSection}>
              <View style={styles.codeInfo}>
                <View style={styles.modalBookmakerRow}>
                  <Text style={styles.codeLabel}>BOOKING CODE</Text>
                  <View style={styles.modalBookmakerBadge}>
                    <Text style={styles.modalBookmakerText}>{activeSlip?.bookmaker.toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={styles.codeValue}>{activeSlip?.bookingCode}</Text>
              </View>
              <TouchableOpacity
                style={[styles.copyBtn, copiedCode === activeSlip?.bookingCode && styles.copyBtnSuccess]}
                onPress={() => activeSlip && handleCopyCode(activeSlip.bookingCode, activeSlip.bookmaker)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={copiedCode === activeSlip?.bookingCode ? 'checkmark-circle' : 'copy-outline'}
                  size={18}
                  color={colors.textOnPrimary}
                />
                <Text style={styles.copyBtnText}>
                  {copiedCode === activeSlip?.bookingCode ? 'Copied!' : 'Copy Code'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerSubtitle: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
  headerActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterPillText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: colors.textOnPrimary,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  slipCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
  },
  tipsterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  tipsterInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tipsterName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 6,
  },
  winRateText: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '700',
  },
  dotDivider: {
    color: colors.textMuted,
    fontSize: 12,
  },
  badgeText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  amountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  freeBadge: {
    backgroundColor: colors.badgeGreenBg,
    borderColor: colors.badgeGreenBorder,
  },
  paidBadge: {
    backgroundColor: colors.badgeGoldBg,
    borderColor: colors.badgeGoldBorder,
  },
  amountText: {
    fontSize: 12,
    fontWeight: '800',
  },
  freeText: {
    color: colors.secondary,
  },
  paidText: {
    color: colors.gold,
  },
  slipTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 14,
  },
  metricsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.cardInner,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    justifyContent: 'space-between',
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  oddsValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  oddsNumber: {
    color: colors.secondary,
    fontSize: 19,
    fontWeight: '900',
  },
  oddsTag: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: '800',
  },
  picksValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  picksNumber: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  validityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  validityTime: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  bookmakerCodePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardInner,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 8,
  },
  bookmakerCodePillCopied: {
    borderColor: colors.secondary,
    backgroundColor: colors.badgeGreenBg,
  },
  bookmakerBadge: {
    backgroundColor: colors.badgeGreenBg,
    borderWidth: 1,
    borderColor: colors.badgeGreenBorder,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bookmakerBadgeText: {
    color: colors.secondary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  codeText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  viewSlipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  viewSlipText: {
    color: colors.textOnPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalSubtitle: {
    color: colors.secondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  modalSummaryBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
  },
  modalSummaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  modalSummaryDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.cardBorder,
  },
  modalSummaryLabel: {
    color: colors.textMuted,
    fontSize: 11,
    marginBottom: 2,
  },
  modalSummaryOdds: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: '900',
  },
  modalSummaryValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  modalMatchesList: {
    maxHeight: 280,
    marginBottom: 16,
  },
  matchesSectionTitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  matchItemCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  matchItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  matchIndex: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  matchTime: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  matchTeamsText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  matchPickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  pickBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pickLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  pickValue: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '700',
  },
  itemOddsBadge: {
    backgroundColor: colors.badgeGreenBg,
    borderWidth: 1,
    borderColor: colors.badgeGreenBorder,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  itemOddsText: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '800',
  },
  bookingCodeSection: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  codeInfo: {
    flex: 1,
  },
  modalBookmakerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalBookmakerBadge: {
    backgroundColor: colors.badgeGreenBg,
    borderWidth: 1,
    borderColor: colors.badgeGreenBorder,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  modalBookmakerText: {
    color: colors.secondary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  codeLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  codeValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  copyBtnSuccess: {
    backgroundColor: colors.secondary,
  },
  copyBtnText: {
    color: colors.textOnPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
});
