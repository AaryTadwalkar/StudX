// src/utils/messageHelpers.ts

import { getAuthHeaders } from '../context/AuthContext';

const API_BASE = "http://localhost:5000/api";

/**
 * Start a conversation with another user
 * Call this from Marketplace, Skills, or Startups pages
 * 
 * @param otherUserId - The MongoDB _id of the user to chat with
 * @param otherUserName - Display name of the user
 * @param otherUserEmail - Email of the user (optional)
 * @returns conversationId if successful
 */
export const startConversation = async (
  otherUserId: string,
  otherUserName: string,
  otherUserEmail?: string
): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE}/messages/conversations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        otherUserId,
        otherUserName,
        otherUserEmail
      })
    });

    if (!response.ok) {
      throw new Error('Failed to start conversation');
    }

    const data = await response.json();
    return data.conversationId;
  } catch (error) {
    console.error('Start conversation error:', error);
    return null;
  }
};

/**
 * Example usage in Marketplace.tsx:
 * 
 * const handleStartChat = async (sellerId: string, sellerName: string) => {
 *   const conversationId = await startConversation(sellerId, sellerName);
 *   if (conversationId) {
 *     onNavigate('messages');
 *   } else {
 *     alert('Failed to start conversation');
 *   }
 * };
 */
