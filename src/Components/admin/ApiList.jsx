import moment from "moment"
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { post_auth_data } from "../../ApiServices";
import { arrayIndex, convertToPayload, offsetPagination } from "../../Utils";
import { useNavigate } from "react-router-dom";
import { error_swal_toast } from "../../SwalServices";
import { PageLoaderBackdrop } from "../../Loader";
function ApiList() {
    const [apiList, setApiList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [subCategoryList, setSubCategoryList] = useState([]);
    const [categoryId, setCategoryId] = useState(0);
    const [subCategoryId, setSubCategoryId] = useState(0);
    const [loader, setLoader] = useState({ pageloder: false })
    const navigate = useNavigate();
    const getApiList = (page = 1) => {
        setLoader({ ...loader, pageloder: true })
        post_auth_data("portal/private", convertToPayload('get-all-apis', {
            categoryid: categoryId,
            subcategoryid: subCategoryId,
            offset: ((page - 1) * offsetPagination),
            lmit: offsetPagination
        }), {})
            .then((response) => {
                setLoader({ ...loader, pageloder: false })
                if (response.data.status) {
                    setApiList(response.data.data || [])
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
    }, [categoryId])
    return (
        <div className="mx-2 card-admin-main">
            <div className="card-body card-bg">
 <div className="row justify-content-between">
                    <div className="col-3">
                        <h4 className="mb-2">Api List</h4>
                    </div>
                    <div className="col-2 d-flex justify-content-end">
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
                        onChange={(e) => { setCategoryId(e.target.value) }}>
                        <option value="">Select Category</option>
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
                        onChange={(e) => { setSubCategoryId(e.target.value) }}>
                        <option value="">Select Subcategory</option>
                        {
                            subCategoryList.map((m, i) => (
                                <option key={arrayIndex('sub-category', i)} value={m?.id}>{m.subcategoryname}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 mb-3">
                <button className="btn btn-primary profilePageButton px-3 search-btn">Search </button>
                </div>
            </div>
         </div>
          <div className="table-responsive">
            <table className="table table-bordered custom-table table-striped ">
                <thead>
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
                                        />
                                        <button className="btn btn-primary btn-sm mx-2" title="Edit Category" onClick={() => { navigate('/master/update-api/' + api.uniqueid) }}>
                                            <i className="fa fa-pencil" ></i>
                                        </button>
                                        <button className="btn btn-danger btn-sm" title="Delete Category">
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
            {loader.pageloder && <PageLoaderBackdrop />}
        </div>
    )
}

export default ApiList
