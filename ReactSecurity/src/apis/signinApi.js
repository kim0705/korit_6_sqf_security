import { instance } from "./util/instance";

export const signinApi = async (user) => {
    let signinData = {
        isSuccess: false,
        token: null,
        fieldErrors: [
            {
                field: "",
                defaultMessage: ""
            }
        ]
    };

    try {
        const response = await instance.post("/auth/signin", user);
        signinData = {
            isSuccess: true,
            token: response.data
        }
    } catch (error) {
        const response = error.response;
        signinData = {
            isSuccess: false,
        }
        
        if(typeof(response.data) === 'String') {
            signinData['errorStatus'] = "loginError";
            signinData['error'] = response.data;
        } else {
            signinData['errorStatus'] = "fieldError";
            signinData['errorStatus'] = response.data.map(fieldError => ({
                field: fieldError.field, 
                defaultMessage: fieldError.defaultMessage
            }));
        }
    }

    return signinData;
}