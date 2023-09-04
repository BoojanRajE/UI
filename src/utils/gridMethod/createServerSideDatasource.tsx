import { IServerSideDatasource } from 'ag-grid-community';
import { AppDispatch } from '../../reduxStore/Store';
import { PaginationProp } from '../globalInterface/GlobalInterfaces';
import * as disciplineRoute from '../../reduxStore/route/disciplineRoute';

export const createServerSideDatasource = (
  dispatch: AppDispatch,
  getData: any,
  setDataSource: React.Dispatch<React.SetStateAction<undefined>>,
  setParams: React.Dispatch<React.SetStateAction<undefined>>,
  search?: any
) => {
  return {
    getRows: (params: any) => {
      const { startRow, endRow, filterModel, sortModel } = params.request;
      setParams(params);

      const data: any = {
        rowData: {
          startRow: `${startRow}`,
          endRow: `${endRow}`,
        },
      };

      if (search) {
        data.search = search;
      }

      if (Object.keys(filterModel)?.length > 0) {
        data.filterModel = filterModel;
      }

      if (sortModel?.length > 0) {
        data.sortData = sortModel;
      }
      setDataSource(data);

      dispatch(getData(data, params));
    },
  };
};
