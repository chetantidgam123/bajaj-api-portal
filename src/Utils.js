
import CryptoJS from 'crypto-js';
import { jwtDecode } from "jwt-decode";
import { error_swal_toast, success_swal_toast } from './SwalServices';
const TOKEN_KEY = 'ff591090-0805-4282-8493-e9435a4d3d67';
const offsetPagination = 20;
const setTokenData = (data) => {
    const temp = JSON.stringify(data);
    let enc = encrypt(temp);
    localStorage.setItem(TOKEN_KEY, enc);
}
const getTokenData = () => {
    let session_data = localStorage.getItem(TOKEN_KEY);
    if (session_data && session_data.length > 0) {
        let decrypted = decrypt(session_data);
        if (decrypted && decrypted.length > 0) {
            let data = JSON.parse(decrypted);
            if (data?.jwt_token?.length > 0) {
                return data;
            }
        }
    }
    return null;
}
const getJwtData = () => {
    const token = getTokenData().jwt_token;
    if (token) {
        const decoded = jwtDecode(token);
        return decoded
    }
    return null
}
const generateRandAlphaNumStr = (len) => {
    let rdmString = '';
    for (
        ;
        rdmString.length < len;
        rdmString += Math.random().toString(36).substring(2)
    );
    return rdmString.substring(0, len);
};

const encrypt = (param) => {
    let key = generateRandAlphaNumStr(32);
    let iv = generateRandAlphaNumStr(16);
    let encrypted = CryptoJS.AES.encrypt(
        CryptoJS.enc.Utf8.parse(param),
        CryptoJS.enc.Utf8.parse(key),
        {
            keySize: 128 / 8,
            iv: CryptoJS.enc.Utf8.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        }
    );
    return btoa(key + iv + encrypted.toString());
};

const decrypt = (param) => {
    try {
        param = atob(param);
        param = param.replace(' ', '+');
        let key = CryptoJS.enc.Utf8.parse(param.substring(0, 32));
        let iv = CryptoJS.enc.Utf8.parse(param.substring(32, 32 + 16));
        let encryptedText = param.substring(32 + 16);
        let decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch {
        return '';
    }
};
const loanTypes = [
    { name: 'Select Loan Type', value: "" },
    { name: 'Personal Loan', value: 1 },
    { name: 'Crop Loan', value: 2 },
    { name: 'Business Loan', value: 3 }
]
function arrayIndex(tableName, id) {
    return (`${tableName}_${id}`)
}
const numeric_dec_Only = (inputText) => {
    if (inputText) {
        if (inputText.split(".").length > 2) {
            return false;
        }
        let afetrDec = inputText.split(".")[1];
        if (afetrDec?.length > 2) {
            return false
        }
        let patt = /^[0-9.]*$/;
        let result = patt.test(inputText.replaceAll(',', '').toString());
        return result;
    } else {
        return true;
    }
};
const numericOnly = (inputText) => {
    if (inputText) {
        let patt = /^\d+$/;
        let result = patt.test(inputText.replaceAll(',', ''));
        return result;
    } else {
        return true;
    }
};
const alphaNumericOnly = (inputText) => {
    if (inputText) {
        let patt = /^[a-zA-Z0-9]+$/;
        let result = patt.test(inputText);
        return result;
    } else {
        return true;
    }
};
const getKeyForTable = (keyLabel, index) => {
    return keyLabel + '_' + index
}

const convertToPayload = (api_name = "", body = {}, header = {}, uriparam = {}, other = "") => {
    let payload = {
        "apiType": api_name,
        "requestPayload": body,
        "requestHeaders": header,
        "uriParams": uriparam,
        "additionalParam": other
    }
    return payload
}

const apiMethods = [
    { id: 'GET', name: "GET" },
    { id: 'POST', name: "POST" },
    { id: 'PUT', name: "PUT" },
    { id: 'DELETE', name: "DELETE" },
    { id: 'PATCH', name: "PATCH" }
]
const statusCodes = [
    { id: '200', name: '200 OK' },
    { id: '400', name: '400 Bad Request' },
    { id: '401', name: '401 Unauthorized' },
    { id: '403', name: '403 Forbidden' },
    { id: '404', name: '404 Not Found' },
    { id: '405', name: '405 Method Not Allowed' },
    { id: '415', name: '415 Unsupported Media Type' },
    { id: '422', name: '422 Unprocessable Entity' },
    { id: '429', name: '429 Too Many Requests' },
    { id: '500', name: '500 Internal Server Error' },
    { id: '502', name: '502 Bad Gateway' },
    { id: '503', name: '503 Service Unavailable' },
    { id: '504', name: '504 Gateway Timeout' }
];


const isError = (formikFrom, fieldName) => {
    let condition = false;
    try {
        condition = (formikFrom.errors[fieldName] && formikFrom.touched[fieldName] || (formikFrom.isSubmitting && formikFrom.errors[fieldName]))
    } catch (_) {
        console.log(_)
        condition = false
    }
    return condition
}
async function sendEmail({ subject, body, toRecepients, ccRecepients = [], bccRecepients = [], attachments = {}, contentType }) {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}email/send`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            subject,
            contentType,
            toRecepients,
            ccRecepients,
            bccRecepients,
            attachments,
            body,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to send email');
    }

    return await response.json();
}


const availableApi = [
    // { title: "Encryption & Decryption", details: "Secure your data with industry-standard encryption and decryption mechanisms." },
    { title: "Authentication", details: "Enable safe, token-based authentication and authorization for your applications." },
    { title: "Sales API", details: "Access real-time data on bike models, availability, pricing, and dealer information." },
    { title: "Service API", details: "Integrate service booking, maintenance history, and service center locators seamlessly." }
]

const lang = [
    { img: "curl", lang: "curl" },
    { img: "php", lang: "php" },
    { img: "python", lang: "python" },
    { img: "nodejs", lang: "nodejs" },
    { img: "go", lang: "go" },
]

const generators = {
    curl: (apiData) => {
        const headers = apiData.request_header.map((h) => `--header '${h.key}: ${h.value}'`).join("\n");
        return `curl --location --request ${apiData.method} '${apiData.url}' \n${headers} \n--header 'Content-Type: application/json' \n--data-raw '${apiData.body}'`;
    },

    php: (apiData) => {
        const headers = apiData.request_header.map((h) => `"${h.key}: ${h.value}"`).concat(`"Content-Type: application/json"`).join(",\n    ");
        return `
<?php
$curl = curl_init();
$data = ${apiData.body};
curl_setopt_array($curl, [
CURLOPT_URL => "${apiData.url}",
CURLOPT_RETURNTRANSFER => true,
CURLOPT_CUSTOMREQUEST => "${apiData.method}",
CURLOPT_POSTFIELDS => json_encode($data),
CURLOPT_HTTPHEADER => [${headers}],
]);
$response = curl_exec($curl);
$err = curl_error($curl);
curl_close($curl);
echo $err ? "cURL Error: $err" : $response;
?>`;
    },

    python: (apiData) => {
        const headers = apiData.request_header.reduce((acc, h) => ({ ...acc, [h.key]: h.value }), { "Content-Type": "application/json" });
        return `
import requests
url = "${apiData.url}"
headers = ${JSON.stringify(headers, null, 2)}
payload = ${apiData.body}
response = requests.post(url, headers=headers, json=payload)
print(response.text)`;
    },

    nodejs: (apiData) => {
        const headers = apiData.request_header.reduce((acc, h) => ({ ...acc, [h.key]: h.value }), { "Content-Type": "application/json" });
        return `
const axios = require('axios');
const options = {
    method: '${apiData.method}',
    url: '${apiData.url}',
    headers: ${JSON.stringify(headers, null, 2)},
    data: ${apiData.body}
};
axios.request(options)
.then(res => {
    console.log(res.data);
    })
.catch(err => {
    console.error(err);
});`;
    },

    go: (apiData) => {
        return `
package main
import ( "bytes" "fmt" "net/http" "io/ioutil")
func main() {
url := "${apiData.url}"
payload := []byte(${JSON.stringify(apiData.body)})
req, _ := http.NewRequest("${apiData.method}",
url, bytes.NewBuffer(payload))
${apiData.request_header.map((h) => `req.Header.Set("${h.key}", "${h.value}")`).join("\n  ")}
req.Header.Set("Content-Type", "application/json")
client := &http.Client{}
res, _ := client.Do(req)
defer res.Body.Close()
body, _ := ioutil.ReadAll(res.Body)
fmt.Println(string(body))
}`;
    },
};

const scrollToElement = (targetElement) => {
    const element = document.getElementById(targetElement);  // Get the element by ID
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start', // scrolls to the top of the element
        });
    }
}
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // for smooth scrolling
    });
};

function trucateString(string, length) {
    if (string) {
        return string.length > length ? string.slice(0, length) + "..." : string
    }
    return ""
}
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            success_swal_toast("Copied to clipboard");
        })
        .catch(err => {
            error_swal_toast("Failed to copy", err);
        });
}


export {
    availableApi,
    isError,
    loanTypes,
    apiMethods,
    arrayIndex,
    numeric_dec_Only,
    numericOnly,
    alphaNumericOnly,
    getKeyForTable,
    convertToPayload,
    getTokenData,
    setTokenData,
    lang,
    sendEmail,
    generators,
    scrollToElement,
    scrollToTop,
    trucateString,
    offsetPagination,
    getJwtData,
    statusCodes,
    copyToClipboard
}