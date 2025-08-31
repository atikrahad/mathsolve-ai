import api from '@/lib/api';
import {
  Resource,
  ResourceSearchParams,
  ResourceSearchResult,
  CreateResourceData,
  UpdateResourceData,
  Bookmark,
  ResourceStats,
} from '@/types/resource';

class ResourceService {
  /**
   * Get all resources with pagination, filtering, and sorting
   */
  async getResources(params: ResourceSearchParams = {}): Promise<ResourceSearchResult> {
    const response = await api.get('/resources', { params });
    return response.data.data;
  }

  /**
   * Search resources with query string
   */
  async searchResources(params: ResourceSearchParams & { query: string }): Promise<ResourceSearchResult> {
    const response = await api.get('/resources/search', { params });
    return response.data.data;
  }

  /**
   * Get resources by category
   */
  async getResourcesByCategory(category: string, params: ResourceSearchParams = {}): Promise<ResourceSearchResult> {
    const response = await api.get(`/resources/category/${category}`, { params });
    return response.data.data;
  }

  /**
   * Get resources by type
   */
  async getResourcesByType(type: string, params: ResourceSearchParams = {}): Promise<ResourceSearchResult> {
    const response = await api.get(`/resources/type/${type}`, { params });
    return response.data.data;
  }

  /**
   * Get resource by ID
   */
  async getResourceById(id: string): Promise<Resource> {
    const response = await api.get(`/resources/${id}`);
    return response.data.data;
  }

  /**
   * Create a new resource
   */
  async createResource(resourceData: CreateResourceData): Promise<Resource> {
    const response = await api.post('/resources', resourceData);
    return response.data.data;
  }

  /**
   * Update an existing resource
   */
  async updateResource(id: string, resourceData: UpdateResourceData): Promise<Resource> {
    const response = await api.put(`/resources/${id}`, resourceData);
    return response.data.data;
  }

  /**
   * Delete a resource
   */
  async deleteResource(id: string): Promise<void> {
    await api.delete(`/resources/${id}`);
  }

  /**
   * Bookmark a resource
   */
  async bookmarkResource(id: string): Promise<Bookmark> {
    const response = await api.post(`/resources/${id}/bookmark`);
    return response.data.data;
  }

  /**
   * Remove bookmark from a resource
   */
  async removeBookmark(id: string): Promise<void> {
    await api.delete(`/resources/${id}/bookmark`);
  }

  /**
   * Get bookmarked resources for current user
   */
  async getBookmarkedResources(params: ResourceSearchParams = {}): Promise<ResourceSearchResult> {
    // This would be implemented as a user endpoint in the backend
    // For now, we'll get resources and filter by bookmarked status
    const response = await api.get('/resources', { 
      params: { 
        ...params,
        // Add user-specific filtering when user endpoints are available
      } 
    });
    return response.data.data;
  }

  /**
   * Get resource statistics
   */
  async getResourceStats(): Promise<ResourceStats> {
    // This would be a dedicated endpoint for stats
    const response = await api.get('/resources/stats');
    return response.data.data;
  }

  /**
   * Get popular resources
   */
  async getPopularResources(limit: number = 10): Promise<Resource[]> {
    const response = await api.get('/resources', {
      params: {
        sortBy: 'viewCount',
        sortOrder: 'desc',
        limit,
      },
    });
    return response.data.data.resources;
  }

  /**
   * Get recent resources
   */
  async getRecentResources(limit: number = 10): Promise<Resource[]> {
    const response = await api.get('/resources', {
      params: {
        sortBy: 'createdAt',
        sortOrder: 'desc',
        limit,
      },
    });
    return response.data.data.resources;
  }

  /**
   * Get resources by author
   */
  async getResourcesByAuthor(authorId: string, params: ResourceSearchParams = {}): Promise<ResourceSearchResult> {
    const response = await api.get('/resources', {
      params: {
        ...params,
        authorId,
      },
    });
    return response.data.data;
  }

  /**
   * Get related resources for a specific resource
   */
  async getRelatedResources(resourceId: string, category: string, limit: number = 5): Promise<Resource[]> {
    // Get resources from the same category, excluding the current resource
    const response = await api.get('/resources', {
      params: {
        category,
        limit: limit + 1, // Get one extra to account for filtering out current
        sortBy: 'viewCount',
        sortOrder: 'desc',
      },
    });
    
    // Filter out the current resource
    const resources = response.data.data.resources.filter((r: Resource) => r.id !== resourceId);
    return resources.slice(0, limit);
  }

  /**
   * Get featured resources (high-quality, popular ones)
   */
  async getFeaturedResources(limit: number = 6): Promise<Resource[]> {
    const response = await api.get('/resources', {
      params: {
        sortBy: 'rating',
        sortOrder: 'desc',
        limit,
      },
    });
    return response.data.data.resources;
  }

  /**
   * Increment view count (called when viewing a resource)
   */
  async incrementViewCount(id: string): Promise<void> {
    // This is typically handled by the backend when fetching a resource
    // But we can call it explicitly if needed
    try {
      await this.getResourceById(id);
    } catch (error) {
      // Ignore errors for view count increment
      console.warn('Failed to increment view count:', error);
    }
  }

  /**
   * Validate resource data before submission
   */
  validateResourceData(data: CreateResourceData | UpdateResourceData): string[] {
    const errors: string[] = [];

    if ('title' in data && data.title !== undefined) {
      if (!data.title || data.title.trim().length === 0) {
        errors.push('Title is required');
      } else if (data.title.length > 200) {
        errors.push('Title must be less than 200 characters');
      }
    }

    if ('content' in data && data.content !== undefined) {
      if (!data.content || data.content.trim().length === 0) {
        errors.push('Content is required');
      } else if (data.content.length < 50) {
        errors.push('Content must be at least 50 characters');
      } else if (data.content.length > 50000) {
        errors.push('Content must be less than 50,000 characters');
      }
    }

    if ('type' in data && data.type !== undefined) {
      if (!['TUTORIAL', 'GUIDE', 'REFERENCE'].includes(data.type)) {
        errors.push('Invalid resource type');
      }
    }

    if ('category' in data && data.category !== undefined) {
      if (!data.category || data.category.trim().length === 0) {
        errors.push('Category is required');
      } else if (data.category.length > 50) {
        errors.push('Category must be less than 50 characters');
      }
    }

    if ('difficulty' in data && data.difficulty !== undefined && data.difficulty !== null) {
      if (!['LOW', 'MEDIUM', 'HIGH'].includes(data.difficulty)) {
        errors.push('Invalid difficulty level');
      }
    }

    return errors;
  }

  /**
   * Format resource content for display (handle markdown, etc.)
   */
  formatResourceContent(content: string): string {
    // Basic formatting - in a real app you might want to use a markdown parser
    return content
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }

  /**
   * Extract resource summary from content
   */
  getResourceSummary(content: string, maxLength: number = 150): string {
    // Remove markdown formatting and get plain text
    const plainText = content
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();

    if (plainText.length <= maxLength) {
      return plainText;
    }

    // Find the last complete word within the limit
    const truncated = plainText.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > maxLength * 0.8) {
      return truncated.substring(0, lastSpace) + '...';
    }
    
    return truncated + '...';
  }
}

// Export singleton instance
const resourceService = new ResourceService();
export default resourceService;