export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cached_trending_posts: {
        Row: {
          engagement_score: number
          id: string
          post_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          engagement_score: number
          id?: string
          post_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          engagement_score?: number
          id?: string
          post_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cached_trending_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      connections: {
        Row: {
          connected_user_id: string
          created_at: string | null
          id: string
          status: string
          user_id: string
        }
        Insert: {
          connected_user_id: string
          created_at?: string | null
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          connected_user_id?: string
          created_at?: string | null
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "connections_connected_user_id_fkey"
            columns: ["connected_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          attachments: Json | null
          body: string
          comments_count: number | null
          created_at: string | null
          engagement_score: number | null
          id: string
          tags: string[] | null
          title: string
          updated_at: string | null
          upvotes_count: number | null
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          body: string
          comments_count?: number | null
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          upvotes_count?: number | null
          user_id: string
        }
        Update: {
          attachments?: Json | null
          body?: string
          comments_count?: number | null
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          upvotes_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      forum_upvotes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_upvotes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          reply_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          reply_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          reply_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_journals: {
        Row: {
          abstract: string | null
          authors: string | null
          created_at: string
          id: string
          is_open_access: boolean | null
          journal_id: string | null
          link: string
          publication_date: string | null
          source: string
          specialty_tags: string[] | null
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          abstract?: string | null
          authors?: string | null
          created_at?: string
          id?: string
          is_open_access?: boolean | null
          journal_id?: string | null
          link: string
          publication_date?: string | null
          source: string
          specialty_tags?: string[] | null
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          abstract?: string | null
          authors?: string | null
          created_at?: string
          id?: string
          is_open_access?: boolean | null
          journal_id?: string | null
          link?: string
          publication_date?: string | null
          source?: string
          specialty_tags?: string[] | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      meme_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          is_anonymous: boolean | null
          likes_count: number | null
          meme_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          likes_count?: number | null
          meme_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          likes_count?: number | null
          meme_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meme_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meme_comments_meme_id_fkey"
            columns: ["meme_id"]
            isOneToOne: false
            referencedRelation: "memes"
            referencedColumns: ["id"]
          },
        ]
      }
      memes: {
        Row: {
          author_id: string
          comments_count: number | null
          created_at: string | null
          id: string
          image_url: string
          is_anonymous: boolean | null
          likes_count: number | null
          title: string
        }
        Insert: {
          author_id: string
          comments_count?: number | null
          created_at?: string | null
          id?: string
          image_url: string
          is_anonymous?: boolean | null
          likes_count?: number | null
          title: string
        }
        Update: {
          author_id?: string
          comments_count?: number | null
          created_at?: string | null
          id?: string
          image_url?: string
          is_anonymous?: boolean | null
          likes_count?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "memes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      news_articles: {
        Row: {
          ai_summary: string | null
          category: string
          created_at: string
          id: string
          image_url: string | null
          published_date: string | null
          source: string | null
          specialty: string[] | null
          summary: string | null
          title: string
          url: string
        }
        Insert: {
          ai_summary?: string | null
          category: string
          created_at?: string
          id: string
          image_url?: string | null
          published_date?: string | null
          source?: string | null
          specialty?: string[] | null
          summary?: string | null
          title: string
          url: string
        }
        Update: {
          ai_summary?: string | null
          category?: string
          created_at?: string
          id?: string
          image_url?: string | null
          published_date?: string | null
          source?: string | null
          specialty?: string[] | null
          summary?: string | null
          title?: string
          url?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          is_read: boolean
          message: string
          sender_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean
          message: string
          sender_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean
          message?: string
          sender_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      post_tags: {
        Row: {
          created_at: string
          post_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          post_id: string
          tag_id: string
        }
        Update: {
          created_at?: string
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string | null
          id: string
          is_ai_generated: boolean | null
          is_anonymous: boolean | null
          likes_count: number | null
          replies_count: number | null
          source: string | null
          summary: string | null
          tags: string[] | null
          title: string
          views_count: number | null
        }
        Insert: {
          author_id: string
          category: string
          content: string
          created_at?: string | null
          id?: string
          is_ai_generated?: boolean | null
          is_anonymous?: boolean | null
          likes_count?: number | null
          replies_count?: number | null
          source?: string | null
          summary?: string | null
          tags?: string[] | null
          title: string
          views_count?: number | null
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          is_ai_generated?: boolean | null
          is_anonymous?: boolean | null
          likes_count?: number | null
          replies_count?: number | null
          source?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          bio: string | null
          city: string | null
          email: string | null
          engagement_style: string | null
          hospital: string | null
          id: string
          joined_at: string | null
          name: string
          personality_type: string | null
          points: number | null
          rank: string | null
          specialty: string
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          city?: string | null
          email?: string | null
          engagement_style?: string | null
          hospital?: string | null
          id: string
          joined_at?: string | null
          name: string
          personality_type?: string | null
          points?: number | null
          rank?: string | null
          specialty: string
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          city?: string | null
          email?: string | null
          engagement_style?: string | null
          hospital?: string | null
          id?: string
          joined_at?: string | null
          name?: string
          personality_type?: string | null
          points?: number | null
          rank?: string | null
          specialty?: string
        }
        Relationships: []
      }
      replies: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          is_ai_generated: boolean | null
          is_anonymous: boolean | null
          likes_count: number | null
          post_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          is_ai_generated?: boolean | null
          is_anonymous?: boolean | null
          likes_count?: number | null
          post_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_ai_generated?: boolean | null
          is_anonymous?: boolean | null
          likes_count?: number | null
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_journals: {
        Row: {
          created_at: string
          id: string
          journal_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          journal_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          journal_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_journals_journal_id_fkey"
            columns: ["journal_id"]
            isOneToOne: false
            referencedRelation: "medical_journals"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_posts: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_webinars: {
        Row: {
          created_at: string
          id: string
          user_id: string
          webinar_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          webinar_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          webinar_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_webinars_webinar_id_fkey"
            columns: ["webinar_id"]
            isOneToOne: false
            referencedRelation: "webinars"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      webinars: {
        Row: {
          content_hash: string | null
          created_at: string
          datetime: string
          description: string | null
          id: string
          image_url: string | null
          link: string
          reputation_score: number | null
          source: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content_hash?: string | null
          created_at?: string
          datetime: string
          description?: string | null
          id?: string
          image_url?: string | null
          link: string
          reputation_score?: number | null
          source?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content_hash?: string | null
          created_at?: string
          datetime?: string
          description?: string | null
          id?: string
          image_url?: string | null
          link?: string
          reputation_score?: number | null
          source?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_content_hash_column: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      calculate_trend_score: {
        Args: {
          upvotes: number
          comments: number
          created_at: string
        }
        Returns: number
      }
      get_popular_tags: {
        Args: {
          days_ago?: number
        }
        Returns: {
          id: string
          name: string
          color: string
          post_count: number
        }[]
      }
      get_trending_discussions: {
        Args: {
          limit_count?: number
        }
        Returns: {
          id: string
          title: string
          content: string
          author_id: string
          created_at: string
          likes_count: number
          replies_count: number
          trend_score: number
        }[]
      }
      get_trending_forum_posts: {
        Args: {
          limit_count?: number
        }
        Returns: {
          id: string
          title: string
          body: string
          user_id: string
          attachments: Json
          upvotes_count: number
          comments_count: number
          engagement_score: number
          created_at: string
          updated_at: string
          tags: string[]
        }[]
      }
      search_posts_by_tag_or_term: {
        Args: {
          search_term: string
        }
        Returns: {
          post_id: string
          relevance: number
        }[]
      }
      update_trending_posts_cache: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
