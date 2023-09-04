import { IconButton } from "@mui/material";
import { MdModeEdit, MdDelete } from "react-icons/md";

export function Actions({ params, handleUpdate, handleDelete }: any) {
  return (
    <div className="">
      <IconButton onClick={() => handleUpdate(params)}>
        <MdModeEdit className="float-right text-blue-600" />
      </IconButton>

      <IconButton onClick={() => handleDelete(params)}>
        <MdDelete className="float-right text-red-600" />
      </IconButton>
    </div>
  );
}
