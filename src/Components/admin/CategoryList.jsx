import moment from "moment"
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import { categoryFormSchema } from "../../Schema";
import { post_auth_data } from "../../ApiServices";
import { arrayIndex, convertToPayload } from "../../Utils";
import { useFormik } from "formik";
import { confirm_swal_with_text, error_swal_toast, success_swal_toast } from "../../SwalServices";
import { LoaderWight, PageLoaderBackdrop } from "../../Loader";
function CategoryList() {
    const [show, setShow] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [loader, setLoader] = useState({ pageloader: false, submit: false })
    const handleClose = () => { setShow(false); categoryForm.resetForm(); };
    const handleShow = () => setShow(true);
    const [categoryList, setCategoryList] = useState([]);
    const categoryForm = useFormik({
        initialValues: {
            categoryName: "",
            description: "",
            isenabled: true,
            categoryid: 0
        },
        validationSchema: categoryFormSchema,
        onSubmit: (values) => {
            if (!isEdit) {
                addCategory();
            } else {
                updateCategory(values)
            }
        },

    })

    const getCategoryList = () => {
        setLoader({ ...loader, pageloader: true })
        post_auth_data("portal/private", convertToPayload('get-all-categories', {}), {})
            .then((response) => {
                setLoader({ ...loader, pageloader: false })
                if (response.data.status) {
                    setCategoryList(response.data.data || [])
                } else {
                    error_swal_toast(response.data.message);
                    setCategoryList([]);
                }
            }).catch((error) => {
                setLoader({ ...loader, pageloader: false })
                setCategoryList([])
                error_swal_toast(error.message || error);
            })
    }

    const addCategory = () => {
        let payload = {
            categoryname: categoryForm.values.categoryName,
            description: categoryForm.values.description
        }
        setLoader({ ...loader, submit: true });
        post_auth_data("portal/private", convertToPayload('create-category', payload), {})
            .then((response) => {
                if (response.data.status) {
                    setLoader({ ...loader, submit: false });
                    getCategoryList();
                    success_swal_toast(response.data.message)
                    handleClose();
                } else {
                    error_swal_toast(response.data.message)
                }
            }).catch((error) => {
                setLoader({ ...loader, submit: false });
                handleClose();
                error_swal_toast(error.message || error);
            })
    };
    const updateCategory = (cat) => {
        let payload = {
            categoryname: cat.categoryName,
            categoryid: cat.categoryid,
            isenabled: cat.isenabled,
            description: cat.description
        }
        setLoader({ ...loader, submit: true });
        post_auth_data("portal/private", convertToPayload('update-category', payload), {})
            .then((response) => {
                setLoader({ ...loader, submit: false });
                if (response.data.status) {
                    getCategoryList();
                    success_swal_toast(response.data.message)
                    handleClose();
                } else {
                    error_swal_toast(response.data.message || "something went wrong");
                }
            }).catch((error) => {
                setLoader({ ...loader, submit: false });
                error_swal_toast(error.message || "something went wrong");
                console.error("Error during signup:", error);
            })
    }

    const openEditModal = (data) => {
        categoryForm.setValues({
            ...categoryForm.values,
            categoryName: data.categoryname,
            description: data.description,
            isenabled: data.isenabled,
            categoryid: data.id
        });
        setIsEdit(true);
        setShow(true);
    }

    const confirm_swal_call = (cat) => {
        const callback = (resolve, reject) => {
            toggleStatus(cat, resolve, reject);
        }
        confirm_swal_with_text(callback, `Are you sure <br/> you want to ${cat.isenabled ? 'disable' : 'enable'} category?`)
    }
    const toggleStatus = (data, resolve, reject) => {
        let payload = {
            categoryname: data.categoryname,
            description: data.description,
            isenabled: !data.isenabled,
            categoryid: data.id
        }
        post_auth_data("portal/private", convertToPayload('update-category', payload), {})
            .then((response) => {
                if (response.data.status) {
                    resolve();
                    getCategoryList();
                } else {
                    reject();
                    error_swal_toast(response.data.message || "something went wrong");
                }
            }).catch((error) => {
                reject();
                error_swal_toast(error.message || "something went wrong");
                console.error("Error during signup:", error);
            })
    }

    useEffect(() => {
        getCategoryList();
    }, [])
    return (
        <div className="mx-2 card-admin-main">
            <div className="card-body card-bg">
                <div className="row justify-content-between">
                    <div className="col-3">
                        <h4 className="mb-2">Api Category List</h4>
                    </div>
                    <div className="col-2 d-flex justify-content-end">
                        <button className="btn btn-primary py-1" onClick={handleShow}>Add Category</button>
                    </div>
                </div>
            </div>


            <div className="mt-4 d-none">
                <label className="form-label" htmlFor="categoryid">Filters</label>
                <div className="row align-items-center">
                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 mb-3 ">
                        <select className="form-select" id="categoryid" name="categoryid"
                        // value={categoryId}
                        // onChange={(e) => { setCategoryId(e.target.value) }}>
                        // <option value="">Select Category</option>
                        // {
                        //     categoryList.map((m, i) => (
                        //         <option key={arrayIndex('category', i)} value={m?.id}>{m.categoryname}</option>
                        //     ))
                        // }
                        >
                            <option value="">Select Category </option> </select>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 mb-3">
                        <button className="btn btn-primary profilePageButton px-3 search-btn">Search </button>
                    </div>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table table-bordered custom-table table-striped mt-3">
                    <thead>
                        <tr>
                            <th>Sr. No</th>
                            <th>Category  Name</th>
                            <th>Created Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            categoryList.length > 0 && categoryList.map((cat, index) => (
                                <tr key={arrayIndex('usecatr', index)}>
                                    <td>{cat.sr_no || index + 1}</td>
                                    <td>{cat.categoryname}</td>
                                    <td>{moment(cat.createddate).format('DD-MMM-yyyy')}</td>
                                    <td>
                                        <div className="d-flex">
                                            <Form.Check // prettier-ignore
                                                type="switch"
                                                id="custom-switch"
                                                checked={cat.isenabled}
                                                onChange={() => { confirm_swal_call(cat) }}
                                            />
                                            <button className="btn btn-primary btn-sm mx-2" title="Edit User" onClick={() => { openEditModal(cat); }}>
                                                <i className="fa fa-pencil" ></i>
                                            </button>
                                            <button className="btn btn-danger btn-sm" title="Delete User">
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? 'Update' : 'Add'} Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-2">
                        <label className="form-label" htmlFor="category-name">Category Name</label>
                        <input type="text" className="form-control h-60" id="category-name" name="categoryName"
                            placeholder="Enter category name" value={categoryForm.values.categoryName}
                            onChange={categoryForm.handleChange} onBlur={categoryForm.handleBlur} />
                        {categoryForm.touched.categoryName && categoryForm.errors.categoryName ? (
                            <small className="text-danger">{categoryForm.errors.categoryName}</small>
                        ) : null}
                    </div>
                    <div className="mb-2">
                        <label className="form-label" htmlFor="description">Category description</label>
                        <textarea type="text" className="form-control" id="description" name="description"
                            placeholder="Enter category description" value={categoryForm.values.description}
                            onChange={categoryForm.handleChange} onBlur={categoryForm.handleBlur} />
                        {categoryForm.touched.description && categoryForm.errors.description ? (
                            <small className="text-danger">{categoryForm.errors.description}</small>
                        ) : null}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" type="button" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="button" onClick={categoryForm.handleSubmit} disabled={loader.submit}>
                        {isEdit ? 'Update' : 'Add'} {loader.submit && <LoaderWight />}
                    </Button>
                </Modal.Footer>
            </Modal>
            {loader.pageloader && <PageLoaderBackdrop />}
        </div>
    )
}

export default CategoryList
