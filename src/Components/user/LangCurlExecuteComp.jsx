import { arrayIndex, copyToClipboard, generators, lang } from "../../Utils"
import SyntaxHighLighter from "./SyntaxHighLighter"
import { useEffect, useState } from "react"
import PropTypes from 'prop-types';
import { Badge } from "react-bootstrap";
import { scrollToTop } from "../../Utils";
function LangCurlExecuteComp({ apiData, setStatusCode,bodyReqSample,tryit=false }) {
    const [sampleRes, setSampleRes] = useState(null);
    const [sampleReq, setSampleReq] = useState(null);
    const generateLangReq = (lang) => {
        let obj = {
            // body: JSON.parse(apiData.reqsample || '{}'),
            body: bodyReqSample,
            method: apiData.apimethod,
            url: apiData.apiurl,
            request_header: JSON.parse(apiData.reqheader.value || '[]')
        }
        let res = generators[lang](obj);
        setSampleReq(res);
    }
    const genrateCodeRes = (code) => {
        setStatusCode(code)
        if (code) {
            try {
                let res = JSON.parse(apiData.responses?.value || '[]').filter((c) => c.code == code);
                setSampleRes(JSON.parse(res[0].resbody || '{}'));
            } catch (error) {
                console.log(error)
                setSampleRes({});
            }
        } else {
            setSampleRes({});
        }
    }
    useEffect(() => {
        scrollToTop()
    }, [])
    useEffect(() => {
        generateLangReq('curl')
        const firstCode = JSON.parse(apiData.responses?.value || '[]')[0]?.code;
        if (firstCode) {
            genrateCodeRes(firstCode);
        }
    }, [apiData.uniqueid,bodyReqSample])
    return (
        <div>
            <div className="card mb-3">
                {/* <div className="card-body card-bg d-flex align-items-center p-2">
                    <div className="row align-items-center">
                        <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                            <Badge pill bg="" className={`me-2 badge-${apiData.apimethod.toLowerCase()}`}> {apiData.apimethod}</Badge>
                        </div>
                        <div className="col-xl-7 col-lg-7 col-md-6 col-sm-12 col-12">
                            <small className="word-break">{apiData.apiurl}</small>
                        </div>
                        <div className="col-xl-2 col-lg-2 col-md-6 col-sm-12 col-12 d-flex justify-content-center">
                            <button
                                //  onClick={() => { copyToClipboard(JSON.parse(apiData.reqsample) || '{}') }}
                                className='span-btn-cirlce-btn'><img src="/assets/img/copy.png" alt="copy" /></button>
                        </div>
                    </div>
                </div> */}
                 <div className="card-body card-bg d-flex align-items-center p-2">
                <div className="d-flex align-items-center w-100">
                    <div className="d-flex align-items-center me-1">
                        <Badge pill bg="" className={`badge-${apiData.apimethod.toLowerCase()}`}>
                        {apiData.apimethod}
                        </Badge>
                    </div>
                    <div className="flex-grow-1 text-truncate">
                        <small className="word-break" title={apiData.apiurl}>
                        {apiData.apiurl?.replace(/^https?:\/\/[^/]+/, "{baseurl}")}
                        </small>
                    </div>
                    <div>
                        <button 
                        className='span-btn-cirlce-btn p-0' 
                        // onClick={() => navigator.clipboard.writeText(apiData.apiurl)}
                        onClick={() => { copyToClipboard(apiData.apiurl) }}
                        >
                        <img src="/assets/img/copy.png" alt="copy"/>
                        </button>
                    </div>
                </div>
                </div>
            </div>
            <div className="card mb-3">
                <div className="card-bg">
                    <h5 className="border-bottom pb-2">Languages you can test</h5>
                    <div className="language-tabs">
                        {lang.map((item, i) => (
                            <button className="span-btn" key={arrayIndex('lang', i)} onClick={() => { generateLangReq(item.lang) }}>
                                <img src={`/assets/img/lang/${item.img}.png`} alt={item.lang}
                                    className={`language-tab`} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="card mb-3">
                <div className="card-bg">
                    <div className="row d-flex justify-content-between align-items-start pb-2 border-bottom">
                        <div className='col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12'>
                            <h5 className=" mb-0">Request Sample</h5>
                        </div>
                        <div className='col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 d-flex justify-content-end'>
                            <button onClick={() => { copyToClipboard(sampleReq) }} className='span-btn-cirlce-btn'><img src="/assets/img/copy.png" alt="copy" /></button>
                        </div>

                    </div>


                    <SyntaxHighLighter jsonString={sampleReq} />
                </div>

            </div>
            {!tryit && <div className="card mb-3">
             <div className="card-bg">
                    <h5 className="border-bottom pb-2">Status Code</h5>
                    <select 
                        className="form-select" 
                        defaultValue={JSON.parse(apiData.responses?.value || '[]')[0]?.code || ''}
                        onChange={(e) => { genrateCodeRes(e.target.value) }}
                    >
                        {/* <option value="">Select status Code</option> */}
                        {
                            JSON.parse(apiData.responses?.value || '[]').map((code, i) => (
                                <option key={arrayIndex('code', i)} value={code.code}>{code.code}</option>
                            ))
                        }
                    </select>
             </div>
            </div>}
            <div className="card mb-3">
                 <div className="card-bg">
                      <div className="row d-flex justify-content-between align-items-start pb-2 border-bottom">
                        <div className='col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12'>
                           <h5 className="mb-0">Response Sample</h5>
                        </div>
                        <div className='col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 d-flex justify-content-end'>
                          <button onClick={() => { copyToClipboard(JSON.stringify(sampleRes || {}, null, 2)) }} className='span-btn-cirlce-btn'><img src="/assets/img/copy.png" alt="copy" /></button>
                        </div>

                    </div>

                
                    <SyntaxHighLighter jsonString={JSON.stringify(sampleRes || {}, null, 2)} />
                </div>
            </div>
        </div>
    )
}

LangCurlExecuteComp.propTypes = {
    apiData: PropTypes.any,
    setStatusCode: PropTypes.func,
    bodyReqSample: PropTypes.any,
    tryit: PropTypes.bool
}

export default LangCurlExecuteComp
