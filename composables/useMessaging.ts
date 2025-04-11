import { ref } from "vue";
import { useMessagingService } from "~/services/messaging-service";

export function useMessaging() {
  const messagingService = useMessagingService();

  const conversations = ref([]);
  const currentMessages = ref([]);
  const isLoading = ref(false);
  const isLoadingMessages = ref(false);
  const error = ref(null);

  // Fetch all conversations
  const fetchConversations = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await messagingService.getConversations();

      // Transform the API response to match expected structure
      conversations.value = (response || []).map((conversation) => ({
        id: conversation.id,
        // If we got lawyer info but need client info for the UI
        client: conversation.lawyer || {
          id: conversation.client?.id || "",
          name:
            conversation.client?.name || conversation.lawyer?.name || "Unknown",
          email: conversation.client?.email || "",
          imageUrl:
            conversation.client?.image_url ||
            conversation.lawyer?.image_url ||
            null,
        },
        lastMessage: conversation.last_message || "",
        lastMessageDate:
          conversation.last_message_date || new Date().toISOString(),
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
      currentMessages.value = (response || []).map((message) => ({
        id: message.id,
        content: message.content || "",
        fromLawyer: message.from_lawyer || false,
        read: message.read || false,
        timestamp:
          message.timestamp || message.date || new Date().toISOString(),
        conversationId: message.conversation_id || conversationId,
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

      // Transform the API response to match expected structure
      const newMessage = {
        id: response.id || `temp-${Date.now()}`,
        content: content,
        fromLawyer: true,
        read: false,
        timestamp:
          response.timestamp || response.date || new Date().toISOString(),
        conversationId: conversationId,
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
