<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>

    <!-- Loading state -->
    <div v-if="statsLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="i in 4" :key="i" class="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div class="h-8 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>

    <!-- Stats cards when data is loaded -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <DashboardStatCard
        title="Vistas del Perfil"
        :value="stats.profileViews"
        trend="up"
        :percentage="8.2"
        icon="Eye"
      />
      <DashboardStatCard
        title="Impresiones"
        :value="stats.profileImpressions"
        trend="up"
        :percentage="12.5"
        icon="Users"
      />
      <DashboardStatCard
        title="Mensajes Recibidos"
        :value="stats.messagesSent"
        trend="up"
        :percentage="15"
        icon="MessageCircle"
      />
      <DashboardStatCard
        title="Tasa de Mensajes"
        :value="stats.messageRate"
        icon="BarChart"
        is-percentage
      />
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Activities -->
      <div class="lg:col-span-2">
        <DashboardRecentActivities 
          :activities="recentActivities || []" 
          :loading="activitiesLoading" 
        />
      </div>

      <!-- Quick Actions -->
      <div class="space-y-6">
        <DashboardQuickActions />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboardStats } from '~/composables/useDashboardStats';
import { useRecentActivity } from '~/composables/useRecentActivity';

definePageMeta({
  middleware: ['lawyer-auth']
});

const { stats, isLoading: statsLoading } = useDashboardStats();
const { activities: recentActivities, isLoading: activitiesLoading } = useRecentActivity();
</script>