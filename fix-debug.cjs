const fs = require('fs');
let content = fs.readFileSync('src/Components/admin/RequestAccessList.jsx', 'utf8');

// Add better error logging to see full error details
content = content.replace(
    /catch \(error\) \{\s+console\.log\("159",error\.message\)\s+error_swal_toast\(error\.message \|\| "API call failed"\);/g,
    `catch (error) {
            console.log("159 Full Error:", error);
            console.log("159 Error Response:", error?.response);
            console.log("159 Error Response Data:", error?.response?.data);
            error_swal_toast(error?.response?.data?.message || error.message || "API call failed");`
);

fs.writeFileSync('src/Components/admin/RequestAccessList.jsx', content);
console.log('Done');
