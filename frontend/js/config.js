const Config = {
    BACKEND_URL: 'http://localhost:8080',
    INVENTORY_BACKEND: 'http://localhost:8080',
    PASSWORD_REGEX: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
}


export const handleGETAXIORequest = async (beRoute, reqType = 'GET') => {
    const token = sessionStorage.getItem("authToken");
    if (!token) window.location.href = '../auth/sign-in.html'

    const response = await fetch(beRoute, {
        method: reqType,
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
    });

    const data = await response.json();
    if (response.ok) return {
        data: data, 
        isValid: true,
        message: data?.message || 'Success'
    }
    else return {
        data: [], 
        isValid: false,
        message: data.message
    }
};

export const handlePOSTAXIORequest = async (beRoute, reqData, reqType) => {
    const token = sessionStorage.getItem("authToken");
    if (!token) window.location.href = 'sign-in.html';

    const response = await fetch(beRoute, {
        method: reqType,
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: reqData,
    });

    const data = await response.json();
    if (response.ok) return {
        data: data, 
        isValid: true,
        message: data?.message || 'Success'
    }
    else return {
        data: [], 
        isValid: false,
        message: data.message
    }
};


export default Config