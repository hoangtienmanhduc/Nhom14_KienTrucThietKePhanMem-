import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useState } from 'react';
import { useCallback } from 'react';
import { useRef } from 'react';
import { useImperativeHandle } from 'react';
import { forwardRef } from 'react';
import { createOrUpdateGenericAcademicYear } from '~/api/academic-year/AcademicYearService';
import { getUserId } from '~/components/authentication/AuthUtils';
import { InputMask } from 'primereact/inputmask';
import { Calendar } from 'primereact/calendar';
import { Divider } from 'primereact/divider';
import moment from 'moment';
import { InputNumber } from 'primereact/inputnumber';
import { ProgressSpinner } from 'primereact/progressspinner';

const AcademicYearForm = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        showForm: handleShowForm,
        hideForm: handleHideForm,
    }));

    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({});
    const toast = useRef(null);
    const handleShowForm = useCallback((data) => {
        setData(data && Object.keys(data)?.length > 0 ? { ...data } : {});
        setVisible(true);
    }, []);

    const handleHideForm = useCallback(() => {
        setData({});
        setVisible(false);
    }, []);

    const handleOnSubmit = useCallback(async () => {
        let isError = false;

        // Check dữ liệu của form
        if (!data?.yearStart) {
            toast.current.show({
                severity: 'info',
                summary: 'Info',
                detail: 'Năm học bắt đầu của niên khoá không được để trống!!',
            });
            isError = true;
        }

        if (!data?.firstTermName) {
            toast.current.show({
                severity: 'info',
                summary: 'Info',
                detail: 'Tên của học kỳ đầu không được để trống!!',
            });
            isError = true;
        }

        if (!data?.firstTermStart) {
            toast.current.show({
                severity: 'info',
                summary: 'Info',
                detail: 'Thời gian bắt đầu của học kỳ đầu không được để trống!!',
            });
            isError = true;
        }

        if (!data?.firstTermEnd) {
            toast.current.show({
                severity: 'info',
                summary: 'Info',
                detail: 'Thời gian kết thúc của học kỳ đầu không được để trống!!',
            });
            isError = true;
        }

        if (!data?.secondTermName) {
            toast.current.show({
                severity: 'info',
                summary: 'Info',
                detail: 'Tên của học kỳ hai không được để trống!!',
            });
            isError = true;
        }

        if (!data?.secondTermStart) {
            toast.current.show({
                severity: 'info',
                summary: 'Info',
                detail: 'Thời gian bắt đầu của học kỳ hai không được để trống!!',
            });
            isError = true;
        }

        if (!data?.secondTermEnd) {
            toast.current.show({
                severity: 'info',
                summary: 'Info',
                detail: 'Thời gian kết thúc của học kỳ hai không được để trống!!',
            });
            isError = true;
        }

        if (!data?.thirdTermName) {
            toast.current.show({
                severity: 'info',
                summary: 'Info',
                detail: 'Tên của học kỳ ba không được để trống!!',
            });
            isError = true;
        }

        if (!data?.thirdTermStart) {
            toast.current.show({
                severity: 'info',
                summary: 'Info',
                detail: 'Thời gian bắt đầu của học kỳ ba không được để trống!!',
            });
            isError = true;
        }

        if (!data?.thirdTermEnd) {
            toast.current.show({
                severity: 'info',
                summary: 'Info',
                detail: 'Thời gian kết thúc của học kỳ ba không được để trống!!',
            });
            isError = true;
        }

        if (isError) {
            return;
        } else {
            // Validate thời gian hợp lệ của các học kỳ

            // Học kỳ đầu
            if (
                new Date(data.yearStart + 1, 0).getFullYear() < new Date(data.firstTermStart).getFullYear() ||
                new Date(data.yearStart, 0).getFullYear() > new Date(data.firstTermStart).getFullYear() ||
                new Date(data.yearStart + 1, 0).getFullYear() < new Date(data.firstTermEnd).getFullYear() ||
                new Date(data.yearStart, 0).getFullYear() > new Date(data.firstTermEnd).getFullYear()
            ) {
                toast.current.show({
                    severity: 'info',
                    summary: 'Info',
                    detail: 'Thời gian của học kỳ đầu phải nằm trong niên khoá!!',
                });
                return;
            }

            if (new Date().getTime() >= moment(data.firstTermStart, 'DD/MM/YYYY').toDate().getTime()) {
                toast.current.show({
                    severity: 'info',
                    summary: 'Info',
                    detail: 'Thời gian bắt đầu của học kỳ đầu phải sau ngày hiện tại!!',
                });
                return;
            }

            if (
                moment(data.firstTermStart, 'DD/MM/YYYY').toDate().getTime() >=
                moment(data.firstTermEnd, 'DD/MM/YYYY').toDate().getTime()
            ) {
                toast.current.show({
                    severity: 'info',
                    summary: 'Info',
                    detail: 'Thời gian kết thúc của học kỳ đầu phải sau thời gian bắt đầu của học kỳ!!',
                });
                return;
            }

            if (
                moment(data.firstTermEnd, 'DD/MM/YYYY').toDate().getTime() >=
                moment(data.secondTermStart, 'DD/MM/YYYY').toDate().getTime()
            ) {
                toast.current.show({
                    severity: 'info',
                    summary: 'Info',
                    detail: 'Thời gian bắt đầu của học kỳ hai phải sau thời gian kết thúc của học kỳ một!!',
                });
                return;
            }

            // Học kỳ hai
            if (
                new Date(data.yearStart + 1, 0).getFullYear() < new Date(data.secondTermStart).getFullYear() ||
                new Date(data.yearStart, 0).getFullYear() > new Date(data.secondTermStart).getFullYear() ||
                new Date(data.yearStart + 1, 0).getFullYear() < new Date(data.secondTermEnd).getFullYear() ||
                new Date(data.yearStart, 0).getFullYear() > new Date(data.secondTermEnd).getFullYear()
            ) {
                toast.current.show({
                    severity: 'info',
                    summary: 'Info',
                    detail: 'Thời gian của học kỳ hai phải năm trong niên khoá!!',
                });
                return;
            }

            if (
                moment(data.secondTermStart, 'DD/MM/YYYY').toDate().getTime() >=
                moment(data.secondTermEnd, 'DD/MM/YYYY').toDate().getTime()
            ) {
                toast.current.show({
                    severity: 'info',
                    summary: 'Info',
                    detail: 'Thời gian kết thúc của học kỳ hai phải sau thời gian bắt đầu của học kỳ!!',
                });
                return;
            }

            if (
                moment(data.secondTermEnd, 'DD/MM/YYYY').toDate().getTime() >=
                moment(data.thirdTermStart, 'DD/MM/YYYY').toDate().getTime()
            ) {
                toast.current.show({
                    severity: 'info',
                    summary: 'Info',
                    detail: 'Thời gian bắt đầu của học kỳ ba phải sau thời gian kết thúc của học kỳ hai!!',
                });
                return;
            }

            // Học kỳ hè

            if (
                new Date(data.yearStart + 1, 0).getFullYear() < new Date(data.thirdTermStart).getFullYear() ||
                new Date(data.yearStart, 0).getFullYear() > new Date(data.thirdTermStart).getFullYear() ||
                new Date(data.yearStart + 1, 0).getFullYear() < new Date(data.thirdTermEnd).getFullYear() ||
                new Date(data.yearStart, 0).getFullYear() > new Date(data.thirdTermEnd).getFullYear()
            ) {
                toast.current.show({
                    severity: 'info',
                    summary: 'Info',
                    detail: 'Thời gian của học kỳ hè phải nằm trong niên khoá!!',
                });
                return;
            }

            if (
                moment(data.thirdTermStart, 'DD/MM/YYYY').toDate().getTime() >=
                moment(data.thirdTermEnd, 'DD/MM/YYYY').toDate().getTime()
            ) {
                toast.current.show({
                    severity: 'info',
                    summary: 'Info',
                    detail: 'Thời gian kết thúc của học kỳ ba phải sau thời gian bắt đầu của học kỳ!!',
                });
                return;
            }
        }

        const toPostData = {
            id: data?.id ? data.id : null,
            ...data,
            firstTermStart: moment(data.firstTermStart, 'DD/MM/YYYY').toDate(),
            firstTermEnd: moment(data.firstTermEnd, 'DD/MM/YYYY').toDate(),
            secondTermStart: moment(data.secondTermStart, 'DD/MM/YYYY').toDate(),
            secondTermEnd: moment(data.secondTermEnd, 'DD/MM/YYYY').toDate(),
            thirdTermStart: moment(data.thirdTermStart, 'DD/MM/YYYY').toDate(),
            thirdTermEnd: moment(data.thirdTermEnd, 'DD/MM/YYYY').toDate(),
        };

        const courseData = await createOrUpdateGenericAcademicYear(getUserId(), toPostData);
        if (!!courseData?.id) {
            try {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Thao tác cập nhật niên khoá thành công!!',
                });
            } catch (err) {
                console.log('Tải lại bảng không thành công');
            }

            handleHideForm();
        }
    }, [data, handleHideForm]);

    const handleOnChange = useCallback(
        (key, value) => {
            setData({ ...data, [key]: value });
        },
        [data],
    );

    return (
        <React.Fragment>
            <Dialog
                pt={{ header: { className: 'p-0' } }}
                header={
                    <h3 className="m-0 pb-0 p-3 font-bold">
                        {`${!!data?.id ? 'Cập nhật thông tin' : 'Thêm mới'} niên khoá`}
                        <hr />
                    </h3>
                }
                onHide={handleHideForm}
                style={{
                    width: '60vw',
                }}
                breakpoints={{ '960px': '50vw', '641px': '60vw' }}
                visible={visible}
            >
                <div>
                    <div className="col-12">
                        <Divider align="left">
                            <div className="inline-flex align-items-center">
                                <i className="pi pi-calendar mr-2"></i>
                                <h3 className="p-0 m-0">Năm học (Niên khoá)</h3>
                            </div>
                        </Divider>
                        <div className="col-12 p-0">
                            <p>
                                <strong>Năm học bắt đầu</strong>
                            </p>
                            <span className="w-full">
                                <Calendar
                                    placeholder="Nhập năm bắt đầu"
                                    className="w-full"
                                    view="year"
                                    dateFormat="yy"
                                    value={data?.yearStart ? new Date(data?.yearStart, 0) : null}
                                    onChange={(e) => {
                                        setData({ ...data, yearStart: e.value.getFullYear() });
                                    }}
                                ></Calendar>
                            </span>
                        </div>
                        <Divider align="left">
                            <div className="inline-flex align-items-center">
                                <i className="pi pi-bars mr-2"></i>
                                <h3 className="p-0 m-0">Học kỳ</h3>
                            </div>
                        </Divider>
                        <div className="col-12 p-0">
                            <p>
                                <strong>Tên học kỳ 1</strong>
                            </p>
                            <span className="w-full">
                                <InputText
                                    value={data?.firstTermName || ''}
                                    placeholder="Nhập tên học kỳ I... "
                                    onChange={(e) => setData({ ...data, firstTermName: e.target.value })}
                                    className="w-full"
                                />
                            </span>
                        </div>
                        <div className="col-12 p-0">
                            <p>Chi phí một tín chỉ (VND)</p>
                            <span className="w-full">
                                <InputNumber
                                    value={data?.costFirstTerm}
                                    placeholder="Nhập số chi phí một tín chỉ (Bắt buộc)"
                                    onChange={(e) => handleOnChange('costFirstTerm', e?.value)}
                                    className="w-full"
                                />
                            </span>
                        </div>
                        <div className="flex justify-content-between align-items-center col-12 p-0">
                            <div className="col-5 p-0">
                                <p>Thời gian bắt đầu học kỳ 1</p>
                                <span className="w-full">
                                    <Calendar
                                        placeholder="Nhập thời gian bắt đầu học kỳ 1"
                                        className="w-full"
                                        value={
                                            data?.firstTermStart
                                                ? moment(data?.firstTermStart, 'DD/MM/YYYY').toDate()
                                                : null
                                        }
                                        onChange={(e) => setData({ ...data, firstTermStart: e.value })}
                                    />
                                </span>
                            </div>
                            <Divider align="center" layout="vertical">
                                <span className="p-tag">Đến</span>
                            </Divider>
                            <div className="col-5 p-0">
                                <p>Thời gian kết thúc học kỳ 1</p>
                                <span className="w-full">
                                    <Calendar
                                        placeholder="Nhập thời gian kết thúc học kỳ 1"
                                        className="w-full"
                                        value={
                                            data?.firstTermEnd
                                                ? moment(data?.firstTermEnd, 'DD/MM/YYYY').toDate()
                                                : null
                                        }
                                        onChange={(e) => setData({ ...data, firstTermEnd: e.value })}
                                    />
                                </span>
                            </div>
                        </div>
                        <div className="col-12 p-0">
                            <p>
                                <strong>Tên học kỳ 2</strong>
                            </p>
                            <span className="w-full">
                                <InputText
                                    value={data?.secondTermName || ''}
                                    placeholder="Nhập tên học kỳ II... "
                                    className="w-full"
                                    onChange={(e) => setData({ ...data, secondTermName: e.target.value })}
                                />
                            </span>
                        </div>
                        <div className="col-12 p-0">
                            <p>Chi phí một tín chỉ (VND)</p>
                            <span className="w-full">
                                <InputNumber
                                    value={data?.costSecondTerm}
                                    placeholder="Nhập số chi phí một tín chỉ (Bắt buộc)"
                                    onChange={(e) => handleOnChange('costSecondTerm', e?.value)}
                                    className="w-full"
                                />
                            </span>
                        </div>
                        <div className="flex justify-content-between align-items-center col-12 p-0">
                            <div className="col-5 p-0">
                                <p>Thời gian bắt đầu học kỳ 2</p>
                                <span className="w-full">
                                    <Calendar
                                        placeholder="Nhập thời gian bắt đầu học kỳ 2"
                                        className="w-full"
                                        value={
                                            data?.secondTermStart
                                                ? moment(data?.secondTermStart, 'DD/MM/YYYY').toDate()
                                                : null
                                        }
                                        onChange={(e) => setData({ ...data, secondTermStart: e.value })}
                                    />
                                </span>
                            </div>
                            <Divider align="center" layout="vertical">
                                <span className="p-tag">Đến</span>
                            </Divider>
                            <div className="col-5 p-0">
                                <p>Thời gian kết thúc học kỳ 2</p>
                                <span className="w-full">
                                    <Calendar
                                        placeholder="Nhập thời gian kết thúc học kỳ 2"
                                        className="w-full"
                                        value={
                                            data?.secondTermEnd
                                                ? moment(data?.secondTermEnd, 'DD/MM/YYYY').toDate()
                                                : null
                                        }
                                        onChange={(e) => setData({ ...data, secondTermEnd: e.value })}
                                    ></Calendar>
                                </span>
                            </div>
                        </div>
                        <div className="col-12 p-0">
                            <p>
                                <strong>Tên học kỳ 3</strong>
                            </p>
                            <span className="w-full">
                                <InputText
                                    value={data?.thirdTermName || ''}
                                    placeholder="Nhập tên học kỳ III... "
                                    className="w-full"
                                    onChange={(e) => setData({ ...data, thirdTermName: e.target.value })}
                                />
                            </span>
                        </div>
                        <div className="col-12 p-0">
                            <p>Chi phí một tín chỉ (VND)</p>
                            <span className="w-full">
                                <InputNumber
                                    value={data?.costThirdTerm}
                                    placeholder="Nhập số chi phí một tín chỉ (Bắt buộc)"
                                    onChange={(e) => handleOnChange('costThirdTerm', e?.value)}
                                    className="w-full"
                                />
                            </span>
                        </div>
                        <div className="flex justify-content-between align-items-center col-12 p-0">
                            <div className="col-5 p-0">
                                <p>Thời gian bắt đầu học kỳ 3</p>
                                <span className="w-full">
                                    <Calendar
                                        className="w-full"
                                        placeholder="Nhập thời gian bắt đầu học kỳ 3"
                                        value={
                                            data?.thirdTermStart
                                                ? moment(data?.thirdTermStart, 'DD/MM/YYYY').toDate()
                                                : null
                                        }
                                        onChange={(e) => setData({ ...data, thirdTermStart: e.value })}
                                    />
                                </span>
                            </div>
                            <Divider align="center" layout="vertical">
                                <span className="p-tag">Đến</span>
                            </Divider>
                            <div className="col-5 p-0">
                                <p>Thời gian kết thúc học kỳ 3</p>
                                <span className="w-full">
                                    <Calendar
                                        placeholder="Nhập thời gian kết thúc học kỳ 3"
                                        className="w-full"
                                        value={
                                            data?.thirdTermEnd
                                                ? moment(data?.thirdTermEnd, 'DD/MM/YYYY').toDate()
                                                : null
                                        }
                                        onChange={(e) => setData({ ...data, thirdTermEnd: e.value })}
                                    ></Calendar>
                                </span>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="flex col-12 ">
                        <Button
                            className={`col-6 mr-2`}
                            icon={'pi pi-send'}
                            label={'Xác nhận'}
                            onClick={handleOnSubmit}
                        />
                        <Button className="col-6" icon={'pi pi-times'} label={'Huỷ bỏ'} onClick={handleHideForm} />
                    </div>
                </div>
            </Dialog>
            <Toast ref={toast} />
        </React.Fragment>
    );
});

export default AcademicYearForm;
