import { Tabs } from 'expo-router';
import { Heart, MessageCircle, User } from 'lucide-react-native';

import BpmLogo from '@/assets/logo/bpm-logo.svg';
import { LIKES_TAB_BADGE, TAB_LABELS } from '@/features/feed/constants';
import { COLORS } from '@/utils/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: COLORS.surface },
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.strokeDefault,
        },
        tabBarActiveTintColor: COLORS.fill,
        tabBarInactiveTintColor: COLORS.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: TAB_LABELS.HOME,
          tabBarIcon: ({ color, size }) => (
            <BpmLogo width={size * 0.95} height={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="likes"
        options={{
          title: TAB_LABELS.LIKES,
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
          tabBarBadge: LIKES_TAB_BADGE,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.primary,
            color: COLORS.fillOpposite,
            fontSize: 10,
            fontWeight: '700',
          },
        }}
      />
      <Tabs.Screen
        name="matchs"
        options={{
          title: TAB_LABELS.MATCHES,
          tabBarIcon: ({ color, size }) => (
            <MessageCircle color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: TAB_LABELS.PROFILE,
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
