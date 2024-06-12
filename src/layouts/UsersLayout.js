
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import UserService from '../services/UserService';
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

export default function UsersLayout() {
    let emptyUser = {
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

    const [users, setUsers] = useState(null);
    const [userDialog, setUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
    const [user, setUser] = useState(emptyUser);
    const [selectedUsers, setSelectedUsers] = useState(null);
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

      const getAllUser=async()=>{
        try {
          const allUsers = await UserService.getAll();
              console.log("users>>>",allUsers)
              setUsers(allUsers.data.users)
        } catch (error) {
          console.log(error)
        }
      }

      getAllUser();

    }, []);


    const openNew = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
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

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    };

    const hideDeleteUsersDialog = () => {
        setDeleteUsersDialog(false);
    };

    const saveUser = async() => {
        try {
            setSubmitted(true);
            if (user.firstName.trim()) {
                let _users = [...users];
                let _user = { ...user };

                if (user._id) {
                    const index = findIndexById(user._id);
                    await UserService.update(_user,user._id);
                     _users[index] = _user;
                } else {
                    await UserService.create(_user);
                    _users.push(_user);
                }
    
                setUsers(_users);
                setUserDialog(false);
                setUser(emptyUser);
            }  
        } catch (error) {
            console.log(error)
        }
    };

    const editUser = (user) => {
        setUser({ ...user });
        setUserDialog(true);
    };

    const confirmDeleteUser = (user) => {
        setUser(user);
        setDeleteUserDialog(true);
    };

    const deleteUser = async() => {
        try {
            await UserService.delete(user._id);
            let _users = users.filter((val) => val._id !== user._id);
            setUsers(_users);
            setDeleteUserDialog(false);
            setUser(emptyUser);
        } catch (error) {
            console.log(error)
        }
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < users.length; i++) {
            if (users[i]._id === id) {
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
        setDeleteUsersDialog(true);
    };

    const deleteSelectedUsers = () => {
        let _users = users.filter((val) => !selectedUsers.includes(val));

        setUsers(_users);
        setDeleteUsersDialog(false);
        setSelectedUsers(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
    };

    const onCategoryChange = (e) => {
        let _user = { ...user };

        _user['gender'] = e.value;
        setUser(_user);
    };

    const onInputChange = (e, name) => {
        console.log("e, name>>>",e, name)
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };

        _user[`${name}`] = val;

        setUser(_user);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _user = { ...user };

        _user[`${name}`] = val;

        setUser(_user);
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
        let _user = { ...user };
        _user['isActive'] = !_user['isActive'];
        setUser(_user);
        
    }

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUsers || !selectedUsers.length} />
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
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editUser(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteUser(rowData)} />
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

    const getSeverity = (user) => {
        switch (user.isActive) {
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
            <h4 className="m-0">Manage Users</h4>
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const userDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveUser} />
        </React.Fragment>
    );
    const deleteUserDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUserDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteUser} />
        </React.Fragment>
    );
    const deleteUsersDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUsersDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedUsers} />
        </React.Fragment>
    );



    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={users} onSelectionChange={(e) => setSelectedUsers(e.value)} scrollable  selection={selectedUsers} loading={loading} paginator showGridlines rows={10} dataKey="_id" 
                    filters={filters} globalFilterFields={['firstName', 'lastName', 'email', 'isActive', 'gender', 'gender.name']} header={header}
                    emptyMessage="No customers found." rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users" globalFilter={globalFilter}>
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

            <Dialog visible={userDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="User Details" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
               
                <div style={{ marginBottom: '20px' }} className="field">
                    <label htmlFor="firstName" className="font-bold">
                        First Name
                    </label>
                    <InputText id="firstName" value={user.firstName} onChange={(e) => onInputChange(e, 'firstName')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.firstName })} />
                    {submitted && !user.firstName && <small className="p-error">Name is required.</small>}
                </div>
                <div style={{ marginBottom: '20px' }} className="field">
                    <label htmlFor="lastName" className="font-bold">
                        Last Name
                    </label>
                    <InputText id="lastName" value={user.lastName} onChange={(e) => onInputChange(e, 'lastName')} required  className={classNames({ 'p-invalid': submitted && !user.lastName })} />
                    {submitted && !user.lastName && <small className="p-error">Name is required.</small>}
                </div>
               

                <div style={{ marginBottom: '20px' }} className="field">
                    <label className="mb-3 font-bold">Gender</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="male" name="gender" value="Male" onChange={onCategoryChange} checked={user.gender === 'Male'} />
                            <label htmlFor="male">Male</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="female" name="gender" value="Female" onChange={onCategoryChange} checked={user.gender === 'Female'} />
                            <label htmlFor="female">Female</label>
                        </div>
                        
                    </div>
                </div>

                    <div style={{ marginBottom: '20px' }} className="field col">
                        <label htmlFor="mobileNo" className="font-bold">
                            Mobile No.
                        </label>
                        <InputNumber id="mobileNo" value={user.mobileNo} onValueChange={(e) => onInputNumberChange(e, 'mobileNo')} maxLength='10'  useGrouping={false} required className={classNames({ 'p-invalid': submitted && !user.mobileNo })}/>
                        {submitted && !user.mobileNo && <small className="p-error">Mobile No. is required.</small>}
                </div>

                <div style={{ marginBottom: '20px' }} className="field col">
                        <label htmlFor="email" className="font-bold">
                            Email
                        </label>
                        <InputText id="email" value={user.email} onChange={(e) => onInputChange(e, 'email')} required className={classNames({ 'p-invalid': submitted && !user.email })} />
                    {submitted && !user.email && <small className="p-error">Email is required.</small>}
                </div>


                <div style={{ marginBottom: '20px' }} className="field col">
                        <label htmlFor="dob" className="font-bold">
                            Date of Birth
                        </label>
                        <Calendar id="dob" value={new Date(user.dob)} onChange={(e) => onInputChange(e, 'dob')} required className={classNames({ 'p-invalid': submitted && !user.dob })} />
                    {submitted && !user.dob && <small className="p-error"> Date of Birth is required.</small>}
                </div>

                <div style={{ marginBottom: '20px' }} className="field col">
                        <label htmlFor="isActive" className="font-bold">
                            Status
                        </label>
                        <Dropdown value={user.isActive} onChange={() => onChangeStatus()} options={status} optionLabel="name" 
                placeholder="Select Status" className="w-full md:w-14rem" />
                </div>
                

                <div style={{ marginBottom: '20px' }} className="field col">
                        <label htmlFor="password" className="font-bold">
                         Password
                        </label>
                        <Password value={user.password} onChange={(e) =>  onInputChange(e, 'password')} feedback={false} toggleMask tabIndex={1} />
                </div>

            </Dialog>

            <Dialog visible={deleteUserDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {user && (
                        <span>
                            Are you sure you want to delete <b>{user.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteUsersDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteUsersDialogFooter} onHide={hideDeleteUsersDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {user && <span>Are you sure you want to delete the selected users?</span>}
                </div>
            </Dialog>
        </div>
    );
}
        