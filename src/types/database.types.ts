// Generated from the Academy's own Supabase project (lippaasbtqsizqzjxtyq) — 2026-07-21
// After ANY migration: regenerate via Supabase MCP generate_typescript_types and replace this file.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cert_shares: {
        Row: {
          awarded_at: string
          code: string
          created_at: string
          emoji: string
          id: string
          label: string
          learner_name: string
          user_id: string
        }
        Insert: {
          awarded_at: string
          code: string
          created_at?: string
          emoji?: string
          id?: string
          label: string
          learner_name: string
          user_id: string
        }
        Update: {
          awarded_at?: string
          code?: string
          created_at?: string
          emoji?: string
          id?: string
          label?: string
          learner_name?: string
          user_id?: string
        }
        Relationships: []
      }
      content_items: {
        Row: {
          body: Json
          created_at: string
          difficulty: string
          emoji: string
          format: string
          id: string
          is_published: boolean
          pillar: string
          slug: string
          summary: string
          tags: string[]
          title: string
          updated_at: string
          url: string | null
          wave: number
        }
        Insert: {
          body?: Json
          created_at?: string
          difficulty?: string
          emoji?: string
          format: string
          id?: string
          is_published?: boolean
          pillar?: string
          slug: string
          summary?: string
          tags?: string[]
          title: string
          updated_at?: string
          url?: string | null
          wave?: number
        }
        Update: {
          body?: Json
          created_at?: string
          difficulty?: string
          emoji?: string
          format?: string
          id?: string
          is_published?: boolean
          pillar?: string
          slug?: string
          summary?: string
          tags?: string[]
          title?: string
          updated_at?: string
          url?: string | null
          wave?: number
        }
        Relationships: []
      }
      credentials: {
        Row: {
          awarded_at: string
          code: string
          emoji: string
          id: string
          label: string
          user_id: string
        }
        Insert: {
          awarded_at?: string
          code: string
          emoji?: string
          id?: string
          label: string
          user_id: string
        }
        Update: {
          awarded_at?: string
          code?: string
          emoji?: string
          id?: string
          label?: string
          user_id?: string
        }
        Relationships: []
      }
      demo_usage: {
        Row: {
          count: number
          day: string
          ip_hash: string
        }
        Insert: {
          count?: number
          day?: string
          ip_hash: string
        }
        Update: {
          count?: number
          day?: string
          ip_hash?: string
        }
        Relationships: []
      }
      eli5_guides: {
        Row: {
          category: string
          chapters: Json
          created_at: string
          difficulty: string
          emoji: string
          id: string
          is_published: boolean
          slug: string
          tagline: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          chapters?: Json
          created_at?: string
          difficulty?: string
          emoji?: string
          id?: string
          is_published?: boolean
          slug: string
          tagline?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          chapters?: Json
          created_at?: string
          difficulty?: string
          emoji?: string
          id?: string
          is_published?: boolean
          slug?: string
          tagline?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      founder_slots: {
        Row: {
          cap: number
          claimed: number
          id: boolean
        }
        Insert: {
          cap?: number
          claimed?: number
          id?: boolean
        }
        Update: {
          cap?: number
          claimed?: number
          id?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          current_period_end: string | null
          display_name: string | null
          email: string
          entitlements: Json
          full_name: string | null
          id: string
          is_founder: boolean
          onboarding_completed: boolean
          stripe_customer_id: string | null
          subscription_status: string
          subscription_tier: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          current_period_end?: string | null
          display_name?: string | null
          email: string
          entitlements?: Json
          full_name?: string | null
          id: string
          is_founder?: boolean
          onboarding_completed?: boolean
          stripe_customer_id?: string | null
          subscription_status?: string
          subscription_tier?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          current_period_end?: string | null
          display_name?: string | null
          email?: string
          entitlements?: Json
          full_name?: string | null
          id?: string
          is_founder?: boolean
          onboarding_completed?: boolean
          stripe_customer_id?: string | null
          subscription_status?: string
          subscription_tier?: string
          updated_at?: string
        }
        Relationships: []
      }
      progress: {
        Row: {
          created_at: string
          id: string
          item_slug: string
          item_type: string
          percent: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_slug: string
          item_type: string
          percent?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_slug?: string
          item_type?: string
          percent?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      shares: {
        Row: {
          answer: string
          created_at: string
          id: string
          question: string
          user_id: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          question: string
          user_id: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          question?: string
          user_id?: string
        }
        Relationships: []
      }
      tutor_conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tutor_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutor_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "tutor_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_daily: {
        Row: {
          count: number
          day: string
          kind: string
          user_id: string
        }
        Insert: {
          count?: number
          day?: string
          kind?: string
          user_id: string
        }
        Update: {
          count?: number
          day?: string
          kind?: string
          user_id?: string
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          best_streak: number
          current_streak: number
          last_day: string | null
          user_id: string
        }
        Insert: {
          best_streak?: number
          current_streak?: number
          last_day?: string | null
          user_id: string
        }
        Update: {
          best_streak?: number
          current_streak?: number
          last_day?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bump_streak: { Args: { p_user_id: string }; Returns: number }
      increment_demo: {
        Args: { p_cap: number; p_ip_hash: string }
        Returns: boolean
      }
      increment_usage: {
        Args: { p_cap: number; p_kind: string; p_user_id: string }
        Returns: {
          allowed: boolean
          new_count: number
        }[]
      }
      search_academy_content: {
        Args: { max_results?: number; query: string }
        Returns: {
          slug: string
          snippet: string
          source: string
          title: string
        }[]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
