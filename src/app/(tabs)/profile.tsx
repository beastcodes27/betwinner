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
import { useAppUI } from '@/context/UIContext';
import BookmakerLogo from '@/components/BookmakerLogo';
import TipsterAvatar from '@/components/TipsterAvatar';
import AvatarUploadModal from '@/components/AvatarUploadModal';
import { TIPSTER_AVATARS } from '@/data/mockSlips';
import {
  MOCK_PURCHASED_SLIPS,
  MOCK_PAYMENTS,
  FAQS,
  PurchasedSlip,
} from '@/data/mockUserData';

type ActiveModal =
  | null
  | 'purchasedSlips'
  | 'paymentHistory'
  | 'helpSupport'
  | 'terms'
  | 'privacy'
  | 'deleteAccount'
  | 'logout';

type SlipStatusFilter = 'all' | 'active' | 'won' | 'lost';

export default function ProfileScreen() {
  const { showToast, showPopup } = useAppUI();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [selectedSlip, setSelectedSlip] = useState<PurchasedSlip | null>(null);
  const [slipFilter, setSlipFilter] = useState<SlipStatusFilter>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-1');
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [isAccountDeleted, setIsAccountDeleted] = useState(false);
  const [profileAvatar, setProfileAvatar] = useState<any>(TIPSTER_AVATARS.alex_user);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const handleCopyCode = (code: string) => {
    setCopiedCode(code);
    showToast({
      type: 'success',
      title: 'Booking Code Copied!',
      message: `${code} copied to clipboard. Load directly into your betting app!`,
    });
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  const filteredPurchasedSlips = MOCK_PURCHASED_SLIPS.filter((slip) => {
    if (slipFilter === 'all') return true;
    return slip.status === slipFilter;
  });

  const totalSpent = MOCK_PAYMENTS.filter((p) => p.amount < 0).reduce(
    (acc, curr) => acc + Math.abs(curr.amount),
    0
  );
  const totalDeposited = MOCK_PAYMENTS.filter((p) => p.amount > 0).reduce(
    (acc, curr) => acc + curr.amount,
    0
  );
  const walletBalance = totalDeposited - totalSpent;

  const handleConfirmLogout = () => {
    setActiveModal(null);
    setIsLoggedOut(true);
    showToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been successfully logged out of your session.',
    });
  };

  const handleConfirmDelete = () => {
    setActiveModal(null);
    setIsAccountDeleted(true);
    showToast({
      type: 'warning',
      title: 'Account Deleted',
      message: 'Your account and all associated data have been permanently erased.',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>ACCOUNT & SETTINGS</Text>
          <Text style={styles.headerTitle}>User Profile</Text>
        </View>
        <View style={styles.vipPill}>
          <Ionicons name="star" size={13} color={colors.gold} />
          <Text style={styles.vipPillText}>VIP ACTIVE</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.userCard}>
          <TouchableOpacity
            style={styles.avatarTouchable}
            activeOpacity={0.8}
            onPress={() => setShowAvatarModal(true)}
          >
            <TipsterAvatar
              name={isAccountDeleted ? 'Account Deleted' : 'Alex Bettor'}
              source={profileAvatar}
              size={64}
              borderWidth={2}
              borderColor={colors.gold}
            />
            <View style={styles.cameraIconBadge}>
              <Ionicons name="camera" size={13} color={colors.textOnPrimary} />
            </View>
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>
                {isAccountDeleted ? 'Account Deleted' : 'Alex Bettor'}
              </Text>
              <Ionicons name="checkmark-circle" size={16} color={colors.secondary} />
            </View>
            <Text style={styles.userEmail}>
              {isAccountDeleted ? 'No active account' : '+255 712 *** 890 • alex.bettor@gmail.com'}
            </Text>
            <View style={styles.walletBox}>
              <View style={styles.walletLeft}>
                <Ionicons name="wallet-outline" size={15} color={colors.secondary} />
                <Text style={styles.walletLabel}>Wallet Balance:</Text>
              </View>
              <Text style={styles.walletAmount}>
                Tshs {isAccountDeleted ? '0' : walletBalance.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Stats Summary */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{isAccountDeleted ? '0' : MOCK_PURCHASED_SLIPS.length}</Text>
            <Text style={styles.statLabel}>Purchased Slips</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.secondary }]}>
              {isAccountDeleted ? '0' : MOCK_PURCHASED_SLIPS.filter((s) => s.status === 'active').length}
            </Text>
            <Text style={styles.statLabel}>Active Slips</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.gold }]}>
              {isAccountDeleted ? '0' : MOCK_PURCHASED_SLIPS.filter((s) => s.status === 'won').length}
            </Text>
            <Text style={styles.statLabel}>Won Slips</Text>
          </View>
        </View>

        {/* Section 1: Slips & Financial Activity */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>MY BETTING & PURCHASES</Text>

          {/* 1. My Betslips (Purchased Slips) */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => setActiveModal('purchasedSlips')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: colors.badgeGreenBg }]}>
              <Ionicons name="receipt-outline" size={20} color={colors.secondary} />
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>My Betslips (Purchased Slips)</Text>
              <Text style={styles.menuSubtitle}>View unlocked slips, odds, and booking codes</Text>
            </View>
            <View style={styles.badgePill}>
              <Text style={styles.badgePillText}>{MOCK_PURCHASED_SLIPS.length} Slips</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          {/* 2. Payments History */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => setActiveModal('paymentHistory')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: colors.badgeGoldBg }]}>
              <Ionicons name="card-outline" size={20} color={colors.gold} />
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Payments History</Text>
              <Text style={styles.menuSubtitle}>M-Pesa receipts, wallet deposits & slip purchases</Text>
            </View>
            <View style={styles.badgePillGold}>
              <Text style={styles.badgePillGoldText}>Tshs {totalSpent.toLocaleString()} Spent</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Section 2: Support & Legal */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>SUPPORT & LEGAL</Text>

          {/* Help & Support */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => setActiveModal('helpSupport')}
          >
            <View style={styles.menuIconContainer}>
              <Ionicons name="headset-outline" size={20} color={colors.secondary} />
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Help & Support</Text>
              <Text style={styles.menuSubtitle}>WhatsApp support, phone helpline & FAQs</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Terms of Use */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => setActiveModal('terms')}
          >
            <View style={styles.menuIconContainer}>
              <Ionicons name="document-text-outline" size={20} color={colors.textSecondary} />
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Terms of Use</Text>
              <Text style={styles.menuSubtitle}>Betting guidelines, age restrictions & policies</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Privacy Policy */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => setActiveModal('privacy')}
          >
            <View style={styles.menuIconContainer}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.textSecondary} />
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Privacy Policy</Text>
              <Text style={styles.menuSubtitle}>Payment encryption, cookies & data security</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Section 3: Account Actions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>ACCOUNT ACTIONS</Text>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutBtn}
            activeOpacity={0.8}
            onPress={() => setActiveModal('logout')}
          >
            <Ionicons name="log-out-outline" size={19} color={colors.text} />
            <Text style={styles.logoutBtnText}>
              {isLoggedOut ? 'Log In to BetWinner' : 'Log Out'}
            </Text>
          </TouchableOpacity>

          {/* Delete Account Button */}
          <TouchableOpacity
            style={styles.deleteAccountBtn}
            activeOpacity={0.8}
            onPress={() => setActiveModal('deleteAccount')}
          >
            <Ionicons name="trash-outline" size={19} color={colors.danger} />
            <Text style={styles.deleteAccountBtnText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Disclaimer */}
        <View style={styles.footerInfo}>
          <View style={styles.ageBadge}>
            <Text style={styles.ageBadgeText}>18+</Text>
          </View>
          <Text style={styles.footerDisclaimer}>
            Gambling can be addictive. Play responsibly. All tipster slips are for
            informational purposes.
          </Text>
          <Text style={styles.versionText}>BetWinner v1.0.4 • Solid Prompt Blue & AI Green Edition</Text>
        </View>
      </ScrollView>

      {/* ========================================================================= */}
      {/* 1. MODAL: MY BETSLIPS (PURCHASED SLIPS) */}
      {/* ========================================================================= */}
      <Modal
        visible={activeModal === 'purchasedSlips'}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setActiveModal(null);
          setSelectedSlip(null);
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalCategory}>PURCHASED CONTENT</Text>
              <Text style={styles.modalTitle}>My Purchased Slips</Text>
            </View>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => {
                setActiveModal(null);
                setSelectedSlip(null);
              }}
            >
              <Ionicons name="close" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Status Filters */}
          <View style={styles.modalFilterRow}>
            {(['all', 'active', 'won', 'lost'] as SlipStatusFilter[]).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.statusFilterPill,
                  slipFilter === tab && styles.statusFilterPillActive,
                ]}
                onPress={() => setSlipFilter(tab)}
              >
                <Text
                  style={[
                    styles.statusFilterText,
                    slipFilter === tab && styles.statusFilterTextActive,
                  ]}
                >
                  {tab === 'all'
                    ? `All (${MOCK_PURCHASED_SLIPS.length})`
                    : tab === 'active'
                    ? `Active (${MOCK_PURCHASED_SLIPS.filter((s) => s.status === 'active').length})`
                    : tab === 'won'
                    ? `Won (${MOCK_PURCHASED_SLIPS.filter((s) => s.status === 'won').length})`
                    : `Settled (${MOCK_PURCHASED_SLIPS.filter((s) => s.status === 'lost').length})`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>
            {filteredPurchasedSlips.map((slip) => (
              <View key={slip.id} style={styles.purchasedCard}>
                {/* Header info */}
                <View style={styles.purchasedCardHeader}>
                  <View style={styles.purchasedTipsterRow}>
                    <TipsterAvatar
                      name={slip.tipsterName}
                      source={slip.tipsterAvatarUrl}
                      avatarBg={slip.tipsterAvatarBg}
                      size="sm"
                      style={{ marginRight: 10 }}
                    />
                    <View>
                      <Text style={styles.purchasedTipsterName}>{slip.tipsterName}</Text>
                      <Text style={styles.purchasedTipsterHandle}>{slip.tipsterHandle}</Text>
                    </View>
                  </View>

                  {/* Status Badge */}
                  <View
                    style={[
                      styles.slipStatusBadge,
                      slip.status === 'active'
                        ? styles.slipStatusActive
                        : slip.status === 'won'
                        ? styles.slipStatusWon
                        : styles.slipStatusLost,
                    ]}
                  >
                    <Ionicons
                      name={
                        slip.status === 'active'
                          ? 'time-outline'
                          : slip.status === 'won'
                          ? 'trophy'
                          : 'close-circle'
                      }
                      size={12}
                      color={
                        slip.status === 'active'
                          ? colors.secondary
                          : slip.status === 'won'
                          ? colors.gold
                          : colors.danger
                      }
                    />
                    <Text
                      style={[
                        styles.slipStatusText,
                        slip.status === 'active'
                          ? { color: colors.secondary }
                          : slip.status === 'won'
                          ? { color: colors.gold }
                          : { color: colors.danger },
                      ]}
                    >
                      {slip.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Slip Title */}
                <Text style={styles.purchasedSlipTitle}>{slip.title}</Text>

                {/* Metrics Box */}
                <View style={styles.purchasedMetricsBox}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>TOTAL ODDS</Text>
                    <Text style={styles.metricOdds}>{slip.totalOdds.toFixed(2)}</Text>
                  </View>
                  <View style={styles.metricDivider} />
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>MATCHES</Text>
                    <Text style={styles.metricValue}>{slip.matchesCount} Games</Text>
                  </View>
                  <View style={styles.metricDivider} />
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>PAID</Text>
                    <Text style={[styles.metricValue, { color: colors.gold }]}>
                      {slip.amountPaid}
                    </Text>
                  </View>
                </View>

                {/* Bookmaker & Booking Code Pill */}
                <View style={styles.codeRowSection}>
                  <BookmakerLogo name={slip.bookmaker} source={slip.bookmakerLogo} size="sm" />
                  <TouchableOpacity
                    style={[
                      styles.codePill,
                      copiedCode === slip.bookingCode && styles.codePillCopied,
                    ]}
                    onPress={() => handleCopyCode(slip.bookingCode)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.codePillLabel}>CODE:</Text>
                    <Text style={styles.codePillValue}>{slip.bookingCode}</Text>
                    <Ionicons
                      name={copiedCode === slip.bookingCode ? 'checkmark-circle' : 'copy-outline'}
                      size={15}
                      color={copiedCode === slip.bookingCode ? colors.secondary : colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>

                {/* Purchase Date & Details Button */}
                <View style={styles.purchasedCardFooter}>
                  <View style={styles.purchaseDateRow}>
                    <Ionicons name="calendar-outline" size={13} color={colors.textMuted} />
                    <Text style={styles.purchaseDateText}>Purchased: {slip.purchaseDate}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.viewSelectionsBtn}
                    onPress={() => setSelectedSlip(selectedSlip?.id === slip.id ? null : slip)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.viewSelectionsText}>
                      {selectedSlip?.id === slip.id ? 'Hide Games' : 'View Selections'}
                    </Text>
                    <Ionicons
                      name={selectedSlip?.id === slip.id ? 'chevron-up' : 'chevron-down'}
                      size={14}
                      color={colors.textOnPrimary}
                    />
                  </TouchableOpacity>
                </View>

                {/* Expanded Selections */}
                {selectedSlip?.id === slip.id && (
                  <View style={styles.expandedSelections}>
                    <Text style={styles.expandedTitle}>MATCH SELECTIONS ({slip.selections.length})</Text>
                    {slip.selections.map((match, idx) => (
                      <View key={match.id} style={styles.matchItemRow}>
                        <View style={styles.matchIndexBox}>
                          <Text style={styles.matchIndexText}>{idx + 1}</Text>
                        </View>
                        <View style={styles.matchDetails}>
                          <Text style={styles.matchTeams}>{match.match}</Text>
                          <Text style={styles.matchLeague}>
                            {match.league} • {match.kickoff}
                          </Text>
                          <View style={styles.pickBadgeRow}>
                            <Text style={styles.pickText}>Tip: {match.pick}</Text>
                          </View>
                        </View>
                        <View style={styles.matchOddsBadge}>
                          <Text style={styles.matchOddsValue}>{match.odds.toFixed(2)}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ========================================================================= */}
      {/* 2. MODAL: PAYMENTS HISTORY */}
      {/* ========================================================================= */}
      <Modal
        visible={activeModal === 'paymentHistory'}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveModal(null)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalCategory}>TRANSACTION STATEMENT</Text>
              <Text style={styles.modalTitle}>Payments History</Text>
            </View>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setActiveModal(null)}>
              <Ionicons name="close" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Financial Summary */}
          <View style={styles.financialSummary}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>TOTAL DEPOSITS</Text>
              <Text style={[styles.summaryAmount, { color: colors.secondary }]}>
                Tshs {totalDeposited.toLocaleString()}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>SLIPS PURCHASED</Text>
              <Text style={[styles.summaryAmount, { color: colors.gold }]}>
                Tshs {totalSpent.toLocaleString()}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>BALANCE</Text>
              <Text style={styles.summaryAmount}>
                Tshs {walletBalance.toLocaleString()}
              </Text>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.transactionListHeader}>ALL TRANSACTIONS ({MOCK_PAYMENTS.length})</Text>

            {MOCK_PAYMENTS.map((payment) => (
              <View key={payment.id} style={styles.transactionCard}>
                <View style={styles.transactionTopRow}>
                  <View style={styles.txIconBox}>
                    <Ionicons
                      name={payment.type === 'deposit' ? 'arrow-down-circle' : 'receipt-outline'}
                      size={20}
                      color={payment.type === 'deposit' ? colors.secondary : colors.gold}
                    />
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={styles.txDescription}>{payment.description}</Text>
                    <View style={styles.txMetaRow}>
                      <Text style={styles.txRef}>{payment.reference}</Text>
                      <Text style={styles.txDot}>•</Text>
                      <Text style={styles.txMethod}>{payment.method}</Text>
                    </View>
                  </View>
                  <View style={styles.txAmountCol}>
                    <Text
                      style={[
                        styles.txAmount,
                        payment.amount > 0 ? styles.txAmountPositive : styles.txAmountNegative,
                      ]}
                    >
                      {payment.amount > 0 ? `+Tshs ${payment.amount.toLocaleString()}` : `-Tshs ${Math.abs(payment.amount).toLocaleString()}`}
                    </Text>
                    <View style={styles.txStatusBadge}>
                      <Text style={styles.txStatusText}>{payment.status.toUpperCase()}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.txDateFooter}>
                  <Ionicons name="time-outline" size={12} color={colors.textMuted} />
                  <Text style={styles.txDateText}>{payment.date}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ========================================================================= */}
      {/* 3. MODAL: HELP & SUPPORT */}
      {/* ========================================================================= */}
      <Modal
        visible={activeModal === 'helpSupport'}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveModal(null)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalCategory}>ASSISTANCE 24/7</Text>
              <Text style={styles.modalTitle}>Help & Support</Text>
            </View>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setActiveModal(null)}>
              <Ionicons name="close" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>
            {/* Quick Contact Buttons */}
            <Text style={styles.supportSectionTitle}>DIRECT SUPPORT CHANNELS</Text>
            <View style={styles.contactGrid}>
              <TouchableOpacity
                style={styles.contactCard}
                activeOpacity={0.8}
                onPress={() =>
                  showPopup({
                    title: 'WhatsApp Support',
                    message:
                      'Connect directly with our 24/7 dedicated support team on WhatsApp (+255 700 123 456).',
                    type: 'success',
                    icon: 'logo-whatsapp',
                    primaryText: 'Open WhatsApp',
                    secondaryText: 'Close',
                    onConfirm: () => {
                      showToast({
                        type: 'success',
                        title: 'Connecting...',
                        message: 'Opening WhatsApp chat with customer support',
                      });
                    },
                  })
                }
              >
                <View style={[styles.contactIconCircle, { backgroundColor: '#128C7E' }]}>
                  <Ionicons name="logo-whatsapp" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.contactCardTitle}>WhatsApp</Text>
                <Text style={styles.contactCardSubtitle}>Instant 24/7 Chat</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.contactCard}
                activeOpacity={0.8}
                onPress={() =>
                  showPopup({
                    title: 'Email Support',
                    message:
                      'Send an inquiry to support@betwinner.app. Our support team typically responds within 15 minutes.',
                    type: 'info',
                    icon: 'mail',
                    primaryText: 'Compose Email',
                    secondaryText: 'Close',
                    onConfirm: () => {
                      showToast({
                        type: 'info',
                        title: 'Email Drafted',
                        message: 'Opening mail client for support@betwinner.app',
                      });
                    },
                  })
                }
              >
                <View style={[styles.contactIconCircle, { backgroundColor: '#1E40AF' }]}>
                  <Ionicons name="mail" size={22} color="#FFFFFF" />
                </View>
                <Text style={styles.contactCardTitle}>Email</Text>
                <Text style={styles.contactCardSubtitle}>support@betwinner.app</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.contactCard}
                activeOpacity={0.8}
                onPress={() =>
                  showPopup({
                    title: 'Toll-Free Helpline',
                    message:
                      'Call our customer care hotline at 0800 720 000. Free of charge across all regional mobile networks.',
                    type: 'info',
                    icon: 'call',
                    primaryText: 'Call Now',
                    secondaryText: 'Cancel',
                    onConfirm: () => {
                      showToast({
                        type: 'info',
                        title: 'Dialing Hotline...',
                        message: 'Calling toll-free helpline: 0800 720 000',
                      });
                    },
                  })
                }
              >
                <View style={[styles.contactIconCircle, { backgroundColor: '#374151' }]}>
                  <Ionicons name="call" size={22} color={colors.secondary} />
                </View>
                <Text style={styles.contactCardTitle}>Call Center</Text>
                <Text style={styles.contactCardSubtitle}>Toll Free: 0800 720</Text>
              </TouchableOpacity>
            </View>

            {/* FAQs */}
            <Text style={[styles.supportSectionTitle, { marginTop: 24 }]}>
              FREQUENTLY ASKED QUESTIONS
            </Text>
            {FAQS.map((faq) => {
              const isExpanded = expandedFaq === faq.id;
              return (
                <TouchableOpacity
                  key={faq.id}
                  style={styles.faqCard}
                  activeOpacity={0.8}
                  onPress={() => setExpandedFaq(isExpanded ? null : faq.id)}
                >
                  <View style={styles.faqHeader}>
                    <View style={styles.faqTag}>
                      <Text style={styles.faqTagText}>{faq.category.toUpperCase()}</Text>
                    </View>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={colors.textSecondary}
                    />
                  </View>
                  {isExpanded && (
                    <View style={styles.faqBody}>
                      <Text style={styles.faqAnswer}>{faq.answer}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ========================================================================= */}
      {/* 4. MODAL: TERMS OF USE */}
      {/* ========================================================================= */}
      <Modal
        visible={activeModal === 'terms'}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveModal(null)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalCategory}>LEGAL AGREEMENT</Text>
              <Text style={styles.modalTitle}>Terms of Use</Text>
            </View>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setActiveModal(null)}>
              <Ionicons name="close" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.legalBox}>
              <Text style={styles.legalHeading}>1. 18+ Age Restriction & Responsible Gambling</Text>
              <Text style={styles.legalText}>
                You must be at least 18 years of age or the legal age of majority in your
                jurisdiction to access and use BetWinner. Betting involves substantial financial
                risk and may be addictive. BetWinner promotes responsible gambling and encourages
                all users to set wagering limits.
              </Text>

              <Text style={styles.legalHeading}>2. Information & Tips Disclaimer</Text>
              <Text style={styles.legalText}>
                BetWinner is an independent sports analytics, slip-sharing marketplace, and tipster
                community platform. Predictions, odds, and slips published by tipsters are based
                on statistical research and opinions. We do not guarantee winnings or specific outcomes.
                BetWinner is not a bookmaker and does not accept direct gambling stakes.
              </Text>

              <Text style={styles.legalHeading}>3. In-App Purchases & Slip Unlocking</Text>
              <Text style={styles.legalText}>
                Purchases of tipster slips and VIP passes are digital content access fees. Once a
                slip or booking code has been viewed or unlocked, all transactions are deemed final.
                Refund requests are reviewed solely in cases of system technical errors where the
                booking code failed to load.
              </Text>

              <Text style={styles.legalHeading}>4. Tipster Guidelines & Code of Conduct</Text>
              <Text style={styles.legalText}>
                Tipsters must provide truthful statistical track records. Misrepresenting win rates
                or forging booking codes leads to immediate banishment from the marketplace.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ========================================================================= */}
      {/* 5. MODAL: PRIVACY POLICY */}
      {/* ========================================================================= */}
      <Modal
        visible={activeModal === 'privacy'}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveModal(null)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalCategory}>DATA & SECURITY</Text>
              <Text style={styles.modalTitle}>Privacy Policy</Text>
            </View>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setActiveModal(null)}>
              <Ionicons name="close" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.legalBox}>
              <Text style={styles.legalHeading}>1. Information We Collect</Text>
              <Text style={styles.legalText}>
                We collect your phone number for M-Pesa transaction validation, your selected email
                address for account recovery, and slip interaction data to personalize your betting
                recommendations.
              </Text>

              <Text style={styles.legalHeading}>2. Payment Processing & M-Pesa Security</Text>
              <Text style={styles.legalText}>
                All financial transactions are conducted through licensed, PCI-DSS compliant
                payment aggregators. BetWinner never stores your M-Pesa PIN, credit card CVV, or
                banking credentials on our servers.
              </Text>

              <Text style={styles.legalHeading}>3. Push Notifications & Preferences</Text>
              <Text style={styles.legalText}>
                We use device tokens solely to notify you when tipsters you follow post new slips, or
                when an active slip you purchased settles. You may disable alerts at any time in
                your system settings.
              </Text>

              <Text style={styles.legalHeading}>4. Account Deletion & Right to Erasure</Text>
              <Text style={styles.legalText}>
                You retain complete ownership of your personal data. When you trigger the &quot;Delete
                Account&quot; function, all profile identifiers, following records, and transaction logs
                are permanently scrubbed from our active databases.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ========================================================================= */}
      {/* 6. MODAL: DELETE ACCOUNT CONFIRMATION */}
      {/* ========================================================================= */}
      <Modal
        visible={activeModal === 'deleteAccount'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.alertBackdrop}>
          <View style={styles.deleteModalBox}>
            <View style={styles.deleteIconCircle}>
              <Ionicons name="warning" size={32} color={colors.danger} />
            </View>
            <Text style={styles.deleteModalTitle}>Delete Account?</Text>
            <Text style={styles.deleteModalText}>
              This action is permanent and cannot be undone. All your purchased slips (
              {MOCK_PURCHASED_SLIPS.length}), wallet balance (Tshs {walletBalance.toLocaleString()}), and followed
              tipsters will be permanently erased.
            </Text>

            <View style={styles.deleteActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                activeOpacity={0.8}
                onPress={() => setActiveModal(null)}
              >
                <Text style={styles.cancelBtnText}>Keep Account</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDeleteBtn}
                activeOpacity={0.8}
                onPress={handleConfirmDelete}
              >
                <Text style={styles.confirmDeleteBtnText}>Yes, Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* 7. MODAL: LOGOUT CONFIRMATION */}
      {/* ========================================================================= */}
      <Modal
        visible={activeModal === 'logout'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.alertBackdrop}>
          <View style={styles.logoutModalBox}>
            <View style={[styles.deleteIconCircle, { backgroundColor: colors.badgeGreenBg }]}>
              <Ionicons name="log-out" size={28} color={colors.secondary} />
            </View>
            <Text style={styles.deleteModalTitle}>Log Out?</Text>
            <Text style={styles.deleteModalText}>
              Are you sure you want to log out of BetWinner? You will need to log in again to view
              your purchased slips and receive live notifications.
            </Text>

            <View style={styles.deleteActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                activeOpacity={0.8}
                onPress={() => setActiveModal(null)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmLogoutBtn}
                activeOpacity={0.8}
                onPress={handleConfirmLogout}
              >
                <Text style={styles.confirmLogoutBtnText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Avatar Upload Modal */}
      <AvatarUploadModal
        visible={showAvatarModal}
        currentAvatar={profileAvatar}
        userName={isAccountDeleted ? 'Account Deleted' : 'Alex Bettor'}
        onClose={() => setShowAvatarModal(false)}
        onSaveAvatar={(newAvatar) => setProfileAvatar(newAvatar)}
      />
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
    backgroundColor: colors.background,
  },
  headerSubtitle: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  vipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.badgeGoldBg,
    borderWidth: 1,
    borderColor: colors.badgeGoldBorder,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 5,
  },
  vipPillText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  userCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  avatarTouchable: {
    position: 'relative',
    marginRight: 14,
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.cardInner,
    borderWidth: 2,
    borderColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: colors.secondary,
    fontSize: 20,
    fontWeight: '900',
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  userEmail: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  walletBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardInner,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  walletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  walletLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  walletAmount: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  statValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  menuIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.cardInner,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuInfo: {
    flex: 1,
  },
  menuTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  menuSubtitle: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  badgePill: {
    backgroundColor: colors.badgeGreenBg,
    borderWidth: 1,
    borderColor: colors.badgeGreenBorder,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8,
  },
  badgePillText: {
    color: colors.secondary,
    fontSize: 11,
    fontWeight: '800',
  },
  badgePillGold: {
    backgroundColor: colors.badgeGoldBg,
    borderWidth: 1,
    borderColor: colors.badgeGoldBorder,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8,
  },
  badgePillGoldText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '800',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 8,
  },
  logoutBtnText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  deleteAccountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dangerBg,
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.danger,
    gap: 8,
  },
  deleteAccountBtnText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '800',
  },
  footerInfo: {
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
    gap: 6,
  },
  ageBadge: {
    backgroundColor: colors.cardInner,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ageBadgeText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '900',
  },
  footerDisclaimer: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  versionText: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 4,
  },

  /* Modals */
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  modalCategory: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.cardInner,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  modalFilterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  statusFilterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  statusFilterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusFilterText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  statusFilterTextActive: {
    color: colors.textOnPrimary,
    fontWeight: '900',
  },
  modalScroll: {
    padding: 16,
    paddingBottom: 40,
  },

  /* Purchased Slips Cards */
  purchasedCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  purchasedCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  purchasedTipsterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  purchasedAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchasedAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  purchasedTipsterName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  purchasedTipsterHandle: {
    color: colors.textMuted,
    fontSize: 11,
  },
  slipStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  slipStatusActive: {
    backgroundColor: colors.badgeGreenBg,
    borderColor: colors.badgeGreenBorder,
  },
  slipStatusWon: {
    backgroundColor: colors.badgeGoldBg,
    borderColor: colors.badgeGoldBorder,
  },
  slipStatusLost: {
    backgroundColor: colors.dangerBg,
    borderColor: colors.danger,
  },
  slipStatusText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  purchasedSlipTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
  },
  purchasedMetricsBox: {
    flexDirection: 'row',
    backgroundColor: colors.cardInner,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 12,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  metricOdds: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },
  metricValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    backgroundColor: colors.cardBorder,
  },
  codeRowSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },

  codePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardInner,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  codePillCopied: {
    backgroundColor: colors.badgeGreenBg,
    borderColor: colors.secondary,
  },
  codePillLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
  },
  codePillValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
  purchasedCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingTop: 10,
  },
  purchaseDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  purchaseDateText: {
    color: colors.textMuted,
    fontSize: 11,
  },
  viewSelectionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  viewSelectionsText: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  expandedSelections: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  expandedTitle: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  matchItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardInner,
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  matchIndexBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  matchIndexText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '800',
  },
  matchDetails: {
    flex: 1,
  },
  matchTeams: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  matchLeague: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 1,
  },
  pickBadgeRow: {
    marginTop: 3,
  },
  pickText: {
    color: colors.secondary,
    fontSize: 11,
    fontWeight: '700',
  },
  matchOddsBadge: {
    backgroundColor: colors.badgeGreenBg,
    borderWidth: 1,
    borderColor: colors.badgeGreenBorder,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  matchOddsValue: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '900',
  },

  /* Payments History */
  financialSummary: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    margin: 16,
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  summaryBox: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  summaryAmount: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 3,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.cardBorder,
  },
  transactionListHeader: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  transactionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  transactionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.cardInner,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  txInfo: {
    flex: 1,
  },
  txDescription: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  txMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  txRef: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  txDot: {
    color: colors.textMuted,
    fontSize: 10,
  },
  txMethod: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: '700',
  },
  txAmountCol: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '900',
  },
  txAmountPositive: {
    color: colors.secondary,
  },
  txAmountNegative: {
    color: colors.gold,
  },
  txStatusBadge: {
    backgroundColor: colors.badgeGreenBg,
    borderWidth: 1,
    borderColor: colors.badgeGreenBorder,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 3,
  },
  txStatusText: {
    color: colors.secondary,
    fontSize: 8,
    fontWeight: '900',
  },
  txDateFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  txDateText: {
    color: colors.textMuted,
    fontSize: 10,
  },

  /* Support & Contacts */
  supportSectionTitle: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  contactGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  contactCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  contactIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  contactCardTitle: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  contactCardSubtitle: {
    color: colors.textMuted,
    fontSize: 9,
    textAlign: 'center',
    marginTop: 2,
  },
  faqCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  faqTag: {
    backgroundColor: colors.badgeGreenBg,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.badgeGreenBorder,
  },
  faqTagText: {
    color: colors.secondary,
    fontSize: 8,
    fontWeight: '900',
  },
  faqQuestion: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  faqBody: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  faqAnswer: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },

  /* Legal */
  legalBox: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  legalHeading: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 14,
    marginBottom: 6,
  },
  legalText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },

  /* Alert / Confirmation Modals */
  alertBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  deleteModalBox: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.danger,
  },
  logoutModalBox: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  deleteIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.dangerBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  deleteModalTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  deleteModalText: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  deleteActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: colors.cardInner,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  cancelBtnText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  confirmDeleteBtn: {
    flex: 1,
    backgroundColor: colors.danger,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmDeleteBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  confirmLogoutBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmLogoutBtnText: {
    color: colors.textOnPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
});
