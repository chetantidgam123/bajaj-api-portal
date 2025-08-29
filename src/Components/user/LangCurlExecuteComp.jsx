import { arrayIndex, copyToClipboard, generators, lang } from "../../Utils"
import SyntaxHighLighter from "./SyntaxHighLighter"
import { useEffect, useState } from "react"
import PropTypes from 'prop-types';
import { Badge } from "react-bootstrap";
function LangCurlExecuteComp({ apiData, setStatusCode }) {
    const [sampleRes, setSampleRes] = useState(null);
    const [sampleReq, setSampleReq] = useState(null);
    const generateLangReq = (lang) => {
        let obj = {
            body: JSON.parse(apiData.reqsample || '{}'),
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
        console.log(apiData)
        generateLangReq('curl')
    }, [apiData.uniqueid])
    return (
        <div>
            <div className="card my-3">
                <div className="card-body d-flex align-items-center p-2">
                    <Badge pill bg="" className={`me-2 badge-${apiData.apimethod.toLowerCase()}`}> {apiData.apimethod}</Badge>
                    <small className="word-break">{apiData.apiurl}</small>
                </div>
            </div>
            <div className="card mb-3">
                <div className="card-header bg-white">
                    <h5>Languages you can test</h5>
                </div>
                <div className="card-body">
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
                <div className="card-header bg-white">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Request Sample</h5>
                        <button onClick={() => { copyToClipboard(sampleReq) }} className='span-btn'><img src="/assets/img/copy.png" alt="copy" /></button>
                    </div>
                </div>
                <div className="card-body">
                    <SyntaxHighLighter jsonString={sampleReq} />
                </div>
            </div>
            <div className="card mb-3">
                <div className="card-header bg-white">
                    <h5>Status Code</h5>
                </div>
                <div className="card-body">
                    <select className="form-select" onChange={(e) => { genrateCodeRes(e.target.value) }}>
                        <option value="">Select status Code</option>
                        {
                            JSON.parse(apiData.responses?.value || '[]').map((code, i) => (
                                <option key={arrayIndex('code', i)} value={code.code}>{code.code}</option>
                            ))
                        }
                    </select>
                </div>
            </div>
            <div className="card mb-3">
                <div className="card-header bg-white">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Response Sample</h5>
                        <button onClick={() => { copyToClipboard(JSON.stringify(sampleRes || {}, null, 2)) }} className='span-btn'><img src="/assets/img/copy.png" alt="copy" /></button>
                    </div>
                </div>
                <div className="card-body">
                    <SyntaxHighLighter jsonString={JSON.stringify(sampleRes || {}, null, 2)} />
                </div>
            </div>
        </div>
    )
}

LangCurlExecuteComp.propTypes = {
    apiData: PropTypes.any,
    setStatusCode: PropTypes.func,
}

export default LangCurlExecuteComp
