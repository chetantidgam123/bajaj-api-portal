import Swal from "sweetalert2";

const confirm_swal_with_text = (callback, title) => {
    Swal.fire({
        html: `<div className="modal-body">
  <div className="d-flex justify-content-center">
      <img src="/assets/img/info-circle.png" alt="">
  </div>
  <p className="text-center mt-3 px-4 letter-spacing roboto-medium font-18 ">${title}</p>
  </div>
  <div className="border-top"></div>`,
        reverseButtons: true,
        customClass: {
            confirmButton: 'btn btn-primary  py-2',
            cancelButton: 'btn btn-danger py-2'
        },
        allowOutsideClick: false,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Confirm',
        showCancelButton: true,
        padding: 20,
        showLoaderOnConfirm: true,
        preConfirm: async () => {
            const responce = await new Promise((res, rej) => {
                callback(res, rej)
            })

            return responce
        }
    }).then(() => {

    }).catch((err) => {
        console.log(err);
        Swal.close();

    })
}

const confirm_swal_with = (callback, title) => {
    Swal.fire({
        html: `<div className="modal-body">
  <div className="d-flex justify-content-center">
      <img src="/assets/img/info-circle.png" alt="">
  </div>
  <p className="text-center mt-3 px-4 letter-spacing roboto-medium font-18 ">${title}</p>
  </div>
  <div className="border-top"></div>`,

        customClass: {
            confirmButton: 'btn btn-primary py-2'
        },

        allowOutsideClick: false,
        confirmButtonText: 'Click Here',   // 👈 Only one button now
        padding: 20,
        showLoaderOnConfirm: true,

        preConfirm: async () => {
            const response = await new Promise((res, rej) => {
                callback(res, rej)
            });
            return response;
        }
    })
    .then(() => {})
    .catch(err => {
        console.log(err);
        Swal.close();
    });
};

const confirm_swal_success = (callback, title) => {
    Swal.fire({
        html: `<div className="modal-body">
  <div className="d-flex justify-content-center">
      <img src="/assets/img/success.png" alt="">
  </div>
  <p className="text-center mt-3 px-4 letter-spacing roboto-medium font-18 ">${title}</p>
  </div>
  <div className="border-top"></div>`,

        customClass: {
            confirmButton: 'btn btn-primary py-2'
        },

        allowOutsideClick: false,
        confirmButtonText: 'Click Here',   // 👈 Only one button now
        padding: 20,
        showLoaderOnConfirm: true,

        preConfirm: async () => {
            const response = await new Promise((res, rej) => {
                callback(res, rej)
            });
            return response;
        }
    })
    .then(() => {})
    .catch(err => {
        console.log(err);
        Swal.close();
    });
};


const success_swal_toast = (msg) => {
    Swal.fire({
        position: 'top-right',
        icon: 'success',
        toast: true,
        title: msg,
        showConfirmButton: false,
        showCloseButton: true,
        timer: 3000
    });
}
const error_swal_toast = (msg) => {
    Swal.fire({
        position: 'top-right',
        icon: 'error',
        toast: true,
        title: msg,
        showConfirmButton: false,
        showCloseButton: false,
        timer: 3000
    });

}
const show_error_swal_ok = (message) => {
    Swal.fire({
        html: `<div className="modal-body">
    <div className="d-flex justify-content-center">
        <img src="/assets/home/img/error-circle.png" alt="">
    </div>
    <p className="text-center mt-3 px-2 letter-spacing font-24 font-400 text-dark font-family mt-3 mb-0">${message}</p>
</div>
<div className="border-top d-none"></div>`,
        // confirmButtonText: '<button type="button" className="btn">Ok</button>',
        confirmButtonText: 'OK',
        customClass: { confirmButton: 'btn-violet-outline btn-hover-fill py-2' },
    });
}
function show_success_swal_ok(message) {
    Swal.fire({
        html: `<div className="modal-body">
    <div className="d-flex justify-content-center">
        <img src="/assets/home/img/successful-circle.png" alt="">
    </div>
    <p className="text-center px-2 letter-spacing font-24 font-400 text-dark font-family mt-3 mb-0">${message}</p>
</div>
<div className="border-top d-none"></div>`,
        confirmButtonText: 'OK',
        customClass: { confirmButton: 'btn-violet-outline btn-hover-fill py-2' },
        // confirmButtonText: '<button type="button" className="btn">Ok</button>',
    });
}
const threeButtonModel = (callback, sendForApproval) => {
    Swal.fire({
        html: `<div className="modal-body p-0 ttt">
  <div className="d-flex justify-content-center">
      <img src="/assets/home/img/info-circle.png" alt="">
  </div>
  <p className="text-center mt-3 pb-2 px-4 letter-spacing font-24 font-400 text-dark font-family">Please confirm the action you want<br>to continue.</p>
  </div>
  <div className="border-top"></div>`,
        reverseButtons: true,
        showDenyButton: true,
        allowOutsideClick: false,
        showCancelButton: true,
        customClass: {
            container: "threeButtonContainer",
            denyButton: 'btn-violet-outline btn-hover-fill threeButtonSwal  py-2 mt-3',
            confirmButton: 'btn-violet-outline btn-hover-fill threeButtonSwal py-2 mt-3',
            cancelButton: 'btn-violet-outline btn-hover-fill threeButtonSwal py-2 mt-3'
        },
        cancelButtonText: 'Discard Changes',
        confirmButtonText: 'Continue Editing',
        denyButtonText: 'Send for Approval',
        padding: 20,
        showLoaderOnDeny: true,
        preDeny: async () => {
            // try {
            //   const res = await sendForApproval();
            //   return true;
            // } catch (error) {
            //   return true;
            // }
            const responce = await new Promise((res, rej) => {
                sendForApproval(res, rej)
            })
            return responce
        }
    }).then(async (result) => {
        callback(result)
    }).catch((_) => { console.log(_); });
}

export {
    confirm_swal_with,
    confirm_swal_success,
    confirm_swal_with_text,
    success_swal_toast,
    error_swal_toast,
    show_error_swal_ok,
    show_success_swal_ok,
    threeButtonModel,
}