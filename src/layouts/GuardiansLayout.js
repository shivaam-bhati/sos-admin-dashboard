
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import GuardianService from '../services/GuardianService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';

import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import { Password } from 'primereact/password';

export default function GuardiansLayout() {
    let emptyGuardian = {
        _id: null,
        fullName: '',
        mobileNo: '',
        isActive: false,
    };

    const [guardians, setGuardians] = useState(null);
    const [guardianDialog, setGuardianDialog] = useState(false);
    const [deleteGuardianDialog, setDeleteGuardianDialog] = useState(false);
    const [deleteGuardiansDialog, setDeleteGuardiansDialog] = useState(false);
    const [guardian, setGuardian] = useState(emptyGuardian);
    const [selectedGuardians, setSelectedGuardians] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);





  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    fullName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
});


   

    useEffect(() => {

      const getAllGuardian=async()=>{
        try {
          const allGuardians = await GuardianService.getAll();
              setGuardians(allGuardians.data.guardians)
        } catch (error) {
          console.log(error)
        }
      }

      getAllGuardian();

    }, []);


    const openNew = () => {
        setGuardian(emptyGuardian);
        setSubmitted(false);
        setGuardianDialog(true);
    };







    const status = [
        { name: 'Active', value: true },
        { name: 'Deactivate', value: false }
    ];

    const onChangeStatus = ()=>{
        let _guardian = { ...guardian };
        _guardian['isActive'] = !_guardian['isActive'];
        setGuardian(_guardian);
        
    }



    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };




    const initFilters = () => {
      setFilters({
          global: { value: null, matchMode: FilterMatchMode.CONTAINS },
          name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
          'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
          gender: { value: null, matchMode: FilterMatchMode.IN },
          date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
          balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
          status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
          activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
          verified: { value: null, matchMode: FilterMatchMode.EQUALS }
      });
      setGlobalFilterValue('');
      
  };

    const clearFilter = () => {
      initFilters();
  };

  const statusBodyTemplate = (rowData) => {
    if(rowData.isActive)
      return <Tag value={rowData.isActive} severity={getSeverity(rowData)}>Active</Tag>;
      else
      return <Tag value={rowData.isActive} severity={getSeverity(rowData)}>Deactivated</Tag>;
  };

  const exportCSV = () => {
    dt.current.exportCSV();
};





  const getSeverity = (guard) => {
    switch (guard.isActive) {
        case true:
            return 'success';

        case false:
            return 'danger';

        default:
            return null;
    }
};



    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Guardians</h4>
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );


    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
            <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>
                <DataTable ref={dt} value={guardians} onSelectionChange={(e) => setSelectedGuardians(e.value)} scrollable  selection={selectedGuardians} loading={loading} paginator showGridlines rows={10} dataKey="_id" 
                    filters={filters} globalFilterFields={['firstName', 'lastName', 'email', 'isActive', 'gender', 'gender.name']} header={header}
                    emptyMessage="No customers found." rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} guardians" globalFilter={globalFilter}>
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="fullName" header="Full Name" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="mobileNo" header="Mobile No." sortable style={{ minWidth: '16rem' }}></Column>
                    <Column frozen alignFrozen="right"  field="isActive" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

         
        </div>
    );
}
        