import { getAuthHeaders } from '../../context/AuthContext';

const API_BASE = "http://localhost:5000/api";

/**
 * Start a conversation with another user
 * Used when clicking "Chat Seller" from Marketplace or Skills
 */
export const startConversation = async (sellerId: string, sellerName: string, sellerEmail?: string) => {
  try {
    const response = await fetch(`${API_BASE}/messages/conversations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        otherUserId: sellerId,
        otherUserName: sellerName,
        otherUserEmail: sellerEmail || ''
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to start conversation');
    }

    const data = await response.json();
    return data.conversationId;
  } catch (error) {
    console.error('Start conversation error:', error);
    throw error;
  }
};

/**
 * Check if a conversation exists between current user and another user
 */
export const checkConversationExists = async (otherUserId: string): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE}/messages/conversations`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const conversations = data.conversations || [];
    
    // Find conversation with this user (this is a simplified check)
    // In production, you'd want a dedicated endpoint for this
    const existing = conversations.find((conv: any) => 
      conv.otherUserId === otherUserId
    );

    return existing ? existing.id : null;
  } catch (error) {
    console.error('Check conversation error:', error);
    return null;
  }
};
