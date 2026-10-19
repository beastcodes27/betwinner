import React, { useEffect, useState } from 'react';
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
import type { FollowedTipster, TipsterSlip } from '@/data/mockSlips';
import { useAppUI } from '@/context/UIContext';
import { useAppData } from '@/context/AppDataContext';
import BookmakerLogo from '@/components/BookmakerLogo';
import TipsterAvatar from '@/components/TipsterAvatar';

export default function FollowingScreen() {
  const { showToast } = useAppUI();
  const { tipsters: fetchedTipsters } = useAppData();
  const [tipsters, setTipsters] = useState<FollowedTipster[]>(fetchedTipsters);
  const [activeSlip, setActiveSlip] = useState<TipsterSlip | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    setTipsters(fetchedTipsters);
  }, [fetchedTipsters]);

  // Toggle follow status
  const handleToggleFollow = (id: string) => {
    const target = tipsters.find((t) => t.id === id);
    const isNowFollowing = !target?.isFollowing;
    setTipsters((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isFollowing: isNowFollowing } : t))
    );
    if (target) {
      showToast({
        type: isNowFollowing ? 'success' : 'info',
        title: isNowFollowing ? `Following ${target.name}` : `Unfollowed ${target.name}`,
        message: isNowFollowing
          ? 'You will now receive notifications when this tipster posts slips.'
          : 'You will no longer receive notifications for this tipster.',
      });
    }
  };

  // Toggle notifications for a specific tipster
  const handleToggleNotifications = (id: string) => {
    const target = tipsters.find((t) => t.id === id);
    const isNowEnabled = !target?.notificationsEnabled;
    setTipsters((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, notificationsEnabled: isNowEnabled } : t
      )
    );
    if (target) {
      showToast({
        type: isNowEnabled ? 'success' : 'info',
        title: isNowEnabled ? 'Alerts Activated' : 'Alerts Muted',
        message: isNowEnabled
          ? `Instant notifications on for ${target.name}.`
          : `Notifications paused for ${target.name}.`,
      });
    }
  };

  const handleCopyCode = (code: string, bookmaker?: string) => {
    setCopiedCode(code);
    showToast({
      type: 'success',
      title: 'Booking Code Copied!',
      message: `${bookmaker ? bookmaker.toUpperCase() + ': ' : ''}${code} copied to clipboard.`,
    });
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  const followingCount = tipsters.filter((t) => t.isFollowing).length;
  const averageWinRate = tipsters.length
    ? (
        tipsters.reduce((total, tipster) => total + parseInt(tipster.winRate, 10), 0) /
        tipsters.length
      ).toFixed(1)
    : '0.0';
  const activeSlipsCount = tipsters.reduce(
    (total, tipster) => total + tipster.activeSlipsCount,
    0,
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>YOUR EXPERT FEED</Text>
          <Text style={styles.headerTitle}>Followed Tipsters</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{followingCount} Followed</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Quick Stats Overview */}
        <View style={styles.statsBanner}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{followingCount}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statHighlight}>{averageWinRate}%</Text>
            <Text style={styles.statLabel}>Avg. Win Rate</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{activeSlipsCount}</Text>
            <Text style={styles.statLabel}>Active Slips</Text>
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tipsters You Follow</Text>
          <Text style={styles.sectionCount}>{followingCount} Profiles</Text>
        </View>

        {/* Tipster Cards List */}
        {tipsters.map((tipster) => (
          <View key={tipster.id} style={styles.tipsterCard}>
            {/* Top Row: Avatar, Name, Follow & Notification buttons */}
            <View style={styles.cardTopRow}>
              <TipsterAvatar
                name={tipster.name}
                source={tipster.avatarUrl}
                avatarBg={tipster.avatarBg}
                size="md"
                showOnlinePulse={true}
                showVerifiedBadge={tipster.verified}
                style={{ marginRight: 12 }}
              />

              <View style={styles.profileInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.tipsterName}>{tipster.name}</Text>
                  {tipster.verified && (
                    <Ionicons name="checkmark-circle" size={16} color={colors.secondary} />
                  )}
                </View>
                <Text style={styles.tipsterHandle}>
                  {tipster.handle} • {tipster.followers} followers
                </Text>
              </View>

              {/* Notification Bell */}
              <TouchableOpacity
                style={styles.notifBtn}
                onPress={() => handleToggleNotifications(tipster.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={tipster.notificationsEnabled ? 'notifications' : 'notifications-off-outline'}
                  size={18}
                  color={tipster.notificationsEnabled ? colors.secondary : colors.textMuted}
                />
              </TouchableOpacity>

              {/* Follow / Unfollow Button */}
              <TouchableOpacity
                style={[
                  styles.followActionBtn,
                  tipster.isFollowing ? styles.followingBtnActive : styles.followBtn,
                ]}
                onPress={() => handleToggleFollow(tipster.id)}
                activeOpacity={0.8}
              >
                {tipster.isFollowing ? (
                  <>
                    <Ionicons name="checkmark" size={14} color={colors.secondary} />
                    <Text style={styles.followingBtnText}>Following</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="add" size={14} color={colors.textOnPrimary} />
                    <Text style={styles.followBtnText}>Follow</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Performance Tags: Win Rate, Streak, Specialty */}
            <View style={styles.tagsRow}>
              <View style={styles.winRateBadge}>
                <Ionicons name="trending-up" size={13} color={colors.secondary} />
                <Text style={styles.winRateText}>{tipster.winRate}</Text>
              </View>
              <View style={styles.streakBadge}>
                <Text style={styles.streakText}>{tipster.streak}</Text>
              </View>
              <View style={styles.slipsBadge}>
                <Text style={styles.slipsBadgeText}>{tipster.activeSlipsCount} Slips Live</Text>
              </View>
            </View>

            <Text style={styles.specialtyText}>
              <Text style={styles.specialtyLabel}>Specialty: </Text>
              {tipster.specialty}
            </Text>

            {/* Latest Published Slip Snippet */}
            {tipster.latestSlip && (
              <View style={styles.latestSlipBox}>
                <View style={styles.latestSlipHeader}>
                  <View style={styles.latestSlipTag}>
                    <Text style={styles.latestSlipTagText}>LATEST BETSLIP</Text>
                  </View>
                  <Text style={styles.validityText}>{tipster.latestSlip.validityTime}</Text>
                </View>

                <View style={styles.slipDetailsRow}>
                  <View style={styles.slipMain}>
                    <Text style={styles.slipTitleText} numberOfLines={1}>
                      {tipster.latestSlip.title}
                    </Text>
                    <View style={styles.slipSubInfoRow}>
                      <BookmakerLogo name={tipster.latestSlip.bookmaker} source={tipster.latestSlip.bookmakerLogo} size="xs" />
                      <Text style={styles.slipSubInfoDot}>•</Text>
                      <Text style={styles.slipSubInfo}>
                        {tipster.latestSlip.matchesCount} Matches • {tipster.latestSlip.amount}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.oddsBox}>
                    <Text style={styles.oddsNumber}>
                      {tipster.latestSlip.totalOdds.toFixed(2)}
                    </Text>
                    <Text style={styles.oddsLabel}>ODDS</Text>
                  </View>
                </View>

                {/* View Slip Shortcut Button */}
                <TouchableOpacity
                  style={styles.viewSlipShortcut}
                  onPress={() => setActiveSlip(tipster.latestSlip ?? null)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.viewSlipShortcutText}>View Published Slip</Text>
                  <Ionicons name="arrow-forward" size={14} color={colors.textOnPrimary} />
                </TouchableOpacity>
              </View>
            )}
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
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 }}>
                {activeSlip && (
                  <TipsterAvatar
                    name={activeSlip.tipster.name}
                    source={activeSlip.tipster.avatarUrl}
                    avatarBg={activeSlip.tipster.avatarBg}
                    size="md"
                    showVerifiedBadge={activeSlip.tipster.verified}
                  />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalSubtitle}>{activeSlip?.tipster.name}&apos;S BETSLIP</Text>
                  <Text style={styles.modalTitle} numberOfLines={1}>{activeSlip?.title}</Text>
                </View>
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
                <Text style={styles.modalSummaryLabel}>Selections</Text>
                <Text style={styles.modalSummaryValue}>{activeSlip?.matchesCount} Picks</Text>
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
                  {activeSlip && <BookmakerLogo name={activeSlip.bookmaker} source={activeSlip.bookmakerLogo} size="sm" />}
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
  headerBadge: {
    backgroundColor: colors.badgeGreenBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.badgeGreenBorder,
  },
  headerBadgeText: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  statsBanner: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.cardBorder,
  },
  statNumber: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  statHighlight: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
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
    fontWeight: '800',
  },
  sectionCount: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  tipsterCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  avatarText: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '800',
  },
  onlinePulse: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: colors.card,
  },
  profileInfo: {
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
    fontWeight: '800',
  },
  tipsterHandle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  notifBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.cardInner,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  followActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 4,
  },
  followingBtnActive: {
    backgroundColor: colors.cardInner,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  followingBtnText: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '700',
  },
  followBtn: {
    backgroundColor: colors.primary,
  },
  followBtnText: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  winRateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.badgeGreenBg,
    borderWidth: 1,
    borderColor: colors.badgeGreenBorder,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  winRateText: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '800',
  },
  streakBadge: {
    backgroundColor: colors.badgeGoldBg,
    borderWidth: 1,
    borderColor: colors.badgeGoldBorder,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  streakText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '700',
  },
  slipsBadge: {
    backgroundColor: colors.cardInner,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  slipsBadgeText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  specialtyText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 14,
    lineHeight: 18,
  },
  specialtyLabel: {
    color: colors.textMuted,
    fontWeight: '700',
  },
  latestSlipBox: {
    backgroundColor: colors.cardInner,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  latestSlipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  latestSlipTag: {
    backgroundColor: colors.badgeGreenBg,
    borderWidth: 1,
    borderColor: colors.badgeGreenBorder,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  latestSlipTagText: {
    color: colors.secondary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  validityText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  slipDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  slipMain: {
    flex: 1,
    marginRight: 10,
  },
  slipTitleText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  slipSubInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  slipSubInfoDot: {
    color: colors.textMuted,
    fontSize: 11,
  },
  slipSubInfo: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  oddsBox: {
    alignItems: 'flex-end',
  },
  oddsNumber: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: '900',
  },
  oddsLabel: {
    color: colors.secondary,
    fontSize: 9,
    fontWeight: '800',
  },
  viewSlipShortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  viewSlipShortcutText: {
    color: colors.textOnPrimary,
    fontSize: 12,
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
  freeText: {
    color: colors.secondary,
  },
  paidText: {
    color: colors.gold,
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
