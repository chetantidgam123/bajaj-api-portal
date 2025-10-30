// function api_encrypt(plainData, encKey) {
//     try {
//         const salt = crypto.randomBytes(16); // 16 bytes = 128-bit
//         const plainKey = atob(encKey);
//         const key = crypto.pbkdf2Sync(plainKey, salt, 65536, 32, "sha256"); // 256-bit key

//         const iv = crypto.randomBytes(16); // AES block size = 16 bytes

//         const encrypted = CryptoJS.AES.encrypt(plainData, CryptoJS.enc.Hex.parse(key.toString("hex")), {
//             iv: CryptoJS.enc.Hex.parse(iv.toString("hex")),
//             mode: CryptoJS.mode.CBC,
//             padding: CryptoJS.pad.Pkcs7,
//         });

//         // Combine salt + iv + ciphertext
//         const encryptedBuffer = Buffer.concat([salt, iv, Buffer.from(encrypted.toString(), "base64")]);
//         return encryptedBuffer.toString("base64");
//     } catch (err) {
//         console.error("Encryption Error:", err);
//         return null;
//     }
// }

// function api_decrypt(encData, encKey) {
//     try {
//         const encryptedBuffer = Buffer.from(encData, "base64");

//         const salt = encryptedBuffer.slice(0, 16);
//         const iv = encryptedBuffer.slice(16, 32);
//         const ciphertext = encryptedBuffer.slice(32);
//         const plainKey = atob(encKey);
//         const key = crypto.pbkdf2Sync(plainKey, salt, 65536, 32, "sha256");

//         const decrypted = CryptoJS.AES.decrypt(
//             CryptoJS.enc.Base64.stringify(CryptoJS.lib.WordArray.create(ciphertext)),
//             CryptoJS.enc.Hex.parse(key.toString("hex")),
//             {
//                 iv: CryptoJS.enc.Hex.parse(iv.toString("hex")),
//                 mode: CryptoJS.mode.CBC,
//                 padding: CryptoJS.pad.Pkcs7,
//             }
//         );

//         return decrypted.toString(CryptoJS.enc.Utf8);
//     } catch (err) {
//         console.error("Decryption Error:", err);
//         return null;
//     }
// }




import CryptoJS from "crypto-js";
const encKey = "R1NtbWhGbkM4OVhFTW5QbVllYmJzSDM1WFlia2NucHo="
function api_encrypt(plainData, encKey) {
    try {
        const salt = CryptoJS.lib.WordArray.random(16); // 16 bytes salt
        const iv = CryptoJS.lib.WordArray.random(16);   // 16 bytes IV

        // Derive key using PBKDF2 (same params)
        const key = CryptoJS.PBKDF2(CryptoJS.enc.Base64.parse(encKey), salt, {
            keySize: 256 / 32,
            iterations: 65536,
            hasher: CryptoJS.algo.SHA256,
        });

        const encrypted = CryptoJS.AES.encrypt(plainData, key, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        // Combine salt + iv + ciphertext
        const combined = salt.concat(iv).concat(encrypted.ciphertext);

        return CryptoJS.enc.Base64.stringify(combined);
    } catch (err) {
        console.error("Encryption Error:", err);
        return null;
    }
}

function api_decrypt(encData, encKey) {
    try {
        const combined = CryptoJS.enc.Base64.parse(encData);
        const salt = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4));  // 16 bytes
        const iv = CryptoJS.lib.WordArray.create(combined.words.slice(4, 8));    // 16 bytes
        const ciphertext = CryptoJS.lib.WordArray.create(combined.words.slice(8));

        const key = CryptoJS.PBKDF2(CryptoJS.enc.Base64.parse(encKey), salt, {
            keySize: 256 / 32,
            iterations: 65536,
            hasher: CryptoJS.algo.SHA256,
        });

        const decrypted = CryptoJS.AES.decrypt({ ciphertext }, key, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (err) {
        console.error("Decryption Error:", err);
        return null;
    }
}

export {
    api_encrypt,
    api_decrypt,
    encKey
}
