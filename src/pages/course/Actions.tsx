import { IconButton, Tooltip } from '@mui/material';
import { ICellRendererParams } from 'ag-grid-community';
import { MdModeEdit, MdDelete } from 'react-icons/md';
import { BiCopy } from 'react-icons/bi';
import { FaRegCopy } from 'react-icons/fa';
import FileImport from '../courseDetails/FileImport';
import { AiOutlineFileAdd } from 'react-icons/ai';
import { useState } from 'react';
// import Actions from './Actions';
// import FileImport from './FileImport';

export function Actions(row: ExtendedICellRendererParams) {
  //const {suppliers} = useRoleAuth(); need to uncomment (NTU)
  //
  const [gridParams, setGridParams] = useState<any>(row);

  return (
    <div className="flex justify-between max-w-xs">
      <FileImport props={gridParams} />

      <Tooltip title="Add Assessment">
        <IconButton onClick={() => row.getCourseDetails(row, 'paper')}>
          <AiOutlineFileAdd className={'float-right text-blue-600'} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Copy">
        <IconButton onClick={() => row.handleCopy(row.data)}>
          <FaRegCopy className="float-right text-blue-600" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Update">
        <IconButton onClick={() => row.handleUpdate(row.data)}>
          <MdModeEdit className="float-right text-blue-600" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete">
        <IconButton onClick={() => row.handleDelete(row.data)}>
          <MdDelete className="float-right text-red-600" />
        </IconButton>
      </Tooltip>
    </div>
  );
}

export interface ExtendedICellRendererParams extends ICellRendererParams {
  handleUpdate(data: any): void;
  handleDelete(id: string): void;
  handleCopy(id: string): void;
  getCourseDetails: (
    row: ExtendedICellRendererParams,
    scrollType: string
  ) => void;
}

// export const ActionAndImport = (row: ExtendedICellRendererParams) => {
//   // const { data, handleUpdate, handleDelete, handleCopy, getCourseDetails } = params;

//   return (
//     <>
//       <FileImport
//         props={row}
//       />
//       <Actions
//         row={row}
//       />
//     </>
//   );
// };
