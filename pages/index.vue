<template>
    <div>
      <h1 class="text-2xl font-bold mb-6">Dashboard</h1>
  
      <!-- Stats Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardStatCard
          title="Vistas del Perfil"
          :value="stats.profileViews"
          trend="up"
          :percentage="8.2"
          icon="Eye"
        />
        <DashboardStatCard
          title="Nuevas Preguntas"
          :value="stats.newQuestions"
          trend="down"
          :percentage="3.1"
          icon="HelpCircle"
        />
        <DashboardStatCard
          title="Respuestas"
          :value="stats.totalAnswers"
          trend="up"
          :percentage="12.5"
          icon="MessageCircle"
        />
        <DashboardStatCard
          title="Calificación"
          :value="stats.rating"
          icon="Star"
          is-rating
        />
      </div>
  
      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Activities -->
        <div class="lg:col-span-2">
          <DashboardRecentActivities :activities="recentActivities" />
        </div>
  
        <!-- Quick Actions and New Questions -->
        <div class="space-y-6">
          <DashboardQuickActions />
          <DashboardNewQuestions :questions="newQuestions" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useDashboardStats } from '~/composables/useDashboardStats'
  import { useRecentActivity } from '~/composables/useRecentActivity'
  
  definePageMeta({
    middleware: ['lawyer-auth']
  })
  
  const { stats, isLoading: statsLoading } = useDashboardStats()
  const { activities: recentActivities, questions: newQuestions } = useRecentActivity()
  </script>