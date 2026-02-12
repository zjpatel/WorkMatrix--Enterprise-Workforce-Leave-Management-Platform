import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Holiday, CreateHolidayRequest, UpdateHolidayRequest, HolidayResponse } from '../models/holiday.model';

@Injectable({ providedIn: 'root' })
export class HolidayService {

  private BASE_URL = 'http://localhost:8080/api/holidays';

  constructor(private http: HttpClient) {}

  // ============================
  // GET HOLIDAYS BY YEAR
  // ============================
  getHolidaysByYear(year: number): Observable<Holiday[]> {
    return this.http.get<Holiday[]>(`${this.BASE_URL}/year/${year}`);
  }

  // ============================
  // CREATE HOLIDAY (ADMIN ONLY)
  // ============================
  createHoliday(data: CreateHolidayRequest): Observable<HolidayResponse> {
    return this.http.post<HolidayResponse>(this.BASE_URL, data);
  }

  // ============================
  // UPDATE HOLIDAY (ADMIN ONLY)
  // ============================
  updateHoliday(id: number, data: UpdateHolidayRequest): Observable<HolidayResponse> {
    return this.http.put<HolidayResponse>(`${this.BASE_URL}/${id}`, data);
  }

  // ============================
  // DELETE HOLIDAY (ADMIN ONLY)
  // ============================
  deleteHoliday(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${id}`);
  }

   getHolidaysByMonth(year: number, month: number): Observable<Holiday[]> {
    return this.http.get<Holiday[]>(
      `${this.BASE_URL}/year/${year}/month/${month}`
    );
  }
}
