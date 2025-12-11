/**
 * WordPress REST API Client
 * Provides typed methods for interacting with WordPress
 */

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || '';
const WORDPRESS_SITE_URL = process.env.WORDPRESS_SITE_URL || '';

export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: Record<string, any>;
  categories: number[];
  tags: number[];
  _links: Record<string, any>;
}

export interface WordPressPage extends WordPressPost {
  parent: number;
  menu_order: number;
}

export interface WordPressMedia {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  author: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: Record<string, any>;
  description: {
    rendered: string;
  };
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: Record<string, any>;
  };
  source_url: string;
  _links: Record<string, any>;
}

class WordPressClient {
  private apiUrl: string;
  private siteUrl: string;

  constructor() {
    this.apiUrl = WORDPRESS_API_URL;
    this.siteUrl = WORDPRESS_SITE_URL;
  }

  /**
   * Fetch posts from WordPress
   */
  async getPosts(params?: {
    per_page?: number;
    page?: number;
    search?: string;
    categories?: number[];
    tags?: number[];
    orderby?: string;
    order?: 'asc' | 'desc';
  }): Promise<WordPressPost[]> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(','));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }

    const response = await fetch(
      `/api/wordpress?endpoint=posts&params=${queryParams.toString()}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch a single post by ID or slug
   */
  async getPost(identifier: number | string): Promise<WordPressPost> {
    const endpoint = typeof identifier === 'number' 
      ? `posts/${identifier}` 
      : `posts?slug=${identifier}`;
    
    const response = await fetch(
      `/api/wordpress?endpoint=${endpoint}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data[0] : data;
  }

  /**
   * Fetch pages from WordPress
   */
  async getPages(params?: {
    per_page?: number;
    page?: number;
    parent?: number;
    orderby?: string;
    order?: 'asc' | 'desc';
  }): Promise<WordPressPage[]> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(
      `/api/wordpress?endpoint=pages&params=${queryParams.toString()}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch pages: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch media from WordPress
   */
  async getMedia(mediaId?: number): Promise<WordPressMedia | WordPressMedia[]> {
    const endpoint = mediaId ? `media/${mediaId}` : 'media';
    
    const response = await fetch(
      `/api/wordpress?endpoint=${endpoint}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch media: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get full URL for WordPress media
   */
  getMediaUrl(media: WordPressMedia, size: string = 'full'): string {
    if (size === 'full') {
      return media.source_url;
    }
    return media.media_details?.sizes?.[size]?.source_url || media.source_url;
  }

  /**
   * Get site URL
   */
  getSiteUrl(): string {
    return this.siteUrl;
  }
}

export const wordpressClient = new WordPressClient();




