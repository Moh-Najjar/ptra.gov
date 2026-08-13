/** Standard API envelope used by the Customs backend. */
export interface ApiResponse<T> {
  message: string;
  culture: string;
  data: T;
}
