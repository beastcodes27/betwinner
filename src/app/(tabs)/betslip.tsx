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
import BookmakerLogo from '@/components/BookmakerLogo';

type CategoryFilter = 'All' | 'Free' | 'Banker' | 'Goals' | 'VIP';

export interface VipPlan {
  id: 'single' | 'weekly' | 'monthly';
  name: string;
  duration: string;
  price: string;
  amountNum: number;
  badge?: string;
  description: string;
}

export const VIP_PLANS: VipPlan[] = [
  {
    id: 'single',
    name: 'Single Slip Unlock',
    duration: '1 Ticket Access',
    price: 'Tshs 2,000',
    amountNum: 2000,
    description: 'Instant unlock for this specific VIP ticket & booking code',
  },
  {
    id: 'weekly',
    name: 'Weekly VIP Pass',
    duration: '7 Days Unlimited',
    price: 'Tshs 5,000',
    amountNum: 5000,
    badge: 'POPULAR',
    description: 'Unlimited access to all VIP banker tickets & codes for 7 days',
  },
  {
    id: 'monthly',
    name: 'Monthly VIP Club',
    duration: '30 Days Unlimited',
    price: 'Tshs 15,000',
    amountNum: 15000,
    badge: 'BEST VALUE',
    description: '30-day VIP pass + priority banker slips & instant alerts',
  },
];

export default function BetslipScreen() {
  const { showToast, showPopup } = useAppUI();
  const [selectedFilter, setSelectedFilter] = useState<CategoryFilter>('All');
  const [activeSlip, setActiveSlip] = useState<TipsterSlip | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [unlockedSlipIds, setUnlockedSlipIds] = useState<string[]>([]);
  const [isVipSubscribed, setIsVipSubscribed] = useState<boolean>(false);
  const [selectedPlanId, setSelectedPlanId] = useState<'single' | 'weekly' | 'monthly'>('weekly');
  const [showVipModal, setShowVipModal] = useState<boolean>(false);

  const isSlipUnlocked = (slip: TipsterSlip) => {
    if (slip.isFree) return true;
    if (isVipSubscribed) return true;
    return unlockedSlipIds.includes(slip.id);
  };

  const handleUnlockVIP = (slip: TipsterSlip, planId: 'single' | 'weekly' | 'monthly') => {
    const plan = VIP_PLANS.find((p) => p.id === planId) || VIP_PLANS[0];
    showPopup({
      title: `Subscribe: ${plan.name} 👑`,
      message: `Confirm payment of ${plan.price} from your wallet for ${plan.name}? You will get full instant access to ${slip.tipster.name}'s VIP selections and the ${slip.bookmaker} booking code.`,
      type: 'success',
      icon: 'sparkles',
      primaryText: `Pay ${plan.price}`,
      secondaryText: 'Cancel',
      onConfirm: () => {
        if (plan.id === 'single') {
          setUnlockedSlipIds((prev) => [...prev, slip.id]);
        } else {
          setIsVipSubscribed(true);
          setUnlockedSlipIds((prev) => [...prev, slip.id]);
        }
        showToast({
          type: 'success',
          title: 'VIP Access Activated! 👑',
          message: `${slip.bookmaker} booking code ${slip.bookingCode} is now revealed and ready to copy.`,
        });
      },
    });
  };

  const handleSubscribeGeneral = (planId: 'weekly' | 'monthly') => {
    const plan = VIP_PLANS.find((p) => p.id === planId) || VIP_PLANS[1];
    showPopup({
      title: `Activate: ${plan.name} 👑`,
      message: `Subscribe to ${plan.name} for ${plan.price} from your wallet? You will unlock all VIP slips, booking codes, and high-odds banker combinations.`,
      type: 'success',
      icon: 'sparkles',
      primaryText: `Subscribe for ${plan.price}`,
      secondaryText: 'Cancel',
      onConfirm: () => {
        setIsVipSubscribed(true);
        setShowVipModal(false);
        showToast({
          type: 'success',
          title: 'VIP Subscription Active! 👑',
          message: 'All VIP slips and booking codes across the app are now unlocked!',
        });
      },
    });
  };

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

      {/* VIP Promo Banner */}
      {!isVipSubscribed ? (
        <TouchableOpacity
          style={styles.vipPromoBanner}
          activeOpacity={0.85}
          onPress={() => setShowVipModal(true)}
        >
          <View style={styles.vipPromoLeft}>
            <View style={styles.vipPromoCrown}>
              <Ionicons name="sparkles" size={16} color={colors.gold} />
            </View>
            <View style={styles.vipPromoTextCol}>
              <View style={styles.vipPromoTitleRow}>
                <Text style={styles.vipPromoTitle}>VIP ELITE CHANNEL</Text>
                <View style={styles.vipPromoTag}>
                  <Text style={styles.vipPromoTagText}>90%+ WIN</Text>
                </View>
              </View>
              <Text style={styles.vipPromoSub}>
                Subscribe to unlock all VIP high-odds slips & direct booking codes
              </Text>
            </View>
          </View>
          <View style={styles.vipPromoBtn}>
            <Text style={styles.vipPromoBtnText}>Plans</Text>
            <Ionicons name="chevron-forward" size={12} color={colors.textOnPrimary} />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.vipActiveBanner}>
          <Ionicons name="checkmark-circle" size={15} color={colors.secondary} />
          <Text style={styles.vipActiveBannerText}>ACTIVE VIP MEMBER • ALL SLIPS & CODES UNLOCKED</Text>
        </View>
      )}

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

            {/* Bottom Actions: Betting Company (Code Hidden until View) + View Slip Button */}
            {(() => {
              const unlocked = isSlipUnlocked(slip);
              return (
                <View style={styles.cardFooter}>
                  {/* Betting Company & Masked/Protected Code Pill */}
                  <TouchableOpacity
                    style={[
                      styles.bookmakerCodePill,
                      unlocked && styles.bookmakerCodePillUnlocked,
                    ]}
                    onPress={() => setActiveSlip(slip)}
                    activeOpacity={0.7}
                  >
                    <BookmakerLogo name={slip.bookmaker} size="sm" />
                    <View style={styles.codeRow}>
                      {unlocked ? (
                        <>
                          <Ionicons name="lock-open-outline" size={13} color={colors.secondary} />
                          <Text style={styles.codeUnlockedText}>{slip.bookingCode}</Text>
                        </>
                      ) : !slip.isFree ? (
                        <>
                          <Ionicons name="lock-closed" size={12} color={colors.gold} />
                          <Text style={styles.codeVipProtectedText}>VIP LOCKED</Text>
                        </>
                      ) : (
                        <>
                          <Ionicons name="eye-outline" size={13} color={colors.textSecondary} />
                          <Text style={styles.codeProtectedText}>•••••••• (View)</Text>
                        </>
                      )}
                    </View>
                  </TouchableOpacity>

                  {/* View Slip Button */}
                  <TouchableOpacity
                    style={[
                      styles.viewSlipBtn,
                      !unlocked && !slip.isFree && styles.vipViewSlipBtn,
                    ]}
                    onPress={() => setActiveSlip(slip)}
                    activeOpacity={0.8}
                  >
                    {!unlocked && !slip.isFree ? (
                      <>
                        <Ionicons name="sparkles" size={13} color={colors.textOnPrimary} />
                        <Text style={styles.viewSlipText}>View & Unlock</Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.viewSlipText}>View Slip</Text>
                        <Ionicons name="arrow-forward" size={15} color={colors.textOnPrimary} />
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })()}
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
            {(() => {
              if (!activeSlip) return null;
              const unlocked = isSlipUnlocked(activeSlip);

              return (
                <>
                  {/* Modal Header */}
                  <View style={styles.modalHeader}>
                    <View>
                      <View style={styles.modalHeaderTagRow}>
                        <Text style={styles.modalSubtitle}>{activeSlip.tipster.name}&apos;S BETSLIP</Text>
                        {!unlocked && !activeSlip.isFree && (
                          <View style={styles.vipExclusivePill}>
                            <Ionicons name="sparkles" size={10} color={colors.gold} />
                            <Text style={styles.vipExclusiveText}>VIP PASS</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.modalTitle}>{activeSlip.title}</Text>
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
                      <Text style={styles.modalSummaryOdds}>{activeSlip.totalOdds.toFixed(2)}</Text>
                    </View>
                    <View style={styles.modalSummaryDivider} />
                    <View style={styles.modalSummaryItem}>
                      <Text style={styles.modalSummaryLabel}>Validity</Text>
                      <Text style={styles.modalSummaryValue}>{activeSlip.validityTime}</Text>
                    </View>
                    <View style={styles.modalSummaryDivider} />
                    <View style={styles.modalSummaryItem}>
                      <Text style={styles.modalSummaryLabel}>Access</Text>
                      <Text
                        style={[
                          styles.modalSummaryValue,
                          activeSlip.isFree || unlocked ? styles.freeText : styles.paidText,
                        ]}
                      >
                        {activeSlip.isFree ? 'Free' : unlocked ? 'Unlocked 🔓' : activeSlip.amount}
                      </Text>
                    </View>
                  </View>

                  {/* Matches list & VIP Gate */}
                  <ScrollView style={styles.modalMatchesList} showsVerticalScrollIndicator={false}>
                    <Text style={styles.matchesSectionTitle}>
                      Match Selections ({activeSlip.selections.length})
                    </Text>

                    {activeSlip.selections.map((match, index) => {
                      const isLockedMatch = !unlocked && !activeSlip.isFree && index > 0;

                      return (
                        <View key={match.id} style={styles.matchItemCard}>
                          <View style={styles.matchItemHeader}>
                            <Text style={styles.matchIndex}>
                              #{index + 1} {match.league}
                            </Text>
                            <Text style={styles.matchTime}>{match.kickoff}</Text>
                          </View>
                          <Text style={styles.matchTeamsText}>{match.match}</Text>

                          {isLockedMatch ? (
                            <View style={styles.lockedPickRow}>
                              <View style={styles.lockedPickBadge}>
                                <Ionicons name="lock-closed" size={13} color={colors.gold} />
                                <Text style={styles.lockedPickText}>VIP PREDICTION LOCKED</Text>
                              </View>
                              <View style={styles.lockedOddsBadge}>
                                <Text style={styles.lockedOddsText}>@VIP</Text>
                              </View>
                            </View>
                          ) : (
                            <View style={styles.matchPickRow}>
                              <View style={styles.pickBadge}>
                                <Text style={styles.pickLabel}>PICK:</Text>
                                <Text style={styles.pickValue}>{match.pick}</Text>
                              </View>
                              <View style={styles.itemOddsBadge}>
                                <Text style={styles.itemOddsText}>@{match.odds.toFixed(2)}</Text>
                              </View>
                            </View>
                          )}
                        </View>
                      );
                    })}

                    {/* VIP Subscription Card (If Locked) */}
                    {!unlocked && !activeSlip.isFree && (
                      <View style={styles.vipGateCard}>
                        <View style={styles.vipGateHeader}>
                          <View style={styles.vipGateIconCircle}>
                            <Ionicons name="sparkles" size={20} color={colors.gold} />
                          </View>
                          <View style={styles.vipGateHeaderTextCol}>
                            <Text style={styles.vipGateTitle}>VIP ACCESS REQUIRED</Text>
                            <Text style={styles.vipGateSubtitle}>
                              Subscribe to access {activeSlip.tipster.name}&apos;s full ticket & {activeSlip.bookmaker} booking code.
                            </Text>
                          </View>
                        </View>

                        {/* Subscription Plans Selection */}
                        <Text style={styles.vipPlansSectionTitle}>SELECT SUBSCRIPTION PLAN</Text>
                        <View style={styles.vipPlansGrid}>
                          {VIP_PLANS.map((plan) => {
                            const isSelected = selectedPlanId === plan.id;
                            return (
                              <TouchableOpacity
                                key={plan.id}
                                style={[styles.vipPlanCard, isSelected && styles.vipPlanCardSelected]}
                                activeOpacity={0.8}
                                onPress={() => setSelectedPlanId(plan.id)}
                              >
                                {plan.badge && (
                                  <View style={styles.vipPlanBadge}>
                                    <Text style={styles.vipPlanBadgeText}>{plan.badge}</Text>
                                  </View>
                                )}
                                <View style={styles.vipPlanHeaderRow}>
                                  <Text style={[styles.vipPlanName, isSelected && styles.vipPlanNameSelected]}>
                                    {plan.name}
                                  </Text>
                                  <Text style={[styles.vipPlanPrice, isSelected && styles.vipPlanPriceSelected]}>
                                    {plan.price}
                                  </Text>
                                </View>
                                <Text style={styles.vipPlanDuration}>{plan.duration}</Text>
                                <Text style={styles.vipPlanDesc}>{plan.description}</Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>

                        {/* Direct Unlock Button */}
                        <TouchableOpacity
                          style={styles.vipUnlockBtn}
                          activeOpacity={0.85}
                          onPress={() => handleUnlockVIP(activeSlip, selectedPlanId)}
                        >
                          <Ionicons name="shield-checkmark" size={17} color={colors.textOnPrimary} />
                          <Text style={styles.vipUnlockBtnText}>
                            Subscribe & Unlock ({VIP_PLANS.find((p) => p.id === selectedPlanId)?.price})
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </ScrollView>

                  {/* Booking Code Bar (Unlocked vs Locked) */}
                  {unlocked ? (
                    <View style={styles.bookingCodeSection}>
                      <View style={styles.codeInfo}>
                        <View style={styles.modalBookmakerRow}>
                          <Text style={styles.codeLabel}>BOOKING CODE</Text>
                          <BookmakerLogo name={activeSlip.bookmaker} size="sm" />
                        </View>
                        <Text style={styles.codeValue}>{activeSlip.bookingCode}</Text>
                      </View>
                      <TouchableOpacity
                        style={[
                          styles.copyBtn,
                          copiedCode === activeSlip.bookingCode && styles.copyBtnSuccess,
                        ]}
                        onPress={() => handleCopyCode(activeSlip.bookingCode, activeSlip.bookmaker)}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={copiedCode === activeSlip.bookingCode ? 'checkmark-circle' : 'copy-outline'}
                          size={18}
                          color={colors.textOnPrimary}
                        />
                        <Text style={styles.copyBtnText}>
                          {copiedCode === activeSlip.bookingCode ? 'Copied!' : 'Copy Code'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.bookingCodeSection}>
                      <View style={styles.codeInfo}>
                        <View style={styles.modalBookmakerRow}>
                          <Text style={styles.codeLabel}>BOOKING CODE</Text>
                          <BookmakerLogo name={activeSlip.bookmaker} size="sm" />
                        </View>
                        <Text style={styles.codeValueLocked}>•••••••• (VIP Subscription)</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.lockedCopyBtn}
                        onPress={() => handleUnlockVIP(activeSlip, selectedPlanId)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="lock-closed" size={16} color={colors.textOnPrimary} />
                        <Text style={styles.lockedCopyBtnText}>Unlock Code</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              );
            })()}
          </View>
        </View>
      </Modal>

      {/* Standalone VIP Subscription Plans Modal */}
      <Modal
        visible={showVipModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVipModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalSubtitle}>MEMBERSHIP UPGRADE</Text>
                <Text style={styles.modalTitle}>VIP Elite Channel Pass 👑</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowVipModal(false)}
                style={styles.closeBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              {/* VIP Benefits */}
              <View style={styles.vipBenefitsBox}>
                <Text style={styles.vipBenefitsTitle}>EXCLUSIVE VIP PERKS</Text>
                <View style={styles.vipBenefitRow}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.secondary} />
                  <Text style={styles.vipBenefitText}>
                    Access all high-odds banker tickets & booking codes
                  </Text>
                </View>
                <View style={styles.vipBenefitRow}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.secondary} />
                  <Text style={styles.vipBenefitText}>
                    Direct Betika, SportyBet, and 1xBet one-click booking codes
                  </Text>
                </View>
                <View style={styles.vipBenefitRow}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.secondary} />
                  <Text style={styles.vipBenefitText}>
                    90%+ Win Rate statistical analysis and form guide
                  </Text>
                </View>
                <View style={styles.vipBenefitRow}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.secondary} />
                  <Text style={styles.vipBenefitText}>
                    Automatic slip refund/replacement guarantee
                  </Text>
                </View>
              </View>

              {/* Plans Selection */}
              <Text style={[styles.vipPlansSectionTitle, { marginTop: 14 }]}>
                SELECT SUBSCRIPTION TIER
              </Text>
              <View style={styles.vipPlansGrid}>
                {VIP_PLANS.filter((p) => p.id !== 'single').map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  return (
                    <TouchableOpacity
                      key={plan.id}
                      style={[styles.vipPlanCard, isSelected && styles.vipPlanCardSelected]}
                      onPress={() => setSelectedPlanId(plan.id)}
                      activeOpacity={0.8}
                    >
                      {plan.badge && (
                        <View style={styles.vipPlanBadge}>
                          <Text style={styles.vipPlanBadgeText}>{plan.badge}</Text>
                        </View>
                      )}
                      <View style={styles.vipPlanHeaderRow}>
                        <Text style={[styles.vipPlanName, isSelected && styles.vipPlanNameSelected]}>
                          {plan.name}
                        </Text>
                        <Text style={[styles.vipPlanPrice, isSelected && styles.vipPlanPriceSelected]}>
                          {plan.price}
                        </Text>
                      </View>
                      <Text style={styles.vipPlanDuration}>{plan.duration}</Text>
                      <Text style={styles.vipPlanDesc}>{plan.description}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.vipUnlockBtn, { marginTop: 14 }]}
              activeOpacity={0.85}
              onPress={() =>
                handleSubscribeGeneral(selectedPlanId === 'monthly' ? 'monthly' : 'weekly')
              }
            >
              <Ionicons name="sparkles" size={18} color={colors.textOnPrimary} />
              <Text style={styles.vipUnlockBtnText}>
                Activate {selectedPlanId === 'monthly' ? 'Monthly Pass' : 'Weekly Pass'} (
                {VIP_PLANS.find((p) => p.id === selectedPlanId)?.price})
              </Text>
            </TouchableOpacity>
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
  /* VIP Promo Banner */
  vipPromoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  vipPromoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 10,
  },
  vipPromoCrown: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.badgeGoldBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.badgeGoldBorder,
  },
  vipPromoTextCol: {
    flex: 1,
  },
  vipPromoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  vipPromoTitle: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  vipPromoTag: {
    backgroundColor: colors.badgeGreenBg,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.badgeGreenBorder,
  },
  vipPromoTagText: {
    color: colors.secondary,
    fontSize: 9,
    fontWeight: '800',
  },
  vipPromoSub: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
  },
  vipPromoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 2,
  },
  vipPromoBtnText: {
    color: colors.textOnPrimary,
    fontSize: 11,
    fontWeight: '800',
  },
  vipActiveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.badgeGreenBg,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.badgeGreenBorder,
    gap: 8,
  },
  vipActiveBannerText: {
    color: colors.secondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },

  /* Card Feed Footer Pills & Buttons */
  bookmakerCodePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardInner,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 8,
  },
  bookmakerCodePillUnlocked: {
    borderColor: colors.badgeGreenBorder,
    backgroundColor: colors.badgeGreenBg,
  },

  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  codeProtectedText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  codeVipProtectedText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  codeUnlockedText: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  viewSlipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  vipViewSlipBtn: {
    backgroundColor: colors.gold,
  },
  viewSlipText: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: '800',
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '88%',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  modalHeaderTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalSubtitle: {
    color: colors.secondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  vipExclusivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.badgeGoldBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.badgeGoldBorder,
    gap: 3,
  },
  vipExclusiveText: {
    color: colors.gold,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.6,
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
    backgroundColor: colors.cardInner,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
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
    height: 22,
    backgroundColor: colors.cardBorder,
  },
  modalSummaryLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  modalSummaryOdds: {
    color: colors.secondary,
    fontSize: 17,
    fontWeight: '900',
  },
  modalSummaryValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  modalMatchesList: {
    maxHeight: 310,
    marginBottom: 14,
  },
  matchesSectionTitle: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  matchItemCard: {
    backgroundColor: colors.cardInner,
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

  /* Locked Match States */
  lockedPickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  lockedPickBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.badgeGoldBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.badgeGoldBorder,
  },
  lockedPickText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  lockedOddsBadge: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  lockedOddsText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },

  /* VIP Gate In-Modal Card */
  vipGateCard: {
    backgroundColor: colors.cardInner,
    borderRadius: 14,
    padding: 14,
    marginTop: 6,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: colors.gold,
  },
  vipGateHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  vipGateIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.badgeGoldBg,
    borderWidth: 1,
    borderColor: colors.badgeGoldBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vipGateHeaderTextCol: {
    flex: 1,
  },
  vipGateTitle: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  vipGateSubtitle: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  vipPlansSectionTitle: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  vipPlansGrid: {
    gap: 8,
    marginBottom: 12,
  },
  vipPlanCard: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  vipPlanCardSelected: {
    borderColor: colors.gold,
    backgroundColor: '#0E4930',
  },
  vipPlanBadge: {
    position: 'absolute',
    top: -8,
    right: 10,
    backgroundColor: colors.gold,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vipPlanBadgeText: {
    color: colors.textOnPrimary,
    fontSize: 8,
    fontWeight: '900',
  },
  vipPlanHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  vipPlanName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  vipPlanNameSelected: {
    color: colors.gold,
  },
  vipPlanPrice: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '900',
  },
  vipPlanPriceSelected: {
    color: colors.gold,
  },
  vipPlanDuration: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  vipPlanDesc: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
  },
  vipUnlockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  vipUnlockBtnText: {
    color: colors.textOnPrimary,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  /* Booking Code Section */
  bookingCodeSection: {
    flexDirection: 'row',
    backgroundColor: colors.cardInner,
    borderRadius: 14,
    padding: 12,
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
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginTop: 2,
  },
  codeValueLocked: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    gap: 6,
  },
  copyBtnSuccess: {
    backgroundColor: colors.secondary,
  },
  copyBtnText: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  lockedCopyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    gap: 6,
  },
  lockedCopyBtnText: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: '800',
  },

  /* Standalone VIP Modal Perks Box */
  vipBenefitsBox: {
    backgroundColor: colors.cardInner,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 10,
  },
  vipBenefitsTitle: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  vipBenefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vipBenefitText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    lineHeight: 16,
  },
});
