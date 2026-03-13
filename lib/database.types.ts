export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      invitees: {
        Row: {
          id: string
          name_en: string
          name_ar: string
          slug: string
          email: string | null
          phone: string | null
          max_guests: number
          language_preference: string
          created_at: string
        }
        Insert: {
          id?: string
          name_en: string
          name_ar?: string
          slug: string
          email?: string | null
          phone?: string | null
          max_guests?: number
          language_preference?: string
          created_at?: string
        }
        Update: {
          id?: string
          name_en?: string
          name_ar?: string
          slug?: string
          email?: string | null
          phone?: string | null
          max_guests?: number
          language_preference?: string
          created_at?: string
        }
        Relationships: []
      }
      rsvp_responses: {
        Row: {
          id: string
          invitee_id: string | null
          name: string
          email: string
          attending: string
          message: string
          submitted_at: string
        }
        Insert: {
          id?: string
          invitee_id?: string | null
          name: string
          email?: string
          attending: string
          message?: string
          submitted_at?: string
        }
        Update: {
          id?: string
          invitee_id?: string | null
          name?: string
          email?: string
          attending?: string
          message?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvp_responses_invitee_id_fkey"
            columns: ["invitee_id"]
            isOneToOne: false
            referencedRelation: "invitees"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
