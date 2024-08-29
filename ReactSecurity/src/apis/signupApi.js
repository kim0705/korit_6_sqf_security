import { instance } from "./util/instance"

export const signupApi = async (user) => {
    let signupData = {
        isSuccess: false,
        ok: {
            message: "",
            user: null
        },
        fieldErrors: [
            {
                field: "",
                defaultMessage: ""
            }
        ]
    };

    try {
        const response = await instance.post("/auth/signup", user);
        signupData = {
            isSuccess: true,
            ok: response.data
        }
    } catch (error) {
        const response = error.response;
        signupData = {
            isSuccess: false,
            fieldErrors: response.data.map(fieldError => ({
                field: fieldError.field, 
                defaultMessage: fieldError.defaultMessage
            }))
        }
    }

    return signupData;
}