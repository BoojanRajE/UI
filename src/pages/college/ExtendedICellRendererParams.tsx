import { ICellRendererParams } from "ag-grid-community";
import { CollegeType } from "./CollegeType";

export interface ExtendedICellRendererParams extends ICellRendererParams {
  setIsEdit: any;
  handleUpdate(data: CollegeType): void;
  handleDelete(id: string): void;
}
