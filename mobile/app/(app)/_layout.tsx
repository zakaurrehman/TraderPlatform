import { Stack } from 'expo-router'
import { colors } from '@/theme'

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.cardAlt },
        headerTintColor: colors.gold,
        headerTitleStyle: { color: colors.white, fontWeight: '800' },
        contentStyle: { backgroundColor: colors.bg },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="research/[id]" options={{ title: 'Research' }} />
      <Stack.Screen name="community/[id]" options={{ title: 'Post' }} />
      <Stack.Screen name="community/new" options={{ title: 'New Post', presentation: 'modal' }} />
      <Stack.Screen name="classroom/[courseId]" options={{ title: 'Course' }} />
      <Stack.Screen name="signals-history" options={{ title: 'Signal History' }} />
      <Stack.Screen name="live" options={{ title: 'Live Sessions' }} />
      <Stack.Screen name="calendar" options={{ title: 'Economic Calendar' }} />
      <Stack.Screen name="brokers" options={{ title: 'Recommended Brokers' }} />
      <Stack.Screen name="resources" options={{ title: 'Resources' }} />
      <Stack.Screen name="watchlist" options={{ title: 'Market Watchlist' }} />
      <Stack.Screen name="calculator" options={{ title: 'Risk Calculator' }} />
      <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
      <Stack.Screen name="reviews" options={{ title: 'Leave a Review' }} />
      <Stack.Screen name="order" options={{ title: 'Upgrade Plan' }} />
      <Stack.Screen name="affiliate/index" options={{ title: 'Affiliate Dashboard' }} />
      <Stack.Screen name="affiliate/withdraw" options={{ title: 'Withdraw Earnings' }} />
      <Stack.Screen name="affiliate/commissions" options={{ title: 'Commissions' }} />
    </Stack>
  )
}
