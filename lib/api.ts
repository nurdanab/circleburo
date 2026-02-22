const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Lead {
  id?: number;
  name: string;
  phone: string;
  meeting_date: string;
  meeting_time: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export const api = {
  async createLead(lead: Omit<Lead, 'id' | 'created_at' | 'status'>): Promise<ApiResponse<Lead>> {
    try {
      const response = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Failed to create lead' };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  },

  async getBookedSlots(date: string): Promise<ApiResponse<Lead[]>> {
    try {
      const response = await fetch(`${API_URL}/api/leads?meeting_date=${date}`);

      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Failed to fetch slots' };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  },

  async checkSlotAvailability(date: string, time: string): Promise<boolean> {
    const result = await this.getBookedSlots(date);
    if (result.error || !result.data) return true;

    return !result.data.some(
      lead => lead.meeting_time === time &&
              ['pending', 'confirmed'].includes(lead.status || '')
    );
  },

  // Admin API methods
  async getAllLeads(): Promise<ApiResponse<Lead[]>> {
    try {
      const response = await fetch(`${API_URL}/api/leads`);

      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Failed to fetch leads' };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  },

  async updateLead(id: number, updates: Partial<Lead>): Promise<ApiResponse<Lead>> {
    try {
      const response = await fetch(`${API_URL}/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Failed to update lead' };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  },

  async deleteLead(id: number): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`${API_URL}/api/leads/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Failed to delete lead' };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  },
};
