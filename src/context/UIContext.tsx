import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastOptions {
  type?: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export type PopupType = 'info' | 'success' | 'warning' | 'danger';

export interface PopupOptions {
  title: string;
  message: string;
  type?: PopupType;
  icon?: keyof typeof Ionicons.glyphMap;
  primaryText?: string;
  secondaryText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface UIContextValue {
  showToast: (options: ToastOptions) => void;
  hideToast: () => void;
  showPopup: (options: PopupOptions) => void;
  hidePopup: () => void;
}

const UIContext = createContext<UIContextValue | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();

  // Toast state
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const [toastAnim] = useState(() => new Animated.Value(0));
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Popup state
  const [popup, setPopup] = useState<PopupOptions | null>(null);

  const hideToast = useCallback(() => {
    Animated.timing(toastAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setToast(null);
    });
  }, [toastAnim]);

  const showToast = useCallback(
    ({ type = 'success', title, message, duration = 3200 }: ToastOptions) => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      setToast({ type, title, message, duration });
      Animated.spring(toastAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();

      toastTimeoutRef.current = setTimeout(() => {
        hideToast();
      }, duration);
    },
    [toastAnim, hideToast]
  );

  const showPopup = useCallback((options: PopupOptions) => {
    setPopup(options);
  }, []);

  const hidePopup = useCallback(() => {
    setPopup(null);
  }, []);

  const handleConfirmPopup = () => {
    const callback = popup?.onConfirm;
    hidePopup();
    if (callback) callback();
  };

  const handleCancelPopup = () => {
    const callback = popup?.onCancel;
    hidePopup();
    if (callback) callback();
  };

  const getToastIcon = (type: ToastType = 'success'): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'alert-circle';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'information-circle';
    }
  };

  const getToastColors = (type: ToastType = 'success') => {
    switch (type) {
      case 'success':
        return {
          iconColor: colors.secondary,
          borderColor: colors.badgeGreenBorder,
          badgeBg: colors.badgeGreenBg,
        };
      case 'error':
        return {
          iconColor: colors.danger,
          borderColor: colors.danger,
          badgeBg: colors.dangerBg,
        };
      case 'warning':
      case 'info':
      default:
        return {
          iconColor: colors.gold,
          borderColor: colors.badgeGoldBorder,
          badgeBg: colors.badgeGoldBg,
        };
    }
  };

  const getPopupIcon = (type: PopupType = 'info'): keyof typeof Ionicons.glyphMap => {
    if (popup?.icon) return popup.icon;
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'danger':
        return 'alert-circle';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'information-circle';
    }
  };

  const getPopupColors = (type: PopupType = 'info') => {
    switch (type) {
      case 'success':
        return {
          iconColor: colors.secondary,
          iconBg: colors.badgeGreenBg,
          cardBorder: colors.badgeGreenBorder,
          primaryBtnBg: colors.secondary,
          primaryBtnText: colors.primaryDark,
        };
      case 'danger':
        return {
          iconColor: colors.danger,
          iconBg: colors.dangerBg,
          cardBorder: colors.danger,
          primaryBtnBg: colors.danger,
          primaryBtnText: '#FFFFFF',
        };
      case 'warning':
        return {
          iconColor: colors.gold,
          iconBg: colors.badgeGoldBg,
          cardBorder: colors.badgeGoldBorder,
          primaryBtnBg: colors.primary,
          primaryBtnText: colors.textOnPrimary,
        };
      case 'info':
      default:
        return {
          iconColor: colors.primary,
          iconBg: colors.badgeGoldBg,
          cardBorder: colors.cardBorder,
          primaryBtnBg: colors.primary,
          primaryBtnText: colors.textOnPrimary,
        };
    }
  };

  const toastColors = getToastColors(toast?.type);
  const popupColors = getPopupColors(popup?.type);

  return (
    <UIContext.Provider value={{ showToast, hideToast, showPopup, hidePopup }}>
      {children}

      {/* ========================================================================= */}
      {/* 1. CUSTOM FLOATING TOAST NOTIFICATION */}
      {/* ========================================================================= */}
      {toast && (
        <Animated.View
          style={[
            styles.toastWrapper,
            {
              top: insets.top + (Platform.OS === 'ios' ? 8 : 14),
              opacity: toastAnim,
              transform: [
                {
                  translateY: toastAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-35, 0],
                  }),
                },
                {
                  scale: toastAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.94, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.toastCard, { borderColor: toastColors.borderColor }]}
            activeOpacity={0.9}
            onPress={hideToast}
          >
            <View style={[styles.toastIconBox, { backgroundColor: toastColors.badgeBg }]}>
              <Ionicons
                name={getToastIcon(toast.type)}
                size={22}
                color={toastColors.iconColor}
              />
            </View>
            <View style={styles.toastTextContent}>
              <Text style={styles.toastTitle}>{toast.title}</Text>
              {toast.message ? (
                <Text style={styles.toastMessage}>{toast.message}</Text>
              ) : null}
            </View>
            <TouchableOpacity
              onPress={hideToast}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.toastCloseBtn}
            >
              <Ionicons name="close" size={17} color={colors.textMuted} />
            </TouchableOpacity>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* ========================================================================= */}
      {/* 2. CUSTOM POPUP CARD / DIALOG MODAL */}
      {/* ========================================================================= */}
      <Modal
        visible={popup !== null}
        transparent
        animationType="fade"
        onRequestClose={handleCancelPopup}
      >
        <View style={styles.popupBackdrop}>
          <View style={[styles.popupCard, { borderColor: popupColors.cardBorder }]}>
            {/* Icon Header */}
            <View style={[styles.popupIconCircle, { backgroundColor: popupColors.iconBg }]}>
              <Ionicons
                name={getPopupIcon(popup?.type)}
                size={32}
                color={popupColors.iconColor}
              />
            </View>

            {/* Title & Message */}
            <Text style={styles.popupTitle}>{popup?.title}</Text>
            <Text style={styles.popupMessage}>{popup?.message}</Text>

            {/* Actions */}
            <View style={styles.popupActionsRow}>
              {popup?.secondaryText ? (
                <TouchableOpacity
                  style={styles.popupSecondaryBtn}
                  activeOpacity={0.8}
                  onPress={handleCancelPopup}
                >
                  <Text style={styles.popupSecondaryText}>{popup.secondaryText}</Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                style={[
                  styles.popupPrimaryBtn,
                  { backgroundColor: popupColors.primaryBtnBg },
                ]}
                activeOpacity={0.8}
                onPress={handleConfirmPopup}
              >
                <Text
                  style={[
                    styles.popupPrimaryText,
                    { color: popupColors.primaryBtnText },
                  ]}
                >
                  {popup?.primaryText || 'OK'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </UIContext.Provider>
  );
}

export function useAppUI(): UIContextValue {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useAppUI must be used within a UIProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  /* Toast Styles */
  toastWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 999,
  },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 10,
  },
  toastIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  toastTextContent: {
    flex: 1,
  },
  toastTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  toastMessage: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  toastCloseBtn: {
    padding: 4,
    marginLeft: 6,
  },

  /* Popup Styles */
  popupBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  popupCard: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 14,
  },
  popupIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  popupTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  popupMessage: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 22,
  },
  popupActionsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  popupSecondaryBtn: {
    flex: 1,
    backgroundColor: colors.cardInner,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  popupSecondaryText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  popupPrimaryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  popupPrimaryText: {
    fontSize: 13,
    fontWeight: '900',
  },
});
