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

export interface LawyerDocument {
  id: string;
  lawyer_id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  status: "pending" | "verified" | "rejected";
  notes?: string;
  uploaded_date: string;
  verified_date?: string;
}

export interface LawyerDocumentsResponse {
  success: boolean;
  data: {
    lawyer_id: string;
    documents: Array<{
      type: string;
      status: "pending_review" | "verified" | "rejected";
      filename: string;
      upload_date: string;
      review_date: string | null;
      url: string;
      rejection_reason: string | null;
    }>;
  };
  message: string | null;
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
