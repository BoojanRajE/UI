import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-grid.css";
import { GridOptions } from "ag-grid-community";

const MasterGrid = (props: any) => {
  return (
    <div className="ag-theme-alpine w-full px-3 py-4 mb-14">
      <AgGridReact
        {...props}
        rowModelType={"serverSide"}
        suppressServerSideInfiniteScroll={false}
        animateRows={true}
        pagination={true}
        paginationPageSize={25}
        rowSelection="single"
        overlayNoRowsTemplate="No rows to show"
        domLayout={"autoHeight"}
      />
    </div>
  );
};

export default MasterGrid;
