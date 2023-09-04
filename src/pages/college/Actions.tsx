import { IconButton } from "@mui/material";
import { MdModeEdit, MdDelete } from "react-icons/md";
import { ExtendedICellRendererParams } from "./ExtendedICellRendererParams";

export function Actions(row: ExtendedICellRendererParams) {
  //const {suppliers} = useRoleAuth(); need to uncomment (NTU)
  return (
    <div className="">
      <IconButton
        onClick={() => {
          row.setIsEdit(true);
          row.handleUpdate(row.data);
        }}
      >
        <MdModeEdit className="float-right text-blue-600" />
      </IconButton>

      <IconButton onClick={() => row.handleDelete(row.data)}>
        <MdDelete className="float-right text-red-600" />
      </IconButton>
    </div>
  );
}
