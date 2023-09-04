import { GridOptions } from 'ag-grid-community';
import { ColumnApi } from 'ag-grid-community';
import { ColDef, GridApi } from 'ag-grid-community';

export interface ServerSideGridProps {
  rowDataUrl: string;
  columnDefs: ColDef[];
  debouncedSearchQuery?: string;
  gridApi: GridApi | undefined;
  columnApi: ColumnApi | undefined;
  setGridApi: React.Dispatch<React.SetStateAction<GridApi<any> | undefined>>;
  setColumnApi: React.Dispatch<React.SetStateAction<ColumnApi | undefined>>;
  gridOptions?: GridOptions;
  masterDetail?: boolean;
  detailRowHeight?: number;
  detailCellRendererParams?: any;
  // rowBuffer: number;
  // cacheBlockSize: number;
}
