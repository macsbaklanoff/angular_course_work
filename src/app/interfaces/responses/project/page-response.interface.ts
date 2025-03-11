export interface IPageResponse<TItem> extends IPaginationData {
  items: TItem[];
}
export interface IPaginationData {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  total: number;
}
