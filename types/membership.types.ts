import type { Database } from "@/types/database";

export type MemberDashboardData = {
    name: string;
    status: Database['public']['Enums']['application_status'] | null;
    type: Database['public']['Enums']['application_type'] | null;
    interests: string[];
    reason: string;
    contact: {
        email: string;
        phone: string;
        address: string;
    };
    dateReceived: string;
    dateFinalized?: string;
};