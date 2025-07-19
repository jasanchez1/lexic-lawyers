export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;        // Who sent this message
  content: string;
  is_from_me: boolean;      // Did current user send this?
  read: boolean;
  timestamp: string;
}

export interface ParticipantData {
  id: string;
  name: string;
  title?: string;
  image_url?: string;
}

export interface Conversation {
  id: string;
  other_participant: ParticipantData;  // The other person in this conversation
  last_message: string;
  last_message_date: string;
}

export interface MessageSendRequest {
  content: string;
}

// Simple helper - no more complex logic needed!
export function isMessageFromCurrentUser(message: Message): boolean {
  return message.is_from_me;
}