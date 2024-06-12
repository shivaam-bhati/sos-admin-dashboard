
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import GuardService from '../services/GuardService';
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

export default function GuardsLayout() {
    let emptyGuard = {
        _id: null,
        firstName: '',
        lastName: '',
        image: null,
        gender: '',
        email: '',
        mobileNo: '',
        dob: new Date(),
        isActive: false,
    };

    const [guards, setGuards] = useState(null);
    const [guardDialog, setGuardDialog] = useState(false);
    const [deleteGuardDialog, setDeleteGuardDialog] = useState(false);
    const [deleteGuardsDialog, setDeleteGuardsDialog] = useState(false);
    const [guard, setGuard] = useState(emptyGuard);
    const [selectedGuards, setSelectedGuards] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);





    const [genders] = useState([
      { name: 'Male'},
      { name: 'Female'}
  ]);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    gender:  { value: null, matchMode: FilterMatchMode.IN },
    status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
});


   

    useEffect(() => {

      const getAllGuard=async()=>{
        try {
          const allGuards = await GuardService.getAll();
              console.log("guards>>>",allGuards)
              setGuards(allGuards.data.guards)
        } catch (error) {
          console.log(error)
        }
      }

      getAllGuard();

    }, []);


    const openNew = () => {
        setGuard(emptyGuard);
        setSubmitted(false);
        setGuardDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setGuardDialog(false);
    };

    const genderBodyTemplate = (rowData) => {
      return (
          <div className="flex align-items-center gap-2">
              <span>{rowData.gender}</span>
          </div>
      );
  };

  const genderFilterTemplate = (options) => {
    //return <Dropdown value={options.name} options={genders} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={genderItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
      return (
          <React.Fragment>
              <div className="mb-3 font-bold">Select Gender</div>
              <MultiSelect value={options.value} options={genders} itemTemplate={genderItemTemplate}  onChange={(e) => {
                console.log("e>>>",e)
                setGlobalFilter(e.value)
                setFilters(e.value)
                return options.filterCallback(e.value);
              }} optionLabel="name" placeholder="Any" className="p-column-filter" />
          </React.Fragment>
      );
  };

  const genderItemTemplate = (option) => {
      return (
          <div className="flex align-items-center gap-2">
              <span>{option.name}</span>
          </div>
      );
  };

    const hideDeleteGuardDialog = () => {
        setDeleteGuardDialog(false);
    };

    const hideDeleteGuardsDialog = () => {
        setDeleteGuardsDialog(false);
    };

    const saveGuard = async() => {
        try {
            setSubmitted(true);
            if (guard.firstName.trim()) {
                let _guards = [...guards];
                let _guard = { ...guard };

                if (guard._id) {
                    const index = findIndexById(guard._id);
                    await GuardService.update(_guard,guard._id);
                     _guards[index] = _guard;
                } else {
                    await GuardService.create(_guard);
                    _guards.push(_guard);
                }
    
                setGuards(_guards);
                setGuardDialog(false);
                setGuard(emptyGuard);
            }  
        } catch (error) {
            console.log(error)
        }
    };

    const editGuard = (guard) => {
        setGuard({ ...guard });
        setGuardDialog(true);
    };

    const confirmDeleteGuard = (guard) => {
        setGuard(guard);
        setDeleteGuardDialog(true);
    };

    const deleteGuard = async() => {
        try {
            await GuardService.delete(guard._id);
            let _guards = guards.filter((val) => val._id !== guard._id);
            setGuards(_guards);
            setDeleteGuardDialog(false);
            setGuard(emptyGuard);
        } catch (error) {
            console.log(error)
        }
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < guards.length; i++) {
            if (guards[i]._id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteGuardsDialog(true);
    };

    const deleteSelectedGuards = () => {
        let _guards = guards.filter((val) => !selectedGuards.includes(val));

        setGuards(_guards);
        setDeleteGuardsDialog(false);
        setSelectedGuards(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Guards Deleted', life: 3000 });
    };

    const onCategoryChange = (e) => {
        let _guard = { ...guard };

        _guard['gender'] = e.value;
        setGuard(_guard);
    };

    const onInputChange = (e, name) => {
        console.log("e, name>>>",e, name)
        const val = (e.target && e.target.value) || '';
        let _guard = { ...guard };

        _guard[`${name}`] = val;

        setGuard(_guard);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _guard = { ...guard };

        _guard[`${name}`] = val;

        setGuard(_guard);
    };


    const dateTemplate = (date) => {
        if (date.day > 10 && date.day < 15) {
            return (
                <strong style={{ textDecoration: 'line-through' }}>{date.day}</strong>
            );
        }

        return date.day;
    }

    const status = [
        { name: 'Active', value: true },
        { name: 'Deactivate', value: false }
    ];

    const onChangeStatus = ()=>{
        let _guard = { ...guard };
        _guard['isActive'] = !_guard['isActive'];
        setGuard(_guard);
        
    }

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedGuards || !selectedGuards.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };


    const statusBodyTemplate = (rowData) => {
      if(rowData.isActive)
        return <Tag value={rowData.isActive} severity={getSeverity(rowData)}>Active</Tag>;
        else
        return <Tag value={rowData.isActive} severity={getSeverity(rowData)}>Deactivated</Tag>;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editGuard(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteGuard(rowData)} />
            </React.Fragment>
        );
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
            <h4 className="m-0">Manage Guards</h4>
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const guardDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveGuard} />
        </React.Fragment>
    );
    const deleteGuardDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteGuardDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteGuard} />
        </React.Fragment>
    );
    const deleteGuardsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteGuardsDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedGuards} />
        </React.Fragment>
    );



    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={guards} onSelectionChange={(e) => setSelectedGuards(e.value)} scrollable  selection={selectedGuards} loading={loading} paginator showGridlines rows={10} dataKey="_id" 
                    filters={filters} globalFilterFields={['firstName', 'lastName', 'email', 'isActive', 'gender', 'gender.name']} header={header}
                    emptyMessage="No customers found." rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} guards" globalFilter={globalFilter}>
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="firstName" header="First Name" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="lastName" header="Last Name" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="email" header="Email" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="mobileNo" header="Mobile No." sortable style={{ minWidth: '16rem' }}></Column>
                    <Column header="gender" body={genderBodyTemplate} sortable sortField="gender" filter filterField="gender"
                    showFilterMatchModes={false} filterElement={genderFilterTemplate} filterMenuStyle={{ width: '14rem' }} style={{ width: '25%' }} ></Column>
                    <Column frozen alignFrozen="right"  field="isActive" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                    <Column frozen alignFrozen="right" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={guardDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Guard Details" modal className="p-fluid" footer={guardDialogFooter} onHide={hideDialog}>
               
                <div style={{ marginBottom: '20px' }} className="field">
                    <label htmlFor="firstName" className="font-bold">
                        First Name
                    </label>
                    <InputText id="firstName" value={guard.firstName} onChange={(e) => onInputChange(e, 'firstName')} required autoFocus className={classNames({ 'p-invalid': submitted && !guard.firstName })} />
                    {submitted && !guard.firstName && <small className="p-error">Name is required.</small>}
                </div>
                <div style={{ marginBottom: '20px' }} className="field">
                    <label htmlFor="lastName" className="font-bold">
                        Last Name
                    </label>
                    <InputText id="lastName" value={guard.lastName} onChange={(e) => onInputChange(e, 'lastName')} required  className={classNames({ 'p-invalid': submitted && !guard.lastName })} />
                    {submitted && !guard.lastName && <small className="p-error">Name is required.</small>}
                </div>
               

                <div style={{ marginBottom: '20px' }} className="field">
                    <label className="mb-3 font-bold">Gender</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="male" name="gender" value="Male" onChange={onCategoryChange} checked={guard.gender === 'Male'} />
                            <label htmlFor="male">Male</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="female" name="gender" value="Female" onChange={onCategoryChange} checked={guard.gender === 'Female'} />
                            <label htmlFor="female">Female</label>
                        </div>
                        
                    </div>
                </div>

                    <div style={{ marginBottom: '20px' }} className="field col">
                        <label htmlFor="mobileNo" className="font-bold">
                            Mobile No.
                        </label>
                        <InputNumber id="mobileNo" value={guard.mobileNo} onValueChange={(e) => onInputNumberChange(e, 'mobileNo')} maxLength='10'  useGrouping={false} required className={classNames({ 'p-invalid': submitted && !guard.mobileNo })}/>
                        {submitted && !guard.mobileNo && <small className="p-error">Mobile No. is required.</small>}
                </div>

                <div style={{ marginBottom: '20px' }} className="field col">
                        <label htmlFor="email" className="font-bold">
                            Email
                        </label>
                        <InputText id="email" value={guard.email} onChange={(e) => onInputChange(e, 'email')} required className={classNames({ 'p-invalid': submitted && !guard.email })} />
                    {submitted && !guard.email && <small className="p-error">Email is required.</small>}
                </div>


                <div style={{ marginBottom: '20px' }} className="field col">
                        <label htmlFor="dob" className="font-bold">
                            Date of Birth
                        </label>
                        <Calendar id="dob" value={new Date(guard.dob)} onChange={(e) => onInputChange(e, 'dob')} required className={classNames({ 'p-invalid': submitted && !guard.dob })} />
                    {submitted && !guard.dob && <small className="p-error"> Date of Birth is required.</small>}
                </div>

                <div style={{ marginBottom: '20px' }} className="field col">
                        <label htmlFor="isActive" className="font-bold">
                            Status
                        </label>
                        <Dropdown value={guard.isActive} onChange={() => onChangeStatus()} options={status} optionLabel="name" 
                placeholder="Select Status" className="w-full md:w-14rem" />
                </div>
                

                <div style={{ marginBottom: '20px' }} className="field col">
                        <label htmlFor="password" className="font-bold">
                         Password
                        </label>
                        <Password value={guard.password} onChange={(e) =>  onInputChange(e, 'password')} feedback={false} toggleMask tabIndex={1} />
                </div>

            </Dialog>

            <Dialog visible={deleteGuardDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteGuardDialogFooter} onHide={hideDeleteGuardDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {guard && (
                        <span>
                            Are you sure you want to delete <b>{guard.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteGuardsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteGuardsDialogFooter} onHide={hideDeleteGuardsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {guard && <span>Are you sure you want to delete the selected guards?</span>}
                </div>
            </Dialog>
        </div>
    );
}
        