import moment from "moment"
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { post_auth_data } from "../../ApiServices";
import { arrayIndex, convertToPayload, offsetPagination } from "../../Utils";
import { useNavigate } from "react-router-dom";
import { error_swal_toast } from "../../SwalServices";
import { PageLoaderBackdrop } from "../../Loader";
import { confirm_swal_with_text,success_swal_toast } from "../../SwalServices";
import PaginateComponent from "../common/Pagination";
function ApiList() {
    const [apiList, setApiList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [subCategoryList, setSubCategoryList] = useState([]);
    const [categoryId, setCategoryId] = useState(0);
    const [subCategoryId, setSubCategoryId] = useState(0);
    const [loader, setLoader] = useState({ pageloder: false })
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const getApiList = (page = 1, catId = categoryId, subCatId = subCategoryId) => {
        setCurrentPage(page);
        setLoader({ ...loader, pageloder: true })
        post_auth_data("portal/private", convertToPayload('get-all-apis', {
            categoryid: catId,
            subcategoryid: subCatId,
            offset: ((page - 1) * offsetPagination),
            limit: offsetPagination
        }), {})
            .then((response) => {
                setLoader({ ...loader, pageloder: false })
                if (response.data.status) {
                    setApiList(response.data.data || [])
                    const totalPages = Math.ceil(response.data.totalRecords / offsetPagination);
                    setTotalPages(totalPages);
                } else {
                    error_swal_toast(response.data.message)
                    setApiList([])
                }
            }).catch((error) => {
                setLoader({ ...loader, pageloder: false })
                error_swal_toast(error.message || 'something went wrong')
            })
    }
    const getCategoryList = () => {
        post_auth_data("portal/private", convertToPayload('get-all-categories', {}), {})
            .then((response) => {
                // setLoader({ ...loader, pageloader: false })
                if (response.data.status) {
                    setCategoryList(response.data.data || [])
                } else {
                    error_swal_toast(response.data.message);
                    setCategoryList([]);
                }
            }).catch((error) => {
                // setLoader({ ...loader, pageloader: false })
                setCategoryList([])
                error_swal_toast(error.message || error);
            })
    }
    const getSubCategoryList = (page = 1) => {
        let payload = {
            category_id: categoryId,
            offset: ((page - 1) * offsetPagination),
            limit: offsetPagination
        }
        post_auth_data("portal/private", convertToPayload('get-all-sub-categories', payload), {})
            .then((response) => {
                if (response.data.status) {
                    setSubCategoryList(response.data.data || [])
                } else {
                    setSubCategoryList([]);
                }
            }).catch((error) => {
                setSubCategoryList([])
            })
    }

    const confirm_swall_call_delete = (apil) => {
            const callback = (resolve, reject) => {
                deleteApi(apil, resolve, reject)
            }
            confirm_swal_with_text(callback, `Are you sure <br/> you want to delete`)
        }
    
        const deleteApi = (apil, resolve, reject) => {
            let payload = { "api_id": apil.id }
            post_auth_data("portal/private", convertToPayload('delete-api', payload), {})
            .then((res) => {
                if(res.data.status) {
                    console.log(res.data)
                    success_swal_toast(res.data.message);
                    getApiList()
                    resolve();
                } else {
                    reject();
                    error_swal_toast(res.data.message || "something went wrong");
                }
            }).catch((error) => {
                reject();
                console.error("Error during delete:", error);
            })
        }

    useEffect(() => {
        getApiList();
        getCategoryList();
    }, [])
    useEffect(() => {
        if (categoryId) {
            getSubCategoryList();
        } else {
            setSubCategoryList([])
        }
        // setSubCategoryId(0);
        // getSubCategoryList();
    }, [categoryId])

    const refresh = () => {
      const resetCategory = 0;
      const resetSubCategory = 0;
      setCategoryId(resetCategory);
      setSubCategoryId(resetSubCategory);
      getApiList(1, resetCategory, resetSubCategory);
    }

    return (
        <div className="mx-2 card-admin-main">
            <div className="card-body card-bg">
                <div className="row justify-content-between">
                    <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                        <h4 className="mb-2">Api List</h4>
                    </div>
                    <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 col-12 d-flex justify-content-xl-end justify-content-lg-end justify-content-md-center justify-content-sm-center justify-content-center">
                        <button className="btn btn-primary py-1" onClick={() => { navigate(`/${import.meta.env.VITE_ADMIN_BASE_PATH}/create-api`) }} >Add Api</button>
                    </div>
                </div>
            </div>



            <div className="mt-4">
                <div className="row align-items-center">
                    <label className="form-label" htmlFor="categoryid">Filters</label>
                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 mb-3">
                        <select className="form-select" id="categoryid" name="categoryid"
                            value={categoryId}
                            onChange={(e) => { setCategoryId(Number(e.target.value)) }}>
                            <option value={0}>Select Category</option>
                            {
                                categoryList.map((m, i) => (
                                    <option key={arrayIndex('category', i)} value={m?.id}>{m.categoryname}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 mb-3">
                        <select className="form-select" id="subcategoryid" name="subcategoryid"
                            value={subCategoryId}
                            onChange={(e) => { setSubCategoryId(Number(e.target.value)) }}>
                            <option value={0}>Select Subcategory</option>
                            {
                                subCategoryList.map((m, i) => (
                                    <option key={arrayIndex('sub-category', i)} value={m?.id}>{m.subcategoryname}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 mb-3">
                        <button className="btn btn-primary profilePageButton px-3 search-btn" onClick={() => { getApiList(1) }}>Search </button>
                        <button className="btn btn-outline-primary ms-2 profilePageButton px-3 search-btn" onClick={refresh}><i className="fas fa-sync-alt"></i> </button>
                    </div>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table table-bordered custom-table table-striped ">
                    <thead className="text-truncate">
                        <tr>
                            <th>Sr. No</th>
                            <th>Api Name</th>
                            <th>Category</th>
                            <th>Subcategory</th>
                            <th>Created Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            apiList.map((api, i) => (
                                <tr key={arrayIndex('api', i)}>
                                    <td>{i + 1}</td>
                                    <td>{api.apiname}</td>
                                    <td>{api.categoryname}</td>
                                    <td>{api.subcategoryname}</td>
                                    <td>{moment(api.createddate || new Date()).format('DD-MMM-yyyy')}</td>
                                    <td>
                                        <div className="d-flex">
                                            <Form.Check // prettier-ignore
                                                type="switch"
                                                id="custom-switch"
                                                // checked={api.isenabled}
                                            />
                                            <button className="btn btn-primary btn-sm mx-2" title="Edit Category" onClick={() => { navigate('/master/update-api/' + api.uniqueid) }}>
                                                <i className="fa fa-pencil" ></i>
                                            </button>
                                            <button className="btn btn-danger btn-sm" title="Delete Category" onClick={() =>  confirm_swall_call_delete(api)}>
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
                    onPageChange={(page) => getApiList(page)}
                />
            </div>
            {loader.pageloder && <PageLoaderBackdrop />}
        </div>
    )
}

export default ApiList
