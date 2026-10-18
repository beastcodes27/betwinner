import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { HOME_ADS, ALL_TIPSTERS, FollowedTipster } from '@/data/mockSlips';
import { useAppUI } from '@/context/UIContext';

type TipsterFilterChip = 'all' | 'high_win' | 'top_rated' | 'vip';

export default function HomeScreen() {
  const { showToast, showPopup } = useAppUI();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChip, setSelectedChip] = useState<TipsterFilterChip>('all');
  const [tipsters, setTipsters] = useState<FollowedTipster[]>(ALL_TIPSTERS);
  const [addedSlips, setAddedSlips] = useState<string[]>([]);

  // Top Game Voting Poll State
  type VoteOption = '1' | 'X' | '2';
  const [userVote, setUserVote] = useState<VoteOption | null>(null);
  const [voteCounts, setVoteCounts] = useState<{ [key in VoteOption]: number }>({
    '1': 8420,
    'X': 2140,
    '2': 3860,
  });

  const handleVote = (option: VoteOption) => {
    setVoteCounts((prev) => {
      const updated = { ...prev };
      if (userVote && userVote !== option) {
        updated[userVote] = Math.max(0, updated[userVote] - 1);
      }
      if (userVote !== option) {
        updated[option] = updated[option] + 1;
      }
      return updated;
    });
    setUserVote(option);
    showToast({
      type: 'success',
      title: 'Prediction Vote Recorded! 🗳️',
      message: `You voted for ${option === '1' ? 'Arsenal (1)' : option === 'X' ? 'Draw (X)' : 'Chelsea (2)'}. View live percentages above!`,
    });
  };

  const totalVotes = voteCounts['1'] + voteCounts['X'] + voteCounts['2'];
  const pct1 = Math.round((voteCounts['1'] / totalVotes) * 100);
  const pctX = Math.round((voteCounts['X'] / totalVotes) * 100);
  const pct2 = 100 - pct1 - pctX;

  // Auto-scrolling Ads Board Setup (3-second interval)
  const { width: windowWidth } = useWindowDimensions();
  // Available carousel slide width: windowWidth minus screen horizontal padding (16*2) minus card padding (16*2)
  const [bannerWidth, setBannerWidth] = useState(windowWidth > 64 ? windowWidth - 64 : 320);
  const adScrollRef = useRef<ScrollView>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoScroll = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (HOME_ADS.length <= 1 || bannerWidth <= 0) return;

    timerRef.current = setInterval(() => {
      setCurrentAdIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % HOME_ADS.length;
        adScrollRef.current?.scrollTo({
          x: nextIndex * bannerWidth,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);
  }, [bannerWidth]);

  useEffect(() => {
    startAutoScroll();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startAutoScroll]);

  const handleNextAd = () => {
    const nextIndex = (currentAdIndex + 1) % HOME_ADS.length;
    setCurrentAdIndex(nextIndex);
    adScrollRef.current?.scrollTo({
      x: nextIndex * bannerWidth,
      animated: true,
    });
    startAutoScroll();
  };

  const handlePrevAd = () => {
    const prevIndex = (currentAdIndex - 1 + HOME_ADS.length) % HOME_ADS.length;
    setCurrentAdIndex(prevIndex);
    adScrollRef.current?.scrollTo({
      x: prevIndex * bannerWidth,
      animated: true,
    });
    startAutoScroll();
  };

  const handleGoToAd = (idx: number) => {
    setCurrentAdIndex(idx);
    adScrollRef.current?.scrollTo({
      x: idx * bannerWidth,
      animated: true,
    });
    startAutoScroll();
  };

  const handleScrollBeginDrag = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (bannerWidth <= 0) return;
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / bannerWidth);
    if (newIndex >= 0 && newIndex < HOME_ADS.length) {
      setCurrentAdIndex(newIndex);
    }
    startAutoScroll();
  };

  const handleContainerLayout = (e: LayoutChangeEvent) => {
    const measured = e.nativeEvent.layout.width;
    if (measured > 0 && Math.abs(measured - bannerWidth) > 1) {
      setBannerWidth(measured);
    }
  };

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
          ? 'You will now receive instant alerts when they post new slips.'
          : 'You will no longer receive notifications for this tipster.',
      });
    }
  };

  const handleToggleAddToSlip = (id: string) => {
    const willAdd = !addedSlips.includes(id);
    if (addedSlips.includes(id)) {
      setAddedSlips((prev) => prev.filter((item) => item !== id));
    } else {
      setAddedSlips((prev) => [...prev, id]);
    }
    showToast({
      type: willAdd ? 'success' : 'info',
      title: willAdd ? 'Added to Betslip' : 'Removed from Betslip',
      message: willAdd
        ? 'Selection added to your active betslip. Go to Betslip tab to stake.'
        : 'Selection removed from your betslip.',
    });
  };

  // Filtered tipsters based on search query and chip filter
  const filteredTipsters = tipsters.filter((tipster) => {
    const matchesQuery =
      searchQuery.trim() === '' ||
      tipster.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tipster.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tipster.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tipster.badge.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesQuery) return false;

    if (selectedChip === 'high_win') {
      const rate = parseInt(tipster.winRate.replace(/\D/g, ''), 10);
      return rate >= 85;
    }
    if (selectedChip === 'top_rated') {
      return tipster.verified;
    }
    if (selectedChip === 'vip') {
      return tipster.badge.includes('VIP') || tipster.badge.includes('TOP');
    }
    return true;
  });

  const isSearching = searchQuery.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>KENYA&apos;S #1 TIPSTER NETWORK</Text>
          <Text style={styles.headerTitle}>BETWINNER</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationBtn}
          activeOpacity={0.7}
          onPress={() =>
            showPopup({
              type: 'info',
              icon: 'notifications',
              title: 'Tipster Activity Alerts',
              message:
                'You have 3 new winning bet slips published today by Captain Odds and Sniper Bets. Check your Following tab to view details.',
              primaryText: 'Got It',
            })
          }
        >
          <Ionicons name="notifications-outline" size={22} color={colors.text} />
          <View style={styles.badgeDot} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ========================================================================= */}
        {/* 1. TOP ADVERTISING BOARD */}
        {/* ========================================================================= */}
        <View style={styles.adBoardCard}>
          {/* Ad Card Header */}
          <View style={styles.adTopBar}>
            <View style={styles.sponsoredBadge}>
              <Ionicons name="megaphone" size={12} color={colors.gold} />
              <Text style={styles.sponsoredBadgeText}>SPONSORED PROMO</Text>
            </View>

            {/* Slide Indicators & Controls */}
            <View style={styles.adControlsRow}>
              <TouchableOpacity
                onPress={handlePrevAd}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="chevron-back" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
              <View style={styles.dotsRow}>
                {HOME_ADS.map((ad, idx) => (
                  <TouchableOpacity
                    key={ad.id}
                    onPress={() => handleGoToAd(idx)}
                    style={[
                      styles.dot,
                      currentAdIndex === idx ? styles.dotActive : styles.dotInactive,
                    ]}
                  />
                ))}
              </View>
              <TouchableOpacity
                onPress={handleNextAd}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Horizontal Auto-scrolling Carousel Container */}
          <View style={styles.carouselContainer} onLayout={handleContainerLayout}>
            <ScrollView
              ref={adScrollRef}
              horizontal
              pagingEnabled
              snapToInterval={bannerWidth}
              snapToAlignment="start"
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled={true}
              scrollEventThrottle={16}
              onScrollBeginDrag={handleScrollBeginDrag}
              onMomentumScrollEnd={handleMomentumScrollEnd}
            >
              {HOME_ADS.map((ad) => (
                <View key={ad.id} style={{ width: bannerWidth }}>
                  {/* Ad Body */}
                  <View style={styles.adContent}>
                    <View style={styles.adCategoryPill}>
                      <Text style={styles.adCategoryText}>{ad.badge}</Text>
                    </View>
                    <Text style={styles.adTitle}>{ad.title}</Text>
                    <Text style={styles.adSubtitle}>{ad.subtitle}</Text>

                    {/* Ad Highlight Box */}
                    <View style={styles.adHighlightBox}>
                      <Ionicons name="sparkles" size={14} color={colors.secondary} />
                      <Text style={styles.adHighlightText}>{ad.highlight}</Text>
                    </View>
                  </View>

                  {/* Ad Footer & CTA */}
                  <View style={styles.adFooter}>
                    {ad.promoCode && (
                      <View style={styles.promoCodeBox}>
                        <Text style={styles.promoCodeLabel}>CODE:</Text>
                        <Text style={styles.promoCodeValue}>{ad.promoCode}</Text>
                      </View>
                    )}
                    <TouchableOpacity
                      style={styles.adCtaBtn}
                      activeOpacity={0.8}
                      onPress={() =>
                        showPopup({
                          type: 'success',
                          icon: 'sparkles',
                          title: ad.title,
                          message: `${ad.subtitle}\n\nPromo code ${ad.promoCode || 'AUTOMATIC'} has been credited to your BetWinner wallet!`,
                          primaryText: 'Claim Bonus',
                          secondaryText: 'Close',
                          onConfirm: () => {
                            showToast({
                              type: 'success',
                              title: 'Promo Claimed Successfully!',
                              message: `${ad.badge} bonus active on your next betslip purchase.`,
                            });
                          },
                        })
                      }
                    >
                      <Text style={styles.adCtaText}>{ad.ctaText}</Text>
                      <Ionicons name="arrow-forward" size={14} color={colors.textOnPrimary} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 2. TIPSTER SEARCH BAR */}
        {/* ========================================================================= */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={colors.primary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search tipsters by name, handle, or sport..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-circle" size={19} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Quick Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChipsRow}
          >
            {(
              [
                { id: 'all', label: 'All Tipsters' },
                { id: 'high_win', label: '🔥 85%+ Win Rate' },
                { id: 'top_rated', label: '✓ Verified Pros' },
                { id: 'vip', label: '👑 VIP Specialists' },
              ] as { id: TipsterFilterChip; label: string }[]
            ).map((chip) => (
              <TouchableOpacity
                key={chip.id}
                style={[
                  styles.filterChip,
                  selectedChip === chip.id && styles.filterChipActive,
                ]}
                onPress={() => setSelectedChip(chip.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedChip === chip.id && styles.filterChipTextActive,
                  ]}
                >
                  {chip.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ========================================================================= */}
        {/* 3. SEARCH RESULTS (Active Search View) */}
        {/* ========================================================================= */}
        {isSearching || selectedChip !== 'all' ? (
          <View style={styles.searchResultsContainer}>
            <View style={styles.resultsHeaderRow}>
              <Text style={styles.resultsHeaderTitle}>
                {filteredTipsters.length}{' '}
                {filteredTipsters.length === 1 ? 'Tipster Found' : 'Tipsters Found'}
              </Text>
              {(isSearching || selectedChip !== 'all') && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery('');
                    setSelectedChip('all');
                  }}
                >
                  <Text style={styles.clearSearchText}>Reset</Text>
                </TouchableOpacity>
              )}
            </View>

            {filteredTipsters.length === 0 ? (
              <View style={styles.emptySearchBox}>
                <Ionicons name="search-outline" size={44} color={colors.textMuted} />
                <Text style={styles.emptySearchTitle}>No Tipsters Found</Text>
                <Text style={styles.emptySearchSub}>
                  No tipsters match &quot;{searchQuery}&quot;. Try searching for &quot;Captain&quot;, &quot;Sniper&quot;, or &quot;VIP&quot;.
                </Text>
              </View>
            ) : (
              filteredTipsters.map((tipster) => (
                <View key={tipster.id} style={styles.tipsterResultCard}>
                  <View style={styles.tipsterCardTop}>
                    <View style={styles.tipsterProfileGroup}>
                      <View style={[styles.tipsterAvatar, { backgroundColor: tipster.avatarBg }]}>
                        <Text style={styles.tipsterAvatarText}>{tipster.name.substring(0, 1)}</Text>
                      </View>
                      <View>
                        <View style={styles.tipsterNameRow}>
                          <Text style={styles.tipsterName}>{tipster.name}</Text>
                          {tipster.verified && (
                            <Ionicons name="checkmark-circle" size={15} color={colors.secondary} />
                          )}
                        </View>
                        <Text style={styles.tipsterHandle}>{tipster.handle}</Text>
                      </View>
                    </View>

                    {/* Follow Action */}
                    <TouchableOpacity
                      style={[
                        styles.tipsterFollowBtn,
                        tipster.isFollowing && styles.tipsterFollowBtnActive,
                      ]}
                      onPress={() => handleToggleFollow(tipster.id)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={tipster.isFollowing ? 'checkmark' : 'add'}
                        size={14}
                        color={tipster.isFollowing ? colors.secondary : colors.textOnPrimary}
                      />
                      <Text
                        style={[
                          styles.tipsterFollowText,
                          tipster.isFollowing && styles.tipsterFollowTextActive,
                        ]}
                      >
                        {tipster.isFollowing ? 'Following' : 'Follow'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Metrics Badges */}
                  <View style={styles.tipsterMetricsRow}>
                    <View style={styles.winRateBadge}>
                      <Ionicons name="trending-up" size={12} color={colors.secondary} />
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
                </View>
              ))
            )}
          </View>
        ) : (
          /* ========================================================================= */
          /* 4. DEFAULT HOME CONTENT (When not actively searching) */
          /* ========================================================================= */
          <>
            {/* Top Recommended Tipsters Horizontal Preview */}
            <View style={styles.topTipstersSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Top Rated Tipsters</Text>
                <Text style={styles.tipstersCountText}>{ALL_TIPSTERS.length} Verified</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.topTipstersScroll}
              >
                {ALL_TIPSTERS.slice(0, 5).map((tipster) => (
                  <TouchableOpacity
                    key={tipster.id}
                    style={styles.tipsterMiniCard}
                    activeOpacity={0.8}
                    onPress={() => setSearchQuery(tipster.name)}
                  >
                    <View style={[styles.tipsterMiniAvatar, { backgroundColor: tipster.avatarBg }]}>
                      <Text style={styles.tipsterMiniAvatarText}>
                        {tipster.name.substring(0, 1)}
                      </Text>
                    </View>
                    <Text style={styles.tipsterMiniName} numberOfLines={1}>
                      {tipster.name}
                    </Text>
                    <View style={styles.miniWinRatePill}>
                      <Text style={styles.miniWinRateText}>{tipster.winRate.split(' ')[0]}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Highlight Banner: Banker of the Day */}
            <View style={styles.bannerCard}>
              <View style={styles.bannerInfo}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>TODAY&apos;S HIGHLIGHT</Text>
                </View>
                <Text style={styles.bannerTitle}>Banker of the Day</Text>
                <Text style={styles.bannerOdds}>Odds: 1.85 • 88% Confidence</Text>
              </View>
              <Ionicons name="shield-checkmark" size={44} color={colors.secondary} />
            </View>

            {/* Featured Tips Section - One Big Game Only */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Tips</Text>
              <View style={styles.marqueeBadge}>
                <Ionicons name="trophy" size={12} color={colors.gold} />
                <Text style={styles.marqueeBadgeText}>BIG GAME OF THE DAY</Text>
              </View>
            </View>

            {/* TOP GAME OF THE DAY WITH INTERACTIVE COMMUNITY VOTING POLL */}
            <View style={styles.topGameCard}>
              {/* Header Badge & Live Poll Tag */}
              <View style={styles.topGameHeader}>
                <View style={styles.topGameBadge}>
                  <Ionicons name="flame" size={13} color={colors.gold} />
                  <Text style={styles.topGameBadgeText}>TOP GAME OF THE DAY</Text>
                </View>
                <View style={styles.topGameLiveTag}>
                  <View style={styles.livePulseDot} />
                  <Text style={styles.topGameLiveText}>LIVE POLL</Text>
                </View>
              </View>

              {/* League & Time */}
              <Text style={styles.topGameLeague}>UEFA CHAMPIONS LEAGUE • TONIGHT 22:00</Text>

              {/* Teams Matchup Showcase */}
              <View style={styles.topGameVersusContainer}>
                <View style={styles.topGameTeam}>
                  <View style={[styles.teamEmblem, { backgroundColor: '#B91C1C' }]}>
                    <Text style={styles.teamEmblemText}>ARS</Text>
                  </View>
                  <Text style={styles.topGameTeamName}>Arsenal</Text>
                  <Text style={styles.topGameForm}>Form: W-W-W-D</Text>
                </View>

                <View style={styles.vsCenterBox}>
                  <View style={styles.vsCircle}>
                    <Text style={styles.vsText}>VS</Text>
                  </View>
                  <Text style={styles.topGameVenue}>Emirates Stadium</Text>
                </View>

                <View style={styles.topGameTeam}>
                  <View style={[styles.teamEmblem, { backgroundColor: '#1D4ED8' }]}>
                    <Text style={styles.teamEmblemText}>CHE</Text>
                  </View>
                  <Text style={styles.topGameTeamName}>Chelsea</Text>
                  <Text style={styles.topGameForm}>Form: W-W-D-W</Text>
                </View>
              </View>

              {/* Tipster Consensus Box */}
              <View style={styles.consensusBox}>
                <Ionicons name="stats-chart" size={13} color={colors.secondary} />
                <Text style={styles.consensusText}>
                  Tipster Consensus: <Text style={styles.consensusBold}>74% Predict Arsenal Win (1)</Text>
                </Text>
              </View>

              {/* Interactive Voting Poll */}
              <View style={styles.pollSection}>
                <View style={styles.pollTitleRow}>
                  <Text style={styles.pollQuestion}>COMMUNITY VOTE: WHO WINS?</Text>
                  <Text style={styles.pollTotalVotes}>{totalVotes.toLocaleString()} votes</Text>
                </View>

                <View style={styles.pollButtonsRow}>
                  {/* Option 1: Home Win */}
                  <TouchableOpacity
                    style={[
                      styles.pollBtn,
                      userVote === '1' && styles.pollBtnSelected,
                    ]}
                    onPress={() => handleVote('1')}
                    activeOpacity={0.8}
                  >
                    <View style={styles.pollBtnTop}>
                      <Text style={[styles.pollChoice, userVote === '1' && styles.pollChoiceSelected]}>
                        1 • Arsenal
                      </Text>
                      {userVote === '1' && (
                        <Ionicons name="checkmark-circle" size={13} color={colors.primary} />
                      )}
                    </View>
                    <View style={styles.pollOddsRow}>
                      <Text style={styles.pollOddsText}>1.95</Text>
                      <Text style={[styles.pollPctText, userVote === '1' && styles.pollPctSelected]}>
                        {pct1}%
                      </Text>
                    </View>
                    <View style={styles.pollTrack}>
                      <View
                        style={[
                          styles.pollFill,
                          {
                            width: `${pct1}%`,
                            backgroundColor: userVote === '1' ? colors.primary : colors.secondary,
                          },
                        ]}
                      />
                    </View>
                  </TouchableOpacity>

                  {/* Option X: Draw */}
                  <TouchableOpacity
                    style={[
                      styles.pollBtn,
                      userVote === 'X' && styles.pollBtnSelected,
                    ]}
                    onPress={() => handleVote('X')}
                    activeOpacity={0.8}
                  >
                    <View style={styles.pollBtnTop}>
                      <Text style={[styles.pollChoice, userVote === 'X' && styles.pollChoiceSelected]}>
                        X • Draw
                      </Text>
                      {userVote === 'X' && (
                        <Ionicons name="checkmark-circle" size={13} color={colors.primary} />
                      )}
                    </View>
                    <View style={styles.pollOddsRow}>
                      <Text style={styles.pollOddsText}>3.40</Text>
                      <Text style={[styles.pollPctText, userVote === 'X' && styles.pollPctSelected]}>
                        {pctX}%
                      </Text>
                    </View>
                    <View style={styles.pollTrack}>
                      <View
                        style={[
                          styles.pollFill,
                          {
                            width: `${pctX}%`,
                            backgroundColor: userVote === 'X' ? colors.primary : colors.cardBorder,
                          },
                        ]}
                      />
                    </View>
                  </TouchableOpacity>

                  {/* Option 2: Away Win */}
                  <TouchableOpacity
                    style={[
                      styles.pollBtn,
                      userVote === '2' && styles.pollBtnSelected,
                    ]}
                    onPress={() => handleVote('2')}
                    activeOpacity={0.8}
                  >
                    <View style={styles.pollBtnTop}>
                      <Text style={[styles.pollChoice, userVote === '2' && styles.pollChoiceSelected]}>
                        2 • Chelsea
                      </Text>
                      {userVote === '2' && (
                        <Ionicons name="checkmark-circle" size={13} color={colors.primary} />
                      )}
                    </View>
                    <View style={styles.pollOddsRow}>
                      <Text style={styles.pollOddsText}>3.80</Text>
                      <Text style={[styles.pollPctText, userVote === '2' && styles.pollPctSelected]}>
                        {pct2}%
                      </Text>
                    </View>
                    <View style={styles.pollTrack}>
                      <View
                        style={[
                          styles.pollFill,
                          {
                            width: `${pct2}%`,
                            backgroundColor: userVote === '2' ? colors.primary : colors.secondary,
                          },
                        ]}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Vote Feedback & Add to Slip */}
              <View style={styles.topGameFooter}>
                <View style={styles.topGameVoteStatus}>
                  {userVote ? (
                    <Text style={styles.votedStatusText}>
                      ✓ Your Vote:{' '}
                      <Text style={styles.votedBold}>
                        {userVote === '1' ? 'Arsenal' : userVote === 'X' ? 'Draw' : 'Chelsea'}
                      </Text>
                    </Text>
                  ) : (
                    <Text style={styles.votePromptText}>Vote your pick to join community pool</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    styles.addToSlipBtn,
                    addedSlips.includes('top-game') && styles.addToSlipBtnAdded,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => handleToggleAddToSlip('top-game')}
                >
                  <Ionicons
                    name={addedSlips.includes('top-game') ? 'checkmark-circle' : 'add-circle-outline'}
                    size={17}
                    color={addedSlips.includes('top-game') ? colors.secondary : colors.textOnPrimary}
                  />
                  <Text
                    style={[
                      styles.addToSlipText,
                      addedSlips.includes('top-game') && styles.addToSlipTextAdded,
                    ]}
                  >
                    {addedSlips.includes('top-game') ? 'Added' : 'Add to slip'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    backgroundColor: colors.background,
  },
  headerSub: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginTop: 2,
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
    paddingBottom: 115,
  },

  /* 1. AD BOARD STYLES */
  adBoardCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  adTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sponsoredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.badgeGoldBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.badgeGoldBorder,
    gap: 4,
  },
  sponsoredBadgeText: {
    color: colors.gold,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  carouselContainer: {
    width: '100%',
  },
  adControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 16,
    backgroundColor: colors.primary,
  },
  dotInactive: {
    width: 6,
    backgroundColor: colors.cardBorder,
  },
  adContent: {
    marginBottom: 12,
  },
  adCategoryPill: {
    backgroundColor: colors.badgeGreenBg,
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.badgeGreenBorder,
    marginBottom: 6,
  },
  adCategoryText: {
    color: colors.secondary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  adTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
    minHeight: 22,
  },
  adSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8,
    minHeight: 34,
  },
  adHighlightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardInner,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 6,
  },
  adHighlightText: {
    color: colors.secondary,
    fontSize: 11,
    fontWeight: '700',
  },
  adFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingTop: 10,
  },
  promoCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  promoCodeLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  promoCodeValue: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  adCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  adCtaText: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: '800',
  },

  /* 2. SEARCH BAR STYLES */
  searchSection: {
    marginBottom: 18,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    padding: 0,
  },
  filterChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  filterChip: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  filterChipTextActive: {
    color: colors.textOnPrimary,
    fontWeight: '900',
  },

  /* 3. SEARCH RESULTS STYLES */
  searchResultsContainer: {
    marginBottom: 20,
  },
  resultsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  resultsHeaderTitle: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  clearSearchText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  emptySearchBox: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginTop: 8,
  },
  emptySearchTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 10,
  },
  emptySearchSub: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  tipsterResultCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  tipsterCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipsterProfileGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tipsterAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipsterAvatarText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  tipsterNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tipsterName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  tipsterHandle: {
    color: colors.textMuted,
    fontSize: 11,
  },
  tipsterFollowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  tipsterFollowBtnActive: {
    backgroundColor: colors.cardInner,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  tipsterFollowText: {
    color: colors.textOnPrimary,
    fontSize: 11,
    fontWeight: '800',
  },
  tipsterFollowTextActive: {
    color: colors.secondary,
    fontWeight: '700',
  },
  tipsterMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  winRateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.badgeGreenBg,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.badgeGreenBorder,
  },
  winRateText: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: '800',
  },
  streakBadge: {
    backgroundColor: colors.badgeGoldBg,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.badgeGoldBorder,
  },
  streakText: {
    color: colors.gold,
    fontSize: 10,
    fontWeight: '800',
  },
  slipsBadge: {
    backgroundColor: colors.cardInner,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  slipsBadgeText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  specialtyText: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  specialtyLabel: {
    color: colors.textMuted,
    fontWeight: '700',
  },

  /* 4. DEFAULT CONTENT STYLES */
  topTipstersSection: {
    marginBottom: 18,
  },
  topTipstersScroll: {
    gap: 12,
    paddingVertical: 4,
  },
  tipstersCountText: {
    color: colors.secondary,
    fontSize: 11,
    fontWeight: '700',
  },
  tipsterMiniCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    width: 82,
  },
  tipsterMiniAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  tipsterMiniAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  tipsterMiniName: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  miniWinRatePill: {
    backgroundColor: colors.badgeGreenBg,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.badgeGreenBorder,
  },
  miniWinRateText: {
    color: colors.secondary,
    fontSize: 9,
    fontWeight: '900',
  },
  bannerCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 18,
  },
  bannerInfo: {
    flex: 1,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.badgeGreenBg,
    borderWidth: 1,
    borderColor: colors.badgeGreenBorder,
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
    fontSize: 17,
    fontWeight: '800',
  },
  bannerOdds: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  marqueeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.badgeGoldBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.badgeGoldBorder,
    gap: 4,
  },
  marqueeBadgeText: {
    color: colors.gold,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  addToSlipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  addToSlipBtnAdded: {
    backgroundColor: colors.cardInner,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  addToSlipText: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  addToSlipTextAdded: {
    color: colors.secondary,
    fontWeight: '700',
  },

  /* TOP GAME & VOTING POLL STYLES */
  topGameCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  topGameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  topGameBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.badgeGoldBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.badgeGoldBorder,
    gap: 4,
  },
  topGameBadgeText: {
    color: colors.gold,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  topGameLiveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.badgeGreenBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.badgeGreenBorder,
    gap: 5,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondary,
  },
  topGameLiveText: {
    color: colors.secondary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  topGameLeague: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  topGameVersusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardInner,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  topGameTeam: {
    flex: 1,
    alignItems: 'center',
  },
  teamEmblem: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  teamEmblemText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  topGameTeamName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  topGameForm: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600',
  },
  vsCenterBox: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  vsCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 4,
  },
  vsText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
  },
  topGameVenue: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '600',
  },
  consensusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.badgeGreenBg,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: colors.badgeGreenBorder,
    gap: 6,
    marginBottom: 14,
  },
  consensusText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  consensusBold: {
    color: colors.secondary,
    fontWeight: '800',
  },
  pollSection: {
    marginBottom: 12,
  },
  pollTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pollQuestion: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  pollTotalVotes: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: '800',
  },
  pollButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pollBtn: {
    flex: 1,
    backgroundColor: colors.cardInner,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  pollBtnSelected: {
    borderColor: colors.primary,
    backgroundColor: '#0E3624',
  },
  pollBtnTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  pollChoice: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '800',
  },
  pollChoiceSelected: {
    color: colors.primary,
  },
  pollOddsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  pollOddsText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  pollPctText: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: '900',
  },
  pollPctSelected: {
    color: colors.primary,
  },
  pollTrack: {
    height: 4,
    backgroundColor: colors.card,
    borderRadius: 2,
    overflow: 'hidden',
  },
  pollFill: {
    height: '100%',
    borderRadius: 2,
  },
  topGameFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingTop: 10,
  },
  topGameVoteStatus: {
    flex: 1,
    marginRight: 10,
  },
  votedStatusText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  votedBold: {
    color: colors.primary,
    fontWeight: '800',
  },
  votePromptText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
});
