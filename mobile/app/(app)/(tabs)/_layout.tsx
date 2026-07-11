import React, { useEffect, useRef } from 'react'
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native'
import { Tabs } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { colors, font, family } from '@/theme'

type TabDef = {
  name: string
  label: string
  icon?: keyof typeof Ionicons.glyphMap
  center?: boolean
}

const TABS: TabDef[] = [
  { name: 'research', label: 'Research', icon: 'documents-outline' },
  { name: 'community', label: 'Community', icon: 'people-outline' },
  { name: 'signals', label: 'LIVE', center: true },
  { name: 'classroom', label: 'Classroom', icon: 'school-outline' },
  { name: 'profile', label: 'Profile', icon: 'person-outline' },
]

function CenterFab() {
  const pulse = useRef(new Animated.Value(0)).current
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 750, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 750, useNativeDriver: true }),
      ])
    )
    loop.start()
    return () => loop.stop()
  }, [pulse])
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] })
  return (
    <Animated.View style={[styles.fab, { transform: [{ scale }] }]}>
      <Ionicons name="flash" size={26} color="#fff" />
    </Animated.View>
  )
}

function TabBar({ state, navigation }: {
  state: { index: number; routes: { key: string; name: string }[] }
  navigation: { navigate: (name: string) => void; emit: (e: { type: string; target: string; canPreventDefault: boolean }) => { defaultPrevented: boolean } }
}) {
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 6) }]}>
      {TABS.map((tab) => {
        const route = state.routes.find((r) => r.name === tab.name)
        const isActive =
          route && state.routes[state.index]?.name === tab.name
        const onPress = () => {
          if (route) {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })
            if (!event.defaultPrevented) navigation.navigate(tab.name)
          } else {
            navigation.navigate(tab.name)
          }
        }

        if (tab.center) {
          return (
            <Pressable key={tab.name} style={styles.centerWrap} onPress={onPress}>
              <CenterFab />
              <Text style={styles.centerLabel}>SIGNALS</Text>
            </Pressable>
          )
        }

        return (
          <Pressable key={tab.name} style={styles.item} onPress={onPress}>
            <Ionicons
              name={tab.icon as keyof typeof Ionicons.glyphMap}
              size={22}
              color={isActive ? colors.primary : colors.muted}
            />
            <Text style={[styles.label, { color: isActive ? colors.primary : colors.muted }]}>
              {tab.label}
            </Text>
            {isActive ? <View style={styles.dot} /> : <View style={styles.dotPlaceholder} />}
          </Pressable>
        )
      })}
    </View>
  )
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...(props as unknown as Parameters<typeof TabBar>[0])} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.ink, fontFamily: family.display },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen name="research" options={{ title: 'Research' }} />
      <Tabs.Screen name="community" options={{ title: 'Community' }} />
      <Tabs.Screen name="signals" options={{ title: 'Live Signals' }} />
      <Tabs.Screen name="classroom" options={{ title: 'Classroom' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    shadowColor: '#10131a',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },
  item: { flex: 1, alignItems: 'center', paddingVertical: 4, gap: 2 },
  label: { fontSize: font.micro, fontFamily: family.sansSemiBold },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.primary, marginTop: 1 },
  dotPlaceholder: { width: 4, height: 4, marginTop: 1 },
  centerWrap: { flex: 1, alignItems: 'center', marginTop: -22 },
  centerLabel: { color: colors.redText, fontSize: font.micro, fontWeight: '700', marginTop: 3, letterSpacing: 0.5 },
  fab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.red,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    borderWidth: 3,
    borderColor: 'rgba(220,38,38,0.25)',
  },
})
