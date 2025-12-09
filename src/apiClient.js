// apiClient.js - Замена для Supabase SDK
// Используйте этот файл вместо supabaseClient.js

class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  // Метод from() для совместимости с Supabase API
  from(table) {
    return new TableQuery(this.baseURL, table);
  }
}

class TableQuery {
  constructor(baseURL, table) {
    this.baseURL = baseURL;
    this.table = table;
    this.queryParams = {};
  }

  // SELECT
  async select(columns = '*') {
    try {
      const params = new URLSearchParams(this.queryParams);
      const url = `${this.baseURL}/api/${this.table}${params.toString() ? '?' + params.toString() : ''}`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: { message: errorData.error || 'Failed to fetch data' } };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  }

  // INSERT
  insert(records) {
    this.insertData = Array.isArray(records) ? records : [records];
    return this; // Return this to allow chaining with .select()
  }

  // Execute INSERT
  async _executeInsert() {
    try {
      const results = [];
      for (const record of this.insertData) {
        const url = `${this.baseURL}/api/${this.table}`;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          return { data: null, error: { message: errorData.error || 'Failed to insert data' } };
        }

        const data = await response.json();
        results.push(data);
      }

      return { data: results, error: null };
    } catch (error) {
      return { data: null, error: { message: error.message || 'Network error' } };
    }
  }

  // UPDATE
  update(updates) {
    this.updateData = updates;
    return this;
  }

  // DELETE
  async delete() {
    try {
      if (!this.eqField || !this.eqValue) {
        throw new Error('Delete requires .eq() clause');
      }

      const response = await fetch(`${this.baseURL}/api/${this.table}/${this.eqValue}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: { message: errorData.error || 'Failed to delete data' } };
      }

      return { data: null, error: null };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  }

  // EQ (equals filter)
  eq(field, value) {
    if (field === 'id') {
      this.eqField = field;
      this.eqValue = value;
    } else {
      this.queryParams[field] = value;
    }
    return this;
  }

  // IN (array filter)
  in(field, values) {
    // For simplicity, we'll just fetch all and filter client-side
    // You can enhance the backend to support this properly
    this._inFilter = { field, values };
    return this;
  }

  // ORDER BY
  order(field, options = {}) {
    this.orderField = field;
    this.orderDirection = options.ascending ? 'asc' : 'desc';
    return this;
  }

  // SINGLE (return single record)
  async single() {
    const result = await this.select();
    if (result.error) return result;

    if (result.data && result.data.length > 0) {
      return { data: result.data[0], error: null };
    }

    return { data: null, error: { message: 'No data found' } };
  }

  // Execute update with eq
  async _executeUpdate() {
    try {
      if (!this.eqField || !this.eqValue) {
        throw new Error('Update requires .eq() clause');
      }

      const url = `${this.baseURL}/api/${this.table}/${this.eqValue}`;
      console.log('[apiClient] PATCH request:', url);
      console.log('[apiClient] Update data:', this.updateData);

      const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.updateData)
      });

      console.log('[apiClient] PATCH response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[apiClient] PATCH error:', errorData);
        return { data: null, error: { message: errorData.error || 'Failed to update data' } };
      }

      const data = await response.json();
      console.log('[apiClient] PATCH success:', data);
      return { data: [data], error: null };
    } catch (error) {
      console.error('[apiClient] PATCH exception:', error);
      return { data: null, error: { message: error.message } };
    }
  }

  // Override select() to handle update and insert cases
  async select(columns = '*') {
    // Handle insert case
    if (this.insertData) {
      return this._executeInsert();
    }

    // Handle update case
    if (this.updateData) {
      return this._executeUpdate();
    }

    try {
      let url = `${this.baseURL}/api/${this.table}`;

      // Handle single record fetch by ID
      if (this.eqField === 'id' && this.eqValue) {
        url = `${url}/${this.eqValue}`;

        console.log('[apiClient] GET request (by ID):', url);
        const response = await fetch(url);
        console.log('[apiClient] Response status:', response.status, response.statusText);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('[apiClient] Error response:', errorData);
          return { data: null, error: { message: errorData.error || 'Failed to fetch data' } };
        }

        const data = await response.json();
        return { data: [data], error: null };
      }

      // Handle query parameters
      const params = new URLSearchParams(this.queryParams);
      if (params.toString()) {
        url += '?' + params.toString();
      }

      console.log('[apiClient] GET request:', url);
      const response = await fetch(url);
      console.log('[apiClient] Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[apiClient] Error response:', errorData);
        return { data: null, error: { message: errorData.error || 'Failed to fetch data' } };
      }

      let data = await response.json();

      // Apply client-side filtering if needed
      if (this._inFilter) {
        const { field, values } = this._inFilter;
        data = data.filter(item => values.includes(item[field]));
      }

      // Apply client-side sorting if needed
      if (this.orderField) {
        data.sort((a, b) => {
          const aVal = a[this.orderField];
          const bVal = b[this.orderField];

          if (aVal < bVal) return this.orderDirection === 'asc' ? -1 : 1;
          if (aVal > bVal) return this.orderDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  }
}

// Export configured client
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const apiClient = new APIClient(API_BASE_URL);

// Export the same interface as Supabase for easy migration
export { apiClient as supabase };
