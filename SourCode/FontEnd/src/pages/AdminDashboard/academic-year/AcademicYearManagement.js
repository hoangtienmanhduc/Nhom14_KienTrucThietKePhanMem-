import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserId } from '~/components/authentication/AuthUtils';
import { useRef } from 'react';
import AcademicYearForm from './AcademicYearForm';
import { getPageAcademicYearInfo } from '~/api/academic-year/AcademicYearService';
import { Toast } from 'primereact/toast';

const QueryKey = 'Academic-Year-Management';
const initialPageable = {
    rows: 10,
    pageNumber: 0,
    sortField: 'id',
    sortOrder: -1,
};
const AcademicYearManagement = () => {
    const [pageable, setPageable] = useState({ ...initialPageable });
    const toast = useRef();
    const { data, refetch } = useQuery(
        [QueryKey, getUserId(), pageable.pageNumber, pageable.rows, pageable.sortField, pageable.sortOrder, {}],
        () =>
            getPageAcademicYearInfo(
                getUserId(),
                pageable?.pageNumber,
                pageable?.rows,
                pageable.sortField,
                pageable.sortOrder,
                {},
            ),
        {
            enabled: !!getUserId(),
        },
    );

    const academicRef = useRef(null);
    const columns = [
        { field: 'name', header: 'Niên khoá' },
        { field: 'firstTermName', header: 'Tên học kỳ 1' },
        { field: 'firstTermStart', header: 'Thời gian bắt đầu HK1' },
        { field: 'firstTermEnd', header: 'Thời gian kết thúc HK1' },
        { field: 'secondTermName', header: 'Tên học kỳ 2' },
        { field: 'secondTermStart', header: 'Thời gian bắt đầu HK2' },
        { field: 'secondTermEnd', header: 'Thời gian kết thúc HK2' },
        { field: 'thirdTermName', header: 'Tên học kỳ 3' },
        { field: 'thirdTermStart', header: 'Thời gian bắt đầu HK3' },
        { field: 'thirdTermEnd', header: 'Thời gian kết thúc HK3' },
        { field: 'action', header: 'Thao tác' },
    ];

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <p className="text-900 font-bold m-0">QUẢN LÝ NIÊN KHOÁ</p>
            <div className="flex align-items-center ">
                <Button className="mr-2" icon="pi pi-refresh" rounded raised onClick={refetch} />
                <Button className="" icon="pi pi-plus" rounded raised onClick={() => academicRef.current.showForm()} />
            </div>
        </div>
    );

    const queryClient = useQueryClient();
    useEffect(() => {
        if (!!getUserId() && data && !data?.last && data.content?.length > 0) {
            queryClient.prefetchQuery(
                [
                    QueryKey,
                    getUserId(),
                    pageable.pageNumber + 1,
                    pageable.rows,
                    pageable.sortField,
                    pageable.sortOrder,
                    {},
                ],
                () =>
                    getPageAcademicYearInfo(
                        getUserId(),
                        pageable?.pageNumber + 1,
                        pageable?.rows,
                        pageable.sortField,
                        pageable.sortOrder,
                        {},
                    ),
            );
        }
    }, [data, pageable.pageNumber, pageable.rows, pageable.sortField, pageable.sortOrder, queryClient]);

    return (
        <React.Fragment>
            <div className="col-12">
                <DataTable
                    value={!!data && data?.content?.length > 0 ? data?.content : []}
                    header={header}
                    tableStyle={{ minWidth: '60rem' }}
                    paginator
                    scrollable
                    resizableColumns
                    stripedRows
                    lazy
                    rows={10}
                    first={pageable.pageNumber * pageable.rows}
                    onPage={(e) => setPageable({ ...pageable, pageNumber: e.page })}
                    totalRecords={data && data.totalElements ? data.totalElements : 0}
                >
                    {columns.map((col, i) => (
                        <Column
                            className="text-center"
                            key={col.field}
                            field={col.field}
                            sortable
                            header={col.header}
                            body={(rowData) =>
                                col.field === 'deleted' ? (
                                    rowData[col.field] ? (
                                        <div className="overflow-dot overflow-text-2" style={{ width: '100%' }}>
                                            Có
                                        </div>
                                    ) : (
                                        <div className="overflow-dot overflow-text-2" style={{ width: '100%' }}>
                                            Không
                                        </div>
                                    )
                                ) : col.field === 'action' ? (
                                    <div className="overflow-dot overflow-text-2" style={{ width: '100%' }}>
                                        <Button
                                            className="mr-2"
                                            text
                                            icon="pi pi-pencil"
                                            rounded
                                            raised
                                            onClick={() => academicRef.current.showForm(rowData)}
                                        />
                                    </div>
                                ) : (
                                    <div className="overflow-dot overflow-text-2" style={{ width: '100%' }}>
                                        {rowData[col.field]}
                                    </div>
                                )
                            }
                        />
                    ))}
                </DataTable>
            </div>
            <AcademicYearForm ref={academicRef} />
            <Toast ref={toast} />
        </React.Fragment>
    );
};

export default AcademicYearManagement;
