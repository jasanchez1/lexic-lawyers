export interface ReviewAuthor {
    name: string;
    email?: string;
  }
  
  export interface ReviewReply {
    id: string;
    content: string;
    date: string;
    author: string;
  }
  
  export interface LawyerReview {
    id: string;
    rating: number;
    title: string;
    content: string;
    date: string;
    author: ReviewAuthor;
    lawyerId: string;
    isHired?: boolean;
    isAnonymous?: boolean;
    hasReply?: boolean;
    reply?: ReviewReply;
  }
  
  export interface ReviewStats {
    average: number;
    total: number;
    distribution: Record<string, number>;
  }