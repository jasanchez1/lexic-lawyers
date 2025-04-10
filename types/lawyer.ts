
  export interface PracticeArea {
    id: string;
    name: string;
    slug: string;
    experience_score?: number;
  }

  export interface Education {
    id?: string;
    institution: string;
    degree: string;
    year?: number;
    honors?: string;
  }
  
  export interface WorkExperience {
    id?: string;
    role: string;
    company: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }
  
  export interface Achievement {
    id?: string;
    title: string;
    year?: number;
    issuer?: string;
  }
  
  export interface Lawyer {
    id: string;
    name: string;
    email: string;
    title?: string;
    bio?: string;
    phone?: string;
    city?: string;
    imageURL?: string;
    coverImageUrl?: string;
    languages?: string[];
    professionalStartDate?: string;
    areas: PracticeArea[];
    education?: Education[];
    workExperience?: WorkExperience[];
    achievements?: Achievement[];
    reviewScore: number;
    reviewCount: number;
  }