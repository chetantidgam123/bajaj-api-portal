import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"

function Email() {
    const { token } = useParams();

    const navigate = useNavigate()
    useEffect(() => {
        checkToken();
    }, [token])

    const checkToken = async () => {
        if (token && token.length > 0) {
            let resetPassData = await JSON.parse(atob(token));
            console.log(resetPassData)
            if (resetPassData.page && resetPassData.page === "/user/reset-password/") {
                // window.location.href = '/user/reset-password/' + resetPassData.uuid
                navigate('/user/reset-password/' + resetPassData.uuid);
            } else {
                navigate('/');
            }
        }
        else {
            navigate('/');
        }
    }

    return (
        <div>
            email
        </div>
    )
}

export default Email
