import { GridApi, ServerSideTransaction } from "ag-grid-community";

export function handleAddTransaction(gridApi: GridApi, newData: any) {
    const transaction: ServerSideTransaction = {
      add: [newData],
      addIndex: 0,
    };
    gridApi?.applyServerSideTransaction(transaction);
  }

export function handleUpdateTransaction(gridApi: GridApi, newData: any) {
    const transaction: ServerSideTransaction = {
      update: [newData],
    };
    gridApi?.applyServerSideTransaction(transaction);
  }

export function handleDeleteTransaction(gridApi: GridApi, newData: any) {
    const transaction: ServerSideTransaction = {
      remove: [{id: newData.id}],
    };
    gridApi?.applyServerSideTransaction(transaction);
  }