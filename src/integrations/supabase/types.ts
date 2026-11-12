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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      collection_runs: {
        Row: {
          central_count: number
          created_at: string
          created_by: string | null
          details: Json
          duplicates: number
          failed: number
          fetched: number
          id: string
          incomplete: number
          inserted: number
          method: string
          not_applicable: number
          source: string
          tn_count: number
          total_available: number | null
          unchanged: number
          updated: number
        }
        Insert: {
          central_count?: number
          created_at?: string
          created_by?: string | null
          details?: Json
          duplicates?: number
          failed?: number
          fetched?: number
          id?: string
          incomplete?: number
          inserted?: number
          method: string
          not_applicable?: number
          source: string
          tn_count?: number
          total_available?: number | null
          unchanged?: number
          updated?: number
        }
        Update: {
          central_count?: number
          created_at?: string
          created_by?: string | null
          details?: Json
          duplicates?: number
          failed?: number
          fetched?: number
          id?: string
          incomplete?: number
          inserted?: number
          method?: string
          not_applicable?: number
          source?: string
          tn_count?: number
          total_available?: number | null
          unchanged?: number
          updated?: number
        }
        Relationships: []
      }
      data_sources: {
        Row: {
          access_method: string
          auto_collect: boolean
          created_at: string
          feed_level: string
          feed_url: string | null
          id: string
          integration_status: string
          last_checked: string | null
          last_http: number | null
          last_status: string | null
          name: string
          notes: string | null
          url: string
        }
        Insert: {
          access_method?: string
          auto_collect?: boolean
          created_at?: string
          feed_level?: string
          feed_url?: string | null
          id?: string
          integration_status?: string
          last_checked?: string | null
          last_http?: number | null
          last_status?: string | null
          name: string
          notes?: string | null
          url: string
        }
        Update: {
          access_method?: string
          auto_collect?: boolean
          created_at?: string
          feed_level?: string
          feed_url?: string | null
          id?: string
          integration_status?: string
          last_checked?: string | null
          last_http?: number | null
          last_status?: string | null
          name?: string
          notes?: string | null
          url?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          after_obtaining: string | null
          alternatives: string | null
          applies_to: string
          code: string
          created_at: string
          eligibility: string | null
          fees: string | null
          id: string
          issuing_authority: string | null
          last_verified: string | null
          name: string
          name_ta: string | null
          offline_process: string | null
          online_portal_name: string | null
          online_url: string | null
          processing_time: string | null
          source_url: string | null
          steps: string[]
          supporting_docs: string[]
          updated_at: string
        }
        Insert: {
          after_obtaining?: string | null
          alternatives?: string | null
          applies_to?: string
          code: string
          created_at?: string
          eligibility?: string | null
          fees?: string | null
          id?: string
          issuing_authority?: string | null
          last_verified?: string | null
          name: string
          name_ta?: string | null
          offline_process?: string | null
          online_portal_name?: string | null
          online_url?: string | null
          processing_time?: string | null
          source_url?: string | null
          steps?: string[]
          supporting_docs?: string[]
          updated_at?: string
        }
        Update: {
          after_obtaining?: string | null
          alternatives?: string | null
          applies_to?: string
          code?: string
          created_at?: string
          eligibility?: string | null
          fees?: string | null
          id?: string
          issuing_authority?: string | null
          last_verified?: string | null
          name?: string
          name_ta?: string | null
          offline_process?: string | null
          online_portal_name?: string | null
          online_url?: string | null
          processing_time?: string | null
          source_url?: string | null
          steps?: string[]
          supporting_docs?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      import_logs: {
        Row: {
          created_at: string
          created_by: string | null
          failed: number | null
          file_name: string | null
          id: string
          inserted: number | null
          updated: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          failed?: number | null
          file_name?: string | null
          id?: string
          inserted?: number | null
          updated?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          failed?: number | null
          file_name?: string | null
          id?: string
          inserted?: number | null
          updated?: number | null
        }
        Relationships: []
      }
      profile_submissions: {
        Row: {
          age: number | null
          community: string | null
          created_at: string
          education: string | null
          gender: string | null
          id: string
          income: number | null
          occupation: string | null
          purpose: string | null
          result_count: number | null
          state: string | null
        }
        Insert: {
          age?: number | null
          community?: string | null
          created_at?: string
          education?: string | null
          gender?: string | null
          id?: string
          income?: number | null
          occupation?: string | null
          purpose?: string | null
          result_count?: number | null
          state?: string | null
        }
        Update: {
          age?: number | null
          community?: string | null
          created_at?: string
          education?: string | null
          gender?: string | null
          id?: string
          income?: number | null
          occupation?: string | null
          purpose?: string | null
          result_count?: number | null
          state?: string | null
        }
        Relationships: []
      }
      scheme_documents: {
        Row: {
          document_id: string
          mandatory: boolean
          reason: string | null
          scheme_id: string
        }
        Insert: {
          document_id: string
          mandatory?: boolean
          reason?: string | null
          scheme_id: string
        }
        Update: {
          document_id?: string
          mandatory?: boolean
          reason?: string | null
          scheme_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheme_documents_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheme_documents_scheme_id_fkey"
            columns: ["scheme_id"]
            isOneToOne: false
            referencedRelation: "schemes"
            referencedColumns: ["id"]
          },
        ]
      }
      schemes: {
        Row: {
          alt_names: string[]
          application_process: string | null
          apply_url: string | null
          benefits: string | null
          category: string
          communities: string[] | null
          created_at: string
          deadline: string | null
          deadline_note: string | null
          department: string | null
          description: string | null
          education_levels: string[] | null
          eligibility_text: string | null
          external_id: string | null
          genders: string[] | null
          id: string
          is_sample: boolean
          is_scholarship: boolean
          last_verified: string | null
          level: string
          link_checked_at: string | null
          link_status: number | null
          max_age: number | null
          max_income: number | null
          min_age: number | null
          name: string
          name_ta: string | null
          occupations: string[] | null
          official_url: string | null
          purposes: string[] | null
          slug: string
          source_last_updated: string | null
          source_name: string | null
          source_unavailable: string[]
          source_url: string | null
          states: string[] | null
          status: Database["public"]["Enums"]["scheme_status"]
          summary: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          alt_names?: string[]
          application_process?: string | null
          apply_url?: string | null
          benefits?: string | null
          category?: string
          communities?: string[] | null
          created_at?: string
          deadline?: string | null
          deadline_note?: string | null
          department?: string | null
          description?: string | null
          education_levels?: string[] | null
          eligibility_text?: string | null
          external_id?: string | null
          genders?: string[] | null
          id?: string
          is_sample?: boolean
          is_scholarship?: boolean
          last_verified?: string | null
          level?: string
          link_checked_at?: string | null
          link_status?: number | null
          max_age?: number | null
          max_income?: number | null
          min_age?: number | null
          name: string
          name_ta?: string | null
          occupations?: string[] | null
          official_url?: string | null
          purposes?: string[] | null
          slug: string
          source_last_updated?: string | null
          source_name?: string | null
          source_unavailable?: string[]
          source_url?: string | null
          states?: string[] | null
          status?: Database["public"]["Enums"]["scheme_status"]
          summary?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          alt_names?: string[]
          application_process?: string | null
          apply_url?: string | null
          benefits?: string | null
          category?: string
          communities?: string[] | null
          created_at?: string
          deadline?: string | null
          deadline_note?: string | null
          department?: string | null
          description?: string | null
          education_levels?: string[] | null
          eligibility_text?: string | null
          external_id?: string | null
          genders?: string[] | null
          id?: string
          is_sample?: boolean
          is_scholarship?: boolean
          last_verified?: string | null
          level?: string
          link_checked_at?: string | null
          link_status?: number | null
          max_age?: number | null
          max_income?: number | null
          min_age?: number | null
          name?: string
          name_ta?: string | null
          occupations?: string[] | null
          official_url?: string | null
          purposes?: string[] | null
          slug?: string
          source_last_updated?: string | null
          source_name?: string | null
          source_unavailable?: string[]
          source_url?: string | null
          states?: string[] | null
          status?: Database["public"]["Enums"]["scheme_status"]
          summary?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      scheme_status:
        | "active"
        | "expired"
        | "discontinued"
        | "needs_verification"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      scheme_status: [
        "active",
        "expired",
        "discontinued",
        "needs_verification",
      ],
    },
  },
} as const
