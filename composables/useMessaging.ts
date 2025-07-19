import { ref } from "vue";
import { useMessagingService } from "~/services/messaging-service";
import type { Message, Conversation } from "~/types/message";
import { useAuth } from "~/composables/useAuth";

export function useMessaging() {
  const messagingService = useMessagingService();
  const { user } = useAuth();

  const conversations = ref<Conversation[]>([]);
  const currentMessages = ref<Message[]>([]);
  const isLoading = ref(false);
  const isLoadingMessages = ref(false);
  const error = ref<string | null>(null);

  // Fetch all conversations
  const fetchConversations = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await messagingService.getConversations();

      // Transform the API response to match expected structure
      // Note: API returns "lawyer" field which is actually the client from lawyer's perspective
      conversations.value = (response || []).map((conversation: any): Conversation => ({
        id: conversation.id,
        client: {
          id: conversation.lawyer?.id || conversation.lawyer?.user_id || "",
          name: conversation.lawyer?.name || "Unknown",
          email: conversation.lawyer?.email || "",
          imageUrl: conversation.lawyer?.image_url || undefined,
        },
        lawyer: {
          user_id: conversation.lawyer?.user_id || "",
          name: conversation.lawyer?.name || "Unknown", 
          email: conversation.lawyer?.email || "",
        },
        lastMessage: conversation.last_message || "",
        lastMessageDate: conversation.last_message_date || new Date().toISOString(),
        unreadCount: conversation.unread_count || 0,
      }));

      return conversations.value;
    } catch (err) {
      console.error("Error fetching conversations:", err);
      error.value =
        err instanceof Error ? err.message : "Error al cargar conversaciones";
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  // Fetch messages for a specific conversation
  const fetchMessages = async (conversationId: string) => {
    isLoadingMessages.value = true;

    try {
      const response = await messagingService.getMessages(conversationId);

      // Transform the API response to match expected structure
      currentMessages.value = (response || []).map((message: any): Message => ({
        id: message.id,
        conversation_id: message.conversation_id || conversationId,
        content: message.content || "",
        user_id_from: message.user_id_from || "",
        user_id_to: message.user_id_to || "",
        from_lawyer: message.from_lawyer ?? false, // Keep for backward compatibility
        read: message.read || false,
        timestamp: message.timestamp || new Date().toISOString(),
        created_at: message.created_at || new Date().toISOString(),
        updated_at: message.updated_at || new Date().toISOString(),
      }));

      return currentMessages.value;
    } catch (err) {
      console.error("Error fetching messages:", err);
      error.value =
        err instanceof Error ? err.message : "Error al cargar mensajes";
      return [];
    } finally {
      isLoadingMessages.value = false;
    }
  };

  // Send a new message
  const sendNewMessage = async (conversationId: string, content: string) => {
    try {
      const response = await messagingService.sendMessage(conversationId, {
        content,
        user_id: user.value?.id || "",
      });

      // Transform the API response to match expected structure
      const newMessage: Message = {
        id: (response as any).id || `temp-${Date.now()}`,
        conversation_id: conversationId,
        content: content,
        user_id_from: user.value?.id || "",
        user_id_to: (response as any).user_id_to || "",
        from_lawyer: true, // Current user (lawyer) is sending this message
        read: false,
        timestamp: (response as any).timestamp || new Date().toISOString(),
        created_at: (response as any).created_at || new Date().toISOString(),
        updated_at: (response as any).updated_at || new Date().toISOString(),
      };

      // Add the new message to the current messages
      currentMessages.value.push(newMessage);

      // Update the conversation in the list
      const conversationIndex = conversations.value.findIndex(
        (c) => c.id === conversationId
      );
      if (conversationIndex !== -1) {
        conversations.value[conversationIndex].lastMessage = content;
        conversations.value[conversationIndex].lastMessageDate =
          newMessage.timestamp;

        // Move this conversation to the top of the list
        const conversation = conversations.value.splice(
          conversationIndex,
          1
        )[0];
        conversations.value.unshift(conversation);
      }

      return newMessage;
    } catch (err) {
      console.error("Error sending message:", err);
      throw err;
    }
  };

  // Mark a conversation as read
  const markConversationAsRead = async (conversationId: string) => {
    try {
      const response = await messagingService.markAsRead(conversationId);

      // Update the conversation in the list
      const conversationIndex = conversations.value.findIndex(
        (c) => c.id === conversationId
      );
      if (conversationIndex !== -1) {
        conversations.value[conversationIndex].unreadCount = 0;
      }

      return response;
    } catch (err) {
      console.error("Error marking conversation as read:", err);
      throw err;
    }
  };

  return {
    conversations,
    currentMessages,
    isLoading,
    isLoadingMessages,
    error,
    fetchConversations,
    fetchMessages,
    sendNewMessage,
    markConversationAsRead,
  };
}
