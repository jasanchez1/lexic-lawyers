export interface DashboardStats {
    profileViews: number;
    previousProfileViews?: number;
    newQuestions: number;
    totalAnswers: number;
    rating: number;
    responseRate: number;
    avgResponseTime: number;
    profileImpressions: number;
    contactRequests: number;
  }
  
  export interface ChartDataPoint {
    date: string;
    value: number;
  }
  
  export interface ProfileViewStats {
    clickThroughRate: number;
    averageViewTime: number;
    contactRate: number;
  }
  
  export interface ResponseStats {
    responseTime: number;
    responseRate: number;
    industryAvgResponseTime: number;
  }
  
  export interface ExperienceStats {
    casesWon: number;
    totalCases: number;
    yearsExperience: number;
    specializedAreas: number;
  }
  
  export interface ProfileImpression {
    timestamp: string;
    lawyerId: string;
    userId?: string;
    searchQuery?: string;
    areaSlug?: string;
    citySlug?: string;
    position?: number;
  }
  
  export interface ProfileClick {
    timestamp: string;
    lawyerId: string;
    userId?: string;
    searchQuery?: string;
    areaSlug?: string;
    citySlug?: string;
    position?: number;
  }
  
  export interface ProfileView {
    timestamp: string;
    lawyerId: string;
    userId?: string;
    source?: string;
  }
  
  export interface MessageEvent {
    timestamp: string;
    lawyerId: string;
    userId?: string;
    status: string;
  }
  
  export interface ProfilePositionStats {
    position: number;
    impressions: number;
    clicks: number;
    clickThroughRate: number;
  }
  
  // Chart data types
  export interface LineChartData {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension?: number;
    }[];
  }
  
  export interface PieChartData {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
    }[];
  }
  
  export interface BarChartData {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  }
  
  export interface ActivitySummary {
    activities: Activity[];
    questions: QuestionSummary[];
  }
  
  export interface Activity {
    type: 'message' | 'view' | 'review' | 'question' | 'answer' | 'contact' | 'system';
    description: string;
    timestamp: string;
    actionUrl?: string;
  }
  
  export interface QuestionSummary {
    id: string;
    title: string;
    date: string;
    location?: string;
  }