export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  user_id_from: string;  // ID of message sender
  user_id_to: string;    // ID of message recipient
  from_lawyer: boolean;  // Kept for backward compatibility
  read: boolean;
  timestamp: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  client: {
    id: string;
    name: string;
    email: string;
    imageUrl?: string;
  };
  lawyer: {
    user_id: string;
    name: string;
    email: string;
  };
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
}

export interface MessageSendRequest {
  content: string;
  user_id: string;
}

// Helper function to determine message direction using new user ID fields
export function isMessageFromUser(message: Message, currentUserId: string): boolean {
  // Prefer new explicit user IDs
  if (message.user_id_from) {
    return message.user_id_from === currentUserId;
  }
  // Fallback to old from_lawyer logic for backward compatibility
  return !message.from_lawyer;
}

export function isMessageFromLawyer(message: Message, lawyerId: string): boolean {
  // Prefer new explicit user IDs
  if (message.user_id_from) {
    return message.user_id_from === lawyerId;
  }
  // Fallback to old from_lawyer logic for backward compatibility
  return message.from_lawyer;
}