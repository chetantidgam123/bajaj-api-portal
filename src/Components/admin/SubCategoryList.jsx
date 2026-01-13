import moment from "moment"
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import { subCategoryFormSchema } from "../../Schema";
import { post_auth_data } from "../../ApiServices";
import { arrayIndex, convertToPayload, offsetPagination } from "../../Utils";
import { useFormik } from "formik";
import { confirm_swal_with_text, error_swal_toast, success_swal_toast } from "../../SwalServices";
import { LoaderWight, PageLoaderBackdrop } from "../../Loader";
import PaginateComponent from "../common/Pagination";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor, Essentials, Bold, Italic, Underline, Strikethrough, Heading, Link, List, BlockQuote, Table, Undo, Paragraph } from 'ckeditor5';
function SubCategoryList() {
    const [show, setShow] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [loader, setLoader] = useState({ pageloader: false, submit: false })
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [dropCatInput, setDropCatInput] = useState(0);
    const [subCategoryList, setSubCategoryList] = useState([]);
    const handleClose = () => { setShow(false); subcategoryForm.resetForm(); };
    const handleShow = () => {
        setIsEdit(false);
        subcategoryForm.resetForm();
        setShow(true)
    };
    const subcategoryForm = useFormik({
        initialValues: {
            subcategoryname: "",
            categoryid: 0,
            sub_categoryid: 0,
            description: '',
            isenabled: true
        },
        validationSchema: subCategoryFormSchema,
        onSubmit: (values) => {
            if (!isEdit) {
                addSubCategory();
            } else {
                updateSubCategory(values)
            }
        },

    })

    const [categoryList, setCategoryList] = useState([]);
    const getCategoryList = () => {
        post_auth_data("portal/private", convertToPayload('get-all-categories', {}), {})
            .then((response) => {
                if (response.data.status) {
                    setCategoryList(response.data.data || [])
                } else {
                    setCategoryList([]);
                }
            }).catch((error) => {
                console.log(error)
                setCategoryList([]);
            })
    }
    const getSubCategoryList = (page = 1, catId = null) => {
        setCurrentPage(page)
        let payload = {
            // category_id: Number(catId || subcategoryForm.values.categoryid || 0),
            // category_id: catId !== null ? Number(catId) : 0,
            category_id: catId ? Number(catId) : 0,
            offset: ((page - 1) * offsetPagination),
            limit: offsetPagination
        }
        setLoader({ ...loader, pageloader: true })
        post_auth_data("portal/private", convertToPayload('get-all-sub-categories', payload), {})
            .then((response) => {
                setLoader({ ...loader, pageloader: false })
                if (response.data.status) {
                    setSubCategoryList(response.data.data || [])
                    setTotalPages(Math.ceil(response.data.count / offsetPagination))
                } else {
                    error_swal_toast(response.data.message);
                    setSubCategoryList([]);
                }
            }).catch((error) => {
                setLoader({ ...loader, pageloader: false })
                setSubCategoryList([])
                error_swal_toast(error.message || error);
            })
    }
    const addSubCategory = () => {
        let payload = {
            subcategoryname: subcategoryForm.values.subcategoryname,
            categoryid: Number(subcategoryForm.values.categoryid),
            description: subcategoryForm.values.description
        }
        setLoader({ ...loader, submit: true });
        post_auth_data("portal/private", convertToPayload('create-sub-category', payload), {})
            .then((response) => {
                setLoader({ ...loader, submit: false });
                if (response.data.status) {
                    success_swal_toast(response.data.message);
                    getSubCategoryList();
                    handleClose();
                } else {
                    error_swal_toast(response.data.message);
                }
            }).catch((error) => {
                setLoader({ ...loader, submit: false });
                handleClose();
                error_swal_toast(error.message || error);
            })
    };

    const confirm_swal_call_delete = (scat) => {
        const callback = (resolve, reject) => {
            deleteSubCategory(scat, resolve, reject);
        }
        confirm_swal_with_text(callback, `Are you sure <br/> you want to delete this ${scat.subcategoryname}?`)
    }

    const deleteSubCategory = (scat, resolve, reject) => {
        let payload = { "subcategoryid": scat.id }
        post_auth_data("portal/private", convertToPayload("delete-subcategory", payload), {})
            .then((res) => {
                if (res.data.status) {
                    console.log(res.data)
                    success_swal_toast(res.data.message || "Sub Category deleted successfully");
                    resolve();
                    getSubCategoryList()
                } else {
                    reject();
                    error_swal_toast(res.data.message || "Failed to delete sub category");
                }
            }).catch((error) => {
                reject();
                error_swal_toast(error.message || "something went wrong");
                console.error("Error during deletion:", error);
            })
    }

    const updateSubCategory = (data) => {
        let payload = {
            subcategoryname: data.subcategoryname,
            categoryid: Number(data.categoryid),
            sub_categoryid: data.sub_categoryid,
            description: data.description,
            isenabled: data.isenabled,
        }
        setLoader({ ...loader, submit: true });
        post_auth_data("portal/private", convertToPayload('update-sub-category', payload), {})
            .then((response) => {
                setLoader({ ...loader, submit: false });
                if (response.data.status) {
                    getSubCategoryList();
                    handleClose();
                    success_swal_toast(response.data.message);
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
        subcategoryForm.setValues({
            subcategoryname: data.subcategoryname,
            categoryid: data.categoryid,
            sub_categoryid: data.id,
            description: data.description,
            isenabled: data.isenabled,
        });
        setIsEdit(true);
        setShow(true);
    }

    const confirm_swal_call_edit = (scat) => {
        const callback = (resolve, reject) => {
            openEditModal(scat);
            resolve();
        }
        confirm_swal_with_text(callback, `Are you sure <br/> you want to edit this ${scat.subcategoryname}?`)
    }

    const confirm_swal_call_update = () => {
        const callback = (resolve, reject) => {
            subcategoryForm.handleSubmit();
            resolve();
        }
        confirm_swal_with_text(callback, `Are you sure <br/> you want to update this ${subcategoryForm.values.subcategoryname}?`)
    }

    const handleFormSubmit = () => {
        if (isEdit) {
            confirm_swal_call_update();
        } else {
            subcategoryForm.handleSubmit();
        }
    }

    const confirm_swal_call = (cat) => {
        const callback = (resolve, reject) => {
            toggleStatus(cat, resolve, reject);
        }
        confirm_swal_with_text(callback, `Are you sure <br/> you want to ${cat.isenabled ? 'disable' : 'enable'} sub category?`)
    }
    const toggleStatus = (data, resolve, reject) => {
        let payload = {
            categoryid: data.categoryid,
            sub_categoryid: data.id,
            subcategoryname: data.subcategoryname,
            description: data.description,
            isenabled: !data.isenabled
        }
        post_auth_data("portal/private", convertToPayload('update-sub-category', payload), {})
            .then((response) => {
                if (response.data.status) {
                    getSubCategoryList();
                    resolve();
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
        getSubCategoryList();
        getCategoryList();
    }, [])

    const refresh = () => {
        setDropCatInput(0);
        getSubCategoryList(1, 0)
    }

    return (
        <div className="mx-2 card-admin-main">
            <div className="card-body card-bg">
                <div className="row justify-content-between">
                    <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                        <h4 className="mb-2">Sub Category List</h4>
                    </div>
                    <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 col-12 d-flex justify-content-xl-end justify-content-lg-end justify-content-md-center justify-content-sm-center justify-content-center">
                        <button className="btn btn-primary py-1" onClick={handleShow}>Add Sub Category</button>
                    </div>
                </div>
            </div>



            <div className="">
                <label className="form-label mt-4" htmlFor="category-drop-input">Filters</label>
                <div className="row  align-items-start">


                    <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-xs-12 mb-2">
                        <div className="mb-3">
                            <select className="form-select" id="category-drop-input" name="category-drop-input"
                                value={dropCatInput}
                                onChange={(e) => { setDropCatInput(e.target.value) }}>
                                <option value="">Select Category</option>
                                {
                                    categoryList.map((cat, i) => (
                                        <option key={arrayIndex('catlist', i)} value={cat.id}>{cat.categoryname}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-3 mb-2">
                        <button className="btn btn-primary profilePageButton px-3 search-btn" onClick={() => getSubCategoryList(1, dropCatInput)}>Search  </button>
                        <button className="btn btn-outline-primary ms-2 profilePageButton px-3 search-btn" onClick={refresh}><i className="fas fa-sync-alt"></i> </button>
                    </div>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table table-bordered custom-table table-striped ">
                    <thead className="text-truncate">
                        <tr>
                            <th>Sr. No</th>
                            <th>Category Name</th>
                            <th>Sub Category Name</th>
                            <th>Created Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            subCategoryList.length > 0 && subCategoryList.map((scat, index) => (
                                <tr key={arrayIndex('usescatr', index)}>
                                    <td>{scat.sr_no || index + 1}</td>
                                    <td>{scat.categoryname}</td>
                                    <td>{scat.subcategoryname}</td>
                                    <td>{moment(scat.createddate).format('DD-MMM-yyyy')}</td>
                                    <td>
                                        <div className="d-flex">
                                            <Form.Check // prettier-ignore
                                                type="switch"
                                                id="custom-switch"
                                                checked={scat.isenabled}
                                                onChange={() => { confirm_swal_call(scat) }}
                                            />
                                            <button className="btn btn-primary btn-sm mx-2" title="Edit Subcategory" onClick={() => { confirm_swal_call_edit(scat); }}>
                                                <i className="fa fa-pencil" ></i>
                                            </button>
                                            <button className="btn btn-danger btn-sm" title="Delete Subcategory" onClick={() => confirm_swal_call_delete(scat)}>
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <PaginateComponent
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => getSubCategoryList(page, dropCatInput)}
                />
            </div>
            <Modal show={show} onHide={handleClose} dialogClassName="subcategory-modal-width">
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? 'Update' : 'Add'} Sub Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="category-name">Category Name</label>
                        <select className="form-select" id="categoryid" name="categoryid"
                            value={subcategoryForm.values.categoryid}
                            onChange={subcategoryForm.handleChange} onBlur={subcategoryForm.handleBlur}>
                            <option value="">Select Category</option>
                            {
                                categoryList.map((cat, i) => (
                                    <option key={arrayIndex('catlist', i)} value={cat.id}>{cat.categoryname}</option>
                                ))
                            }
                        </select>
                        {subcategoryForm.touched.categoryid && subcategoryForm.errors.categoryid ? (
                            <small className="text-danger">{subcategoryForm.errors.categoryid}</small>
                        ) : null}
                    </div>
                    <div className="mb-2">
                        <label className="form-label" htmlFor="subcategoryname">Sub Category Name</label>
                        <input type="text" className="form-control h-60" id="subcategoryname" name="subcategoryname"
                            placeholder="Enter sub category name" value={subcategoryForm.values.subcategoryname}
                            onChange={subcategoryForm.handleChange} onBlur={subcategoryForm.handleBlur} />
                        {subcategoryForm.touched.subcategoryname && subcategoryForm.errors.subcategoryname ? (
                            <small className="text-danger">{subcategoryForm.errors.subcategoryname}</small>
                        ) : null}
                    </div>
                    {/* <div className="mb-2">
                        <label className="form-label" htmlFor="description">Sub Category description</label>
                        <textarea type="text" className="form-control" id="description" name="description"
                            placeholder="Enter category description" value={subcategoryForm.values.description}
                            onChange={subcategoryForm.handleChange} onBlur={subcategoryForm.handleBlur} />
                        {subcategoryForm.touched.description && subcategoryForm.errors.description ? (
                            <small className="text-danger">{subcategoryForm.errors.description}</small>
                        ) : null}
                    </div> */}
                    <div className="mb-2">
                        <label className="form-label" htmlFor="description">Sub Category Description</label>
                        <CKEditor
                            editor={ClassicEditor}
                            data={subcategoryForm.values.description}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                subcategoryForm.setFieldValue("description", data);
                            }}
                            onBlur={() => subcategoryForm.setFieldTouched("description", true)}
                            config={{
                                licenseKey: 'GPL',
                                plugins: [Essentials, Bold, Italic, Underline, Strikethrough, Heading, Link, List, BlockQuote, Table, Undo, Paragraph],
                                toolbar: [
                                    "heading",
                                    "|",
                                    "bold", "italic", "underline", "strikethrough",
                                    "|",
                                    "bulletedList", "numberedList", "blockQuote", "|",
                                    "alignment",           // left, center, right, justify
                                    "insertTable",         // table insert
                                    "imageUpload",         // image upload
                                    "|", "undo", "redo", "removeFormat",
                                ],
                                heading: {
                                    options: [
                                        { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
                                        { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
                                        { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
                                        { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
                                        { model: "heading4", view: "h4", title: "Heading 4", class: "ck-heading_heading4" },
                                        { model: "heading5", view: "h5", title: "Heading 5", class: "ck-heading_heading5" },
                                        { model: "heading6", view: "h6", title: "Heading 6", class: "ck-heading_heading6" },
                                    ],
                                },
                            }}
                        />
                        {subcategoryForm.touched.description && subcategoryForm.errors.description ? (
                            <small className="text-danger">{subcategoryForm.errors.description}</small>
                        ) : null}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" type="button" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="button" onClick={handleFormSubmit} disabled={loader.submit}>
                        {isEdit ? 'Update' : 'Add'} {loader.submit && <LoaderWight />}
                    </Button>
                </Modal.Footer>
            </Modal>
            {loader.pageloader && <PageLoaderBackdrop />}
        </div>
    )
}

export default SubCategoryList
