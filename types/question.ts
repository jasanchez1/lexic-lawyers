export interface QuestionAuthor {
    name: string;
    location?: string | null;
  }
  
  export interface Topic {
    id: string;
    name: string;
    slug: string;
  }
  
  export interface Question {
    id: string;
    title: string;
    content: string;
    date: string;
    location?: string | null;
    viewCount: number;
    answerCount: number;
    topics: Topic[];
    author?: QuestionAuthor | null;
    status?: 'answered' | 'unanswered' | 'accepted';
    planToHire?: 'yes' | 'no' | 'maybe';
  }
  
  export interface QuestionsList {
    questions: Question[];
    total: number;
    page: number;
    size: number;
    pages: number;
  }
  
  export interface QuestionCreate {
    title: string;
    content: string;
    location?: string | null;
    planToHire?: 'yes' | 'no' | 'maybe';
    topicIds: string[];
  }
  
  export interface QuestionUpdate {
    title?: string | null;
    content?: string | null;
    location?: string | null;
    planToHire?: 'yes' | 'no' | 'maybe' | null;
    topicIds?: string[] | null;
  }
  
  export interface AnswerAuthor {
    id: string;
    name: string;
    title?: string | null;
    imageUrl?: string | null;
    isVerified?: boolean;
  }
  
  export interface Reply {
    id: string;
    content: string;
    date: string;
    author: AnswerAuthor;
  }
  
  export interface Answer {
    id: string;
    questionId: string;
    content: string;
    date: string;
    userId: string;
    lawyerId?: string | null;
    isAccepted?: boolean;
    createdAt: string;
    updatedAt: string;
    author: AnswerAuthor;
    helpfulCount?: number;
    isHelpful?: boolean;
    replyCount?: number;
    replies?: Reply[];
  }
  
  export interface AnswerCreate {
    content: string;
    lawyerId?: string | null;
  }
  
  export interface AnswerUpdate {
    content?: string | null;
  }
  
  export interface ReplyCreate {
    content: string;
  }