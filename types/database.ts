export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      application_interests: {
        Row: {
          application_id: string;
          interest_id: number;
        };
        ComputedFields: never;
        Insert: {
          application_id: string;
          interest_id: number;
        };
        Update: {
          application_id?: string;
          interest_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'application_interests_application_id_fkey';
            columns: ['application_id'];
            isOneToOne: false;
            referencedRelation: 'applications';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'application_interests_interest_id_fkey';
            columns: ['interest_id'];
            isOneToOne: false;
            referencedRelation: 'membership_interests';
            referencedColumns: ['id'];
          },
        ];
      };
      application_reviews: {
        Row: {
          application_id: string;
          created_at: string;
          decision: Database['public']['Enums']['review_decision'];
          id: string;
          reason: string;
          reviewer_name: string;
          waiver_decision:
            | Database['public']['Enums']['review_decision']
            | null;
          waiver_note: string | null;
        };
        ComputedFields: never;
        Insert: {
          application_id: string;
          created_at?: string;
          decision: Database['public']['Enums']['review_decision'];
          id?: string;
          reason: string;
          reviewer_name: string;
          waiver_decision?:
            | Database['public']['Enums']['review_decision']
            | null;
          waiver_note?: string | null;
        };
        Update: {
          application_id?: string;
          created_at?: string;
          decision?: Database['public']['Enums']['review_decision'];
          id?: string;
          reason?: string;
          reviewer_name?: string;
          waiver_decision?:
            | Database['public']['Enums']['review_decision']
            | null;
          waiver_note?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'application_reviews_application_id_fkey';
            columns: ['application_id'];
            isOneToOne: false;
            referencedRelation: 'applications';
            referencedColumns: ['id'];
          },
        ];
      };
      applications: {
        Row: {
          created_at: string;
          finalized_at: string | null;
          id: string;
          status: Database['public']['Enums']['application_status'];
          type: Database['public']['Enums']['application_type'];
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          finalized_at?: string | null;
          id?: string;
          status?: Database['public']['Enums']['application_status'];
          type: Database['public']['Enums']['application_type'];
          user_id: string;
        };
        Update: {
          created_at?: string;
          finalized_at?: string | null;
          id?: string;
          status?: Database['public']['Enums']['application_status'];
          type?: Database['public']['Enums']['application_type'];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'applications_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      individual_application_details: {
        Row: {
          application_id: string;
          fee_waiver: boolean;
          fee_waiver_reason: string | null;
          reason: string;
        };
        ComputedFields: never;
        Insert: {
          application_id: string;
          fee_waiver?: boolean;
          fee_waiver_reason?: string | null;
          reason: string;
        };
        Update: {
          application_id?: string;
          fee_waiver?: boolean;
          fee_waiver_reason?: string | null;
          reason?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'individual_application_details_application_id_fkey';
            columns: ['application_id'];
            isOneToOne: true;
            referencedRelation: 'applications';
            referencedColumns: ['id'];
          },
        ];
      };
      individual_profiles: {
        Row: {
          name: string;
          phone_num: string;
          phone_type: Database['public']['Enums']['phone_type'];
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          name: string;
          phone_num: string;
          phone_type: Database['public']['Enums']['phone_type'];
          user_id: string;
        };
        Update: {
          name?: string;
          phone_num?: string;
          phone_type?: Database['public']['Enums']['phone_type'];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'individual_profiles_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      membership_interests: {
        Row: {
          id: number;
          name: string;
        };
        ComputedFields: never;
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      organization_application_details: {
        Row: {
          application_id: string;
          org_services: string;
          reason: string;
        };
        ComputedFields: never;
        Insert: {
          application_id: string;
          org_services: string;
          reason: string;
        };
        Update: {
          application_id?: string;
          org_services?: string;
          reason?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'organization_application_details_application_id_fkey';
            columns: ['application_id'];
            isOneToOne: true;
            referencedRelation: 'applications';
            referencedColumns: ['id'];
          },
        ];
      };
      organization_profiles: {
        Row: {
          org_name: string;
          org_rep_email: string | null;
          org_rep_name: string;
          phone_num: string;
          phone_type: Database['public']['Enums']['phone_type'];
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          org_name: string;
          org_rep_email?: string | null;
          org_rep_name: string;
          phone_num: string;
          phone_type: Database['public']['Enums']['phone_type'];
          user_id: string;
        };
        Update: {
          org_name?: string;
          org_rep_email?: string | null;
          org_rep_name?: string;
          phone_num?: string;
          phone_type?: Database['public']['Enums']['phone_type'];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'organization_profiles_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      payments: {
        Row: {
          amount: number;
          application_id: string | null;
          created_at: string;
          currency: string;
          id: string;
          status: Database['public']['Enums']['payment_transaction_status'];
          stripe_payment_intent_id: string | null;
          stripe_session_id: string | null;
          updated_at: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          amount: number;
          application_id?: string | null;
          created_at?: string;
          currency: string;
          id?: string;
          status?: Database['public']['Enums']['payment_transaction_status'];
          stripe_payment_intent_id?: string | null;
          stripe_session_id?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          application_id?: string | null;
          created_at?: string;
          currency?: string;
          id?: string;
          status?: Database['public']['Enums']['payment_transaction_status'];
          stripe_payment_intent_id?: string | null;
          stripe_session_id?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'payments_application_id_fkey';
            columns: ['application_id'];
            isOneToOne: false;
            referencedRelation: 'applications';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'payments_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user_addresses: {
        Row: {
          city: string;
          country: string;
          mailing_address: string;
          postal_code: string;
          province: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          city: string;
          country: string;
          mailing_address: string;
          postal_code: string;
          province: string;
          user_id: string;
        };
        Update: {
          city?: string;
          country?: string;
          mailing_address?: string;
          postal_code?: string;
          province?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_addresses_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          role: Database['public']['Enums']['user_role'];
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          role: Database['public']['Enums']['user_role'];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          role?: Database['public']['Enums']['user_role'];
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_individual_application: {
        Args: {
          p_city: string;
          p_country: string;
          p_fee_waiver?: boolean;
          p_fee_waiver_reason: string;
          p_interests: string[];
          p_mailing_address: string;
          p_name: string;
          p_phone_num: string;
          p_phone_type: Database['public']['Enums']['phone_type'];
          p_postal_code: string;
          p_province: string;
          p_reason: string;
          p_user_id: string;
        };
        Returns: undefined;
      };
      create_organization_application: {
        Args: {
          p_city: string;
          p_country: string;
          p_interests: string[];
          p_mailing_address: string;
          p_org_name: string;
          p_org_rep_email: string;
          p_org_rep_name: string;
          p_org_services: string;
          p_phone_num: string;
          p_phone_type: Database['public']['Enums']['phone_type'];
          p_postal_code: string;
          p_province: string;
          p_reason: string;
          p_user_id: string;
        };
        Returns: Json;
      };
      update_individual_membership_profile: {
        Args: {
          p_city: string;
          p_country: string;
          p_interests: string[];
          p_mailing_address: string;
          p_name: string;
          p_phone_num: string;
          p_phone_type: Database['public']['Enums']['phone_type'];
          p_postal_code: string;
          p_province: string;
          p_reason: string;
          p_user_id: string;
        };
        Returns: undefined;
      };
      update_organization_membership_profile: {
        Args: {
          p_city: string;
          p_country: string;
          p_interests: string[];
          p_mailing_address: string;
          p_org_name: string;
          p_org_rep_email: string;
          p_org_rep_name: string;
          p_org_services: string;
          p_phone_num: string;
          p_phone_type: Database['public']['Enums']['phone_type'];
          p_postal_code: string;
          p_province: string;
          p_reason: string;
          p_user_id: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      application_status:
        | 'to_review'
        | 'payment_pending'
        | 'active'
        | 'expired'
        | 'conflict'
        | 'rejected'
        | 'expires_soon';
      application_type: 'individual' | 'organization';
      payment_transaction_status:
        | 'requires_payment_method'
        | 'requires_confirmation'
        | 'requires_action'
        | 'processing'
        | 'succeeded'
        | 'canceled'
        | 'failed';
      phone_type: 'home' | 'cell';
      review_decision: 'approve' | 'reject';
      user_role: 'admin' | 'individual' | 'organization';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      application_status: [
        'to_review',
        'payment_pending',
        'active',
        'expired',
        'conflict',
        'rejected',
        'expires_soon',
      ],
      application_type: ['individual', 'organization'],
      payment_transaction_status: [
        'requires_payment_method',
        'requires_confirmation',
        'requires_action',
        'processing',
        'succeeded',
        'canceled',
        'failed',
      ],
      phone_type: ['home', 'cell'],
      review_decision: ['approve', 'reject'],
      user_role: ['admin', 'individual', 'organization'],
    },
  },
} as const;
