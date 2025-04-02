import { Request } from 'express';

export interface CreateContactDTO {
  name: string;
  gender: 'male' | 'female';
  phone: string;
  email?: string;
  evangelist_name: string;
  first_visit_date: string;
}

export interface UpdateContactDTO {
  name?: string;
  gender?: 'male' | 'female';
  phone?: string;
  email?: string;
  evangelist_name?: string;
  first_visit_date?: string;
}

export interface GetContactByIdRequest extends Request {
  params: {
    id: string;
  };
}

export interface GetContactsByEvangelistRequest extends Request {
  params: {
    evangelistName: string;
  };
}

export interface CreateContactInput {
  name: string;
  gender: 'male' | 'female';
  phone: string;
  email?: string;
  evangelist_name: string;
  first_visit_date: Date;
}

export interface UpdateContactInput {
  name?: string;
  gender?: 'male' | 'female';
  phone?: string;
  email?: string;
  evangelist_name?: string;
  first_visit_date?: Date;
}
/**
 * Interface for dashboard analytics data
 */
export interface DashboardAnalytics {
  totalContacts: number;
  attendedAtLeastOnce: {
    count: number;
    percentage: number;
  };
  stillAttending: {
    count: number;
    percentage: number;
  };
  weeklyAttendanceTrend: Array<{
    week: number;
    count: number;
  }>;
  genderDistribution: {
    male: {
      count: number;
      percentage: number;
    };
    female: {
      count: number;
      percentage: number;
    };
  };
  retentionBreakdown: {
    stillAttending: {
      count: number;
      percentage: number;
    };
    dropOut: {
      count: number;
      percentage: number;
    };
  };
}