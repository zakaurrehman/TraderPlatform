import React from 'react'
import { View, Text } from 'react-native'
import { useQueryClient } from '@tanstack/react-query'
import { useApi } from '@/api/hooks'
import { apiFetch } from '@/api/client'
import { Screen, Loader, ErrorState, EmptyState, Button, PlanBadge, Badge, colors, spacing } from '@/components/ui'
import { AdminRow } from '@/components/AdminRow'

type AdminUser = {
  id: string
  fullName: string
  email: string
  username: string
  role: 'USER' | 'AFFILIATE' | 'ADMIN'
  plan: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  studentId: string
}

const PLANS = ['FREE', 'BASIC', 'ADVANCED', 'MASTERY', 'PREMIUM', 'MENTORSHIP']

export default function AdminUsersScreen() {
  const qc = useQueryClient()
  const { data, isLoading, isError, refetch, isRefetching } = useApi<AdminUser[]>('/api/admin/users')
  const users = data ?? []

  async function patch(id: string, payload: Record<string, string>) {
    await apiFetch('/api/admin/users', { method: 'PATCH', body: { id, ...payload } }).catch(() => {})
    qc.invalidateQueries({ queryKey: ['/api/admin/users'] })
  }

  function nextPlan(p: string): string {
    const i = PLANS.indexOf(p)
    return PLANS[(i + 1) % PLANS.length]
  }

  if (isLoading) return <Screen><Loader /></Screen>
  if (isError) return <Screen><ErrorState message="Could not load users" onRetry={() => refetch()} /></Screen>

  return (
    <Screen scroll refreshing={isRefetching} onRefresh={refetch}>
      <View style={{ padding: spacing.lg }}>
        {users.length === 0 ? (
          <EmptyState icon="people-outline" title="No users yet." />
        ) : (
          users.map((u) => (
            <AdminRow
              key={u.id}
              title={`${u.fullName}  ·  @${u.username}`}
              subtitle={`${u.email}  ·  ${u.studentId}  ·  ${u.role}`}
              badge={
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  <PlanBadge plan={u.plan} />
                  <Badge label={u.status} color={u.status === 'APPROVED' ? colors.green : u.status === 'PENDING' ? '#f0b429' : colors.red} />
                </View>
              }
            >
              {u.status !== 'APPROVED' ? (
                <Button title="Approve" onPress={() => patch(u.id, { status: 'APPROVED' })} />
              ) : (
                <Button title="Reject" variant="danger" onPress={() => patch(u.id, { status: 'REJECTED' })} />
              )}
              <Button
                title={`Plan:${nextPlan(u.plan)}`}
                variant="outline"
                onPress={() => patch(u.id, { plan: nextPlan(u.plan) })}
              />
              <Button
                title={`Role:${u.role === 'USER' ? 'AFFILIATE' : u.role === 'AFFILIATE' ? 'ADMIN' : 'USER'}`}
                variant="outline"
                onPress={() =>
                  patch(u.id, {
                    role: u.role === 'USER' ? 'AFFILIATE' : u.role === 'AFFILIATE' ? 'ADMIN' : 'USER',
                  })
                }
              />
            </AdminRow>
          ))
        )}
        <Text style={{ color: colors.muted2, fontSize: 11, marginTop: 8 }}>
          Tap a button to call the matching admin endpoint. Cycle the plan/role buttons to step through values.
        </Text>
      </View>
    </Screen>
  )
}
