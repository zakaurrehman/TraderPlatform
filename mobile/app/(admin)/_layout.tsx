import { Stack } from 'expo-router'
import { colors } from '@/theme'

export default function AdminLayout() {
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
      <Stack.Screen name="index" options={{ title: 'Admin Dashboard' }} />
      <Stack.Screen name="users" options={{ title: 'Users' }} />
      <Stack.Screen name="signals" options={{ title: 'Signals' }} />
      <Stack.Screen name="research" options={{ title: 'Research' }} />
      <Stack.Screen name="courses" options={{ title: 'Courses' }} />
      <Stack.Screen name="sessions" options={{ title: 'Live Sessions' }} />
      <Stack.Screen name="calendar" options={{ title: 'Economic Calendar' }} />
      <Stack.Screen name="brokers" options={{ title: 'Brokers' }} />
      <Stack.Screen name="resources" options={{ title: 'Resources' }} />
      <Stack.Screen name="reviews" options={{ title: 'Reviews' }} />
      <Stack.Screen name="sales" options={{ title: 'Sales' }} />
      <Stack.Screen name="affiliates" options={{ title: 'Affiliates' }} />
      <Stack.Screen name="withdrawals" options={{ title: 'Withdrawals' }} />
      <Stack.Screen name="payments" options={{ title: 'Payments' }} />
    </Stack>
  )
}
