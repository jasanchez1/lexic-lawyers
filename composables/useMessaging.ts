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

      // Transform the API response to match new simplified structure
      conversations.value = (response || []).map((conversation: any): Conversation => ({
        id: conversation.id,
        other_participant: {
          id: conversation.other_participant?.id || "",
          name: conversation.other_participant?.name || "Unknown",
          title: conversation.other_participant?.title || undefined,
          image_url: conversation.other_participant?.image_url || undefined,
        },
        last_message: conversation.last_message || "",
        last_message_date: conversation.last_message_date || new Date().toISOString(),
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

      // Transform the API response to match new simplified structure
      currentMessages.value = (response || []).map((message: any): Message => ({
        id: message.id,
        conversation_id: message.conversation_id || conversationId,
        sender_id: message.sender_id || "",
        content: message.content || "",
        is_from_me: message.is_from_me || false,
        read: message.read || false,
        timestamp: message.timestamp || new Date().toISOString(),
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
      });

      // Transform the API response to match new simplified structure
      const newMessage: Message = {
        id: (response as any).id || `temp-${Date.now()}`,
        conversation_id: conversationId,
        sender_id: user.value?.id || "",
        content: content,
        is_from_me: true, // Current user is sending this message
        read: false,
        timestamp: (response as any).timestamp || new Date().toISOString(),
      };

      // Add the new message to the current messages
      currentMessages.value.push(newMessage);

      // Update the conversation in the list
      const conversationIndex = conversations.value.findIndex(
        (c) => c.id === conversationId
      );
      if (conversationIndex !== -1) {
        conversations.value[conversationIndex].last_message = content;
        conversations.value[conversationIndex].last_message_date =
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
      // Note: unread_count no longer exists in new API structure
      // Individual message read status is handled by the backend

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
