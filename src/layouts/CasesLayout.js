import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import CasesService from '../services/CasesService';
import { GoogleApiWrapper, Map, Marker } from 'google-maps-react';


const CasesLayout = ({ google }) => {
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

    const [cases, setCases] = useState(null);
    const [user, setUser] = useState(emptyUser);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [displayDialog, setDisplayDialog] = useState(false);
    const [currentLocation, setCurrentLocation] = useState({ latitude: null, longitude: null });
    const [selectedCaseId, setSelectedCaseId] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    let timeoutRef = useRef(null);


    const userFullName = (rowData) => {
        return `${rowData.user.firstName} ${rowData.user.lastName}`;
    };

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        gender: { value: null, matchMode: FilterMatchMode.IN },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
    });

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const allCases = await CasesService.getAll();
                setCases(allCases.data.findedCases);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCases();
    }, []);

    useEffect(() => {
        const fetchLocation = async () => {
            if (selectedCaseId) {
                try {
                    const response = await CasesService.getCase(selectedCaseId);
                    const data = response.data?.findedCase;
                    setCurrentLocation({ latitude: data.latitude, longitude: data.longitude });
                } catch (error) {
                    console.error('Error fetching location:', error);
                }
                timeoutRef.current = setTimeout(fetchLocation, 3000);
            }
        };

        if (displayDialog) {
            fetchLocation();
        } else {
            clearTimeout(timeoutRef.current);
        }

        return () => clearTimeout(timeoutRef.current);
    }, [displayDialog, selectedCaseId]);

    const openDialog = (caseId) => {
        setSelectedCaseId(caseId);
        setDisplayDialog(true);
    }

    const closeDialog = () => {
        clearTimeout(timeoutRef.current);
        setDisplayDialog(false);
        setCurrentLocation({ latitude: null, longitude: null });
    }

    const LocationBodyTemplate = (rowData) => {
        return (
            <i className="pi pi-map-marker" style={{ cursor: 'pointer', color: '#007ad9', textAlign: 'center' }} onClick={() => openDialog(rowData._id)}></i>
        );
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const status = [
        { name: 'Active', value: true },
        { name: 'Deactivate', value: false }
    ];

    const onChangeStatus = () => {
        let _user = { ...user };
        _user['isActive'] = !_user['isActive'];
        setUser(_user);
    }

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const statusBodyTemplate = (rowData) => {
        if (rowData.isActive)
            return <Tag value={rowData.isActive} severity={getSeverity(rowData)}>Active</Tag>;
        else
            return <Tag value={rowData.isActive} severity={getSeverity(rowData)}>Deactivated</Tag>;
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
            <h4 className="m-0">Manage Cases</h4>
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

                <DataTable ref={dt} value={cases} scrollable loading={loading} paginator showGridlines rows={10} dataKey="_id"
                    filters={filters} globalFilterFields={['firstName', 'lastName', 'email', 'isActive', 'gender', 'gender.name']} header={header}
                    emptyMessage="No customers found." rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users" globalFilter={globalFilter}>
                    <Column field="massage" header="Message" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="user.firstName" header="User" body={userFullName} sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="userCondition" header="UserCondition" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="location" alignFrozen="right" header="Location" body={LocationBodyTemplate} sortable style={{ minWidth: '10rem' }}></Column>
                    <Column frozen field="isActive" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                </DataTable>
                <Dialog header="Case Location" visible={displayDialog} style={{ width: '50vw' }} onHide={closeDialog}>
                    <div style={{ height: '450px', width: '100%' }}>
                        <Map style={{ height: '80%', width: '90%' }}
                            google={google}
                            zoom={14}
                            initialCenter={{
                                lat: currentLocation.latitude,
                                lng: currentLocation.longitude
                            }}
                            center={{
                                lat: currentLocation.latitude,
                                lng: currentLocation.longitude
                            }}
                        >
                            <Marker
                                position={{
                                    lat: currentLocation.latitude,
                                    lng: currentLocation.longitude
                                }}
                            />
                        </Map>
                    </div>
                </Dialog>
            </div>
        </div>
    )
}   

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAqW6pMf3yLv4x5F-7ijsnkUwpySD5s_hM'
})(CasesLayout);
