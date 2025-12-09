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
  async insert(records) {
    try {
      const recordsArray = Array.isArray(records) ? records : [records];

      // Make separate requests for each record (since our API creates one at a time)
      const results = [];
      for (const record of recordsArray) {
        const response = await fetch(`${this.baseURL}/api/${this.table}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record)
        });

        if (!response.ok) {
          const errorData = await response.json();
          return { data: null, error: { message: errorData.error || 'Failed to insert data' } };
        }

        const data = await response.json();
        results.push(data);
      }

      return { data: results, error: null };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  }

  // UPDATE
  async update(updates) {
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

      const response = await fetch(`${this.baseURL}/api/${this.table}/${this.eqValue}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: { message: errorData.error || 'Failed to update data' } };
      }

      const data = await response.json();
      return { data: [data], error: null };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  }

  // Override select() to handle update case
  async select(columns = '*') {
    if (this.updateData) {
      return this._executeUpdate();
    }

    try {
      let url = `${this.baseURL}/api/${this.table}`;

      // Handle single record fetch by ID
      if (this.eqField === 'id' && this.eqValue) {
        url = `${url}/${this.eqValue}`;

        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json();
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

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
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
