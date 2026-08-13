export interface PageDetailRecord {
  id: number;
  vesselName: string;
  imoNumber: string;
  departureDate: string;
  departureTime: string;
  datePilotOnboard: string;
  timePilotOnboard: string;
  datePilotCompleted: string;
  timePilotCompleted: string;
  movementFrom: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface PaginatedPageDetails {
  items: PageDetailRecord[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface PageDetailFormValues {
  vesselName: string;
  imoNumber: string;
  departureDate: string;
  departureTime: string;
  datePilotOnboard: string;
  timePilotOnboard: string;
  datePilotCompleted: string;
  timePilotCompleted: string;
  movementFrom: string;
}

export const createEmptyPageDetailFormValues = (): PageDetailFormValues => ({
  vesselName: '',
  imoNumber: '',
  departureDate: '',
  departureTime: '',
  datePilotOnboard: '',
  timePilotOnboard: '',
  datePilotCompleted: '',
  timePilotCompleted: '',
  movementFrom: '',
});

export const mapPageDetailToFormValues = (record: PageDetailRecord): PageDetailFormValues => ({
  vesselName: record.vesselName,
  imoNumber: record.imoNumber,
  departureDate: record.departureDate,
  departureTime: record.departureTime,
  datePilotOnboard: record.datePilotOnboard,
  timePilotOnboard: record.timePilotOnboard,
  datePilotCompleted: record.datePilotCompleted,
  timePilotCompleted: record.timePilotCompleted,
  movementFrom: record.movementFrom,
});

export const DEFAULT_PAGE_DETAILS_PAGE_SIZE = 10;
