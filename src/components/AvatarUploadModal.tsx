import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/theme';
import { TIPSTER_AVATARS } from '@/data/mockSlips';
import { useAppUI } from '@/context/UIContext';
import TipsterAvatar from './TipsterAvatar';

interface AvatarUploadModalProps {
  visible: boolean;
  currentAvatar: any;
  userName: string;
  onClose: () => void;
  onSaveAvatar: (newAvatar: any) => void;
}

const PRESET_AVATARS = [
  { id: 'juma', label: 'Pro Football Analyst', source: TIPSTER_AVATARS.juma, badge: 'ANALYSIS' },
  { id: 'kassim', label: 'Goals 2.5+ Specialist', source: TIPSTER_AVATARS.kassim, badge: 'GOALS' },
  { id: 'mwamba', label: 'Mega Accumulator', source: TIPSTER_AVATARS.mwamba, badge: 'PARLAY' },
  { id: 'vip_elite', label: 'VIP Syndicate Gold', source: TIPSTER_AVATARS.vip_elite, badge: 'VIP' },
  { id: 'tactical_pro', label: 'Tactical Draw Master', source: TIPSTER_AVATARS.tactical_pro, badge: 'TACTICS' },
  { id: 'alex_user', label: 'BetWinner Member', source: TIPSTER_AVATARS.alex_user, badge: 'MEMBER' },
];

export default function AvatarUploadModal({
  visible,
  currentAvatar,
  userName,
  onClose,
  onSaveAvatar,
}: AvatarUploadModalProps) {
  const { showToast } = useAppUI();
  const [selectedAvatar, setSelectedAvatar] = useState<any>(currentAvatar || TIPSTER_AVATARS.alex_user);

  useEffect(() => {
    if (visible) {
      setSelectedAvatar(currentAvatar || TIPSTER_AVATARS.alex_user);
    }
  }, [currentAvatar, visible]);

  const handlePickPhoto = async (sourceType: 'camera' | 'gallery') => {
    const permission =
      sourceType === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      showToast({
        type: 'warning',
        title: 'Permission Required',
        message:
          sourceType === 'camera'
            ? 'Camera access is needed to take a profile photo.'
            : 'Photo library access is needed to choose a profile photo.',
      });
      return;
    }

    const result =
      sourceType === 'camera'
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    setSelectedAvatar(result.assets[0].uri);
    showToast({
      type: 'success',
      title: sourceType === 'camera' ? 'Photo Captured' : 'Image Selected',
      message: 'Profile picture loaded into preview. Tap "Save Profile Picture" to confirm.',
    });
  };

  const handleSelectPreset = (source: any, label: string) => {
    setSelectedAvatar(source);
    showToast({
      type: 'info',
      title: 'Avatar Preset Selected',
      message: `Selected ${label}. Tap save to apply to your profile.`,
    });
  };

  const handleRemovePhoto = () => {
    setSelectedAvatar(null);
    showToast({
      type: 'warning',
      title: 'Photo Removed',
      message: 'Avatar reset to your name initials.',
    });
  };

  const handleConfirmSave = () => {
    onSaveAvatar(selectedAvatar);
    showToast({
      type: 'success',
      title: 'Profile Picture Updated!',
      message: 'Your new avatar is now active across all betslips and feeds.',
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerSub}>APPEARANCE & BRANDING</Text>
              <Text style={styles.headerTitle}>Upload Profile Picture</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {/* Active Preview */}
            <View style={styles.previewSection}>
              <View style={styles.avatarWrapper}>
                <TipsterAvatar
                  name={userName}
                  source={selectedAvatar}
                  size={100}
                  borderColor={colors.gold}
                  borderWidth={3}
                  showOnlinePulse={true}
                />
                <View style={styles.cameraPill}>
                  <Ionicons name="camera" size={14} color={colors.textOnPrimary} />
                </View>
              </View>
              <Text style={styles.previewName}>{userName}</Text>
              <Text style={styles.previewHint}>
                A clear, professional portrait increases tipster credibility and slip views.
              </Text>
            </View>

            {/* Quick Upload Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                activeOpacity={0.8}
                onPress={() => {
                  void handlePickPhoto('camera');
                }}
              >
                <View style={[styles.actionIconCircle, { backgroundColor: colors.badgeGreenBg }]}>
                  <Ionicons name="camera-outline" size={22} color={colors.secondary} />
                </View>
                <Text style={styles.actionBtnText}>Take Photo</Text>
                <Text style={styles.actionBtnSub}>Use Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                activeOpacity={0.8}
                onPress={() => {
                  void handlePickPhoto('gallery');
                }}
              >
                <View style={[styles.actionIconCircle, { backgroundColor: colors.badgeGoldBg }]}>
                  <Ionicons name="images-outline" size={22} color={colors.gold} />
                </View>
                <Text style={styles.actionBtnText}>Gallery</Text>
                <Text style={styles.actionBtnSub}>Choose File</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                activeOpacity={0.8}
                onPress={handleRemovePhoto}
              >
                <View style={[styles.actionIconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                  <Ionicons name="trash-outline" size={22} color={colors.danger} />
                </View>
                <Text style={[styles.actionBtnText, { color: colors.danger }]}>Remove</Text>
                <Text style={styles.actionBtnSub}>Use Initials</Text>
              </TouchableOpacity>
            </View>

            {/* Curated Pro Tipster Avatar Presets */}
            <View style={styles.presetSection}>
              <View style={styles.presetHeader}>
                <Text style={styles.presetTitle}>OR CHOOSE A PRO TIPSTER AVATAR</Text>
                <Text style={styles.presetCount}>{PRESET_AVATARS.length} Presets</Text>
              </View>

              <View style={styles.presetGrid}>
                {PRESET_AVATARS.map((preset) => {
                  const isSelected = selectedAvatar === preset.source;
                  return (
                    <TouchableOpacity
                      key={preset.id}
                      style={[
                        styles.presetCard,
                        isSelected && styles.presetCardSelected,
                      ]}
                      onPress={() => handleSelectPreset(preset.source, preset.label)}
                      activeOpacity={0.7}
                    >
                      <Image source={preset.source} style={styles.presetImg} />
                      <View style={styles.presetBadge}>
                        <Text style={styles.presetBadgeText}>{preset.badge}</Text>
                      </View>
                      <Text style={styles.presetLabel} numberOfLines={1}>
                        {preset.label}
                      </Text>
                      {isSelected && (
                        <View style={styles.checkCircle}>
                          <Ionicons name="checkmark" size={12} color={colors.textOnPrimary} />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Footer Save Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleConfirmSave}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-circle" size={18} color={colors.textOnPrimary} />
              <Text style={styles.saveBtnText}>Save Profile Picture</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  headerSub: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    backgroundColor: colors.cardInner,
    borderRadius: 20,
  },
  scroll: {
    padding: 20,
  },
  previewSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  cameraPill: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: colors.primary,
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
  previewName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  previewHint: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 24,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: colors.cardInner,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionBtnText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  actionBtnSub: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  presetSection: {
    marginBottom: 12,
  },
  presetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  presetTitle: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  presetCount: {
    color: colors.textMuted,
    fontSize: 11,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  presetCard: {
    width: '31%',
    backgroundColor: colors.cardInner,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    position: 'relative',
  },
  presetCardSelected: {
    borderColor: colors.secondary,
    backgroundColor: 'rgba(57, 255, 136, 0.08)',
  },
  presetImg: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginBottom: 6,
  },
  presetBadge: {
    backgroundColor: colors.badgeGreenBg,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginBottom: 4,
  },
  presetBadgeText: {
    color: colors.secondary,
    fontSize: 8,
    fontWeight: '800',
  },
  presetLabel: {
    color: colors.text,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  checkCircle: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    color: colors.textOnPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
});

