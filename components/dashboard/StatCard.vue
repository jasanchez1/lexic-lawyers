<template>
    <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-medium text-gray-500">{{ title }}</h3>
            <div class="p-2 rounded-md" :class="iconBgClass">
                <component :is="iconComponent" class="w-5 h-5" :class="iconColorClass" />
            </div>
        </div>

        <div class="flex items-end">
            <div v-if="isRating" class="flex items-center">
                <span class="text-2xl font-bold mr-2">{{ value }}</span>
                <div class="flex">
                    <Star v-for="i in 5" :key="i" class="w-4 h-4" :class="[
                        i <= Math.floor(value) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'
                    ]" />
                </div>
            </div>
            <div v-else class="text-2xl font-bold">{{ formattedValue }}</div>

            <div v-if="trend && percentage" class="ml-2 flex items-center text-sm" :class="trendColorClass">
                <component :is="trend === 'up' ? 'TrendingUp' : 'TrendingDown'" class="w-4 h-4 mr-1" />
                <span>{{ percentage }}%</span>
            </div>
        </div>

        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import {
    Eye, HelpCircle, MessageCircle, Star, TrendingUp, TrendingDown,
    User, Users, Phone,
    Activity, BarChart, Briefcase, FileText, Mail,
    Calendar, Check, DollarSign, Clock, AlertCircle
} from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    value: {
        type: [Number, String],
        required: true
    },
    icon: {
        type: String,
        default: 'Activity'
    },
    trend: {
        type: String,
        validator: (value: string) => ['up', 'down', null, undefined].includes(value)
    },
    percentage: {
        type: Number,
        default: null
    },
    isRating: {
        type: Boolean,
        default: false
    }
})

// Format value (add thousands separators)
const formattedValue = computed(() => {
    if (typeof props.value === 'number') {
        return props.value.toLocaleString()
    }
    return props.value
})

// Determine icon component
const iconComponent = computed(() => {
    const icons: Record<string, any> = {
        Eye,
        HelpCircle,
        MessageCircle,
        Star,
        User,
        Users,
        Phone,
        Activity,
        BarChart,
        Briefcase,
        FileText,
        Mail,
        Calendar,
        Check,
        DollarSign,
        Clock,
        AlertCircle
    }

    return icons[props.icon] || Activity
})

// Icon background color
const iconBgClass = computed(() => {
    const colors: Record<string, string> = {
        Eye: 'bg-blue-50',
        HelpCircle: 'bg-purple-50',
        MessageCircle: 'bg-green-50',
        Star: 'bg-yellow-50',
        User: 'bg-indigo-50',
        Users: 'bg-pink-50',
        Phone: 'bg-teal-50',
        Activity: 'bg-red-50',
        BarChart: 'bg-blue-50',
        Briefcase: 'bg-gray-50',
        FileText: 'bg-indigo-50',
        Mail: 'bg-purple-50',
        Calendar: 'bg-green-50',
        Check: 'bg-emerald-50',
        DollarSign: 'bg-yellow-50',
        Clock: 'bg-orange-50',
        AlertCircle: 'bg-red-50'
    }

    return colors[props.icon] || 'bg-gray-50'
})

// Icon color
const iconColorClass = computed(() => {
    const colors: Record<string, string> = {
        Eye: 'text-blue-500',
        HelpCircle: 'text-purple-500',
        MessageCircle: 'text-green-500',
        Star: 'text-yellow-500',
        User: 'text-indigo-500',
        Users: 'text-pink-500',
        Phone: 'text-teal-500',
        Activity: 'text-red-500',
        BarChart: 'text-blue-500',
        Briefcase: 'text-gray-700',
        FileText: 'text-indigo-500',
        Mail: 'text-purple-500',
        Calendar: 'text-green-500',
        Check: 'text-emerald-500',
        DollarSign: 'text-yellow-500',
        Clock: 'text-orange-500',
        AlertCircle: 'text-red-500'
    }

    return colors[props.icon] || 'text-gray-500'
})

// Trend color
const trendColorClass = computed(() => {
    return props.trend === 'up' ? 'text-green-500' : 'text-red-500'
})
</script>