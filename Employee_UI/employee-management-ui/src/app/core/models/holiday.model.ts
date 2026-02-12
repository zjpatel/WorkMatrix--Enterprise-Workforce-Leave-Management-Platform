export interface Holiday {
  id?: number;
  holidayId?: number;
  holidayName: string;
  holidayDate: string; // yyyy-MM-dd format
  holidayType: 'NATIONAL' | 'FESTIVAL' | 'COMPANY';
  optional: boolean;
  description?: string;
}

export interface CreateHolidayRequest {
  holidayName: string;
  holidayDate: string;
  holidayType: 'NATIONAL' | 'FESTIVAL' | 'COMPANY';
  optional: boolean;
  description?: string;
}

export interface UpdateHolidayRequest extends CreateHolidayRequest {}

export interface HolidayResponse {
  id?: number;
  holidayId?: number;
  holidayName: string;
  holidayDate: string;
  holidayType: 'NATIONAL' | 'FESTIVAL' | 'COMPANY';
  optional: boolean;
  description?: string;
}
