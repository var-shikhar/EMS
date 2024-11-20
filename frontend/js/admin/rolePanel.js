import Config from '../config.js';


const handleGETAXIORequest = async (beRoute, reqType = 'GET') => {
    const token = sessionStorage.getItem("authToken");
    if (!token) window.location.href = 'sign-in.html'

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

const handlePOSTAXIORequest = async (beRoute, reqData, reqType) => {
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


export async function getRoleList() {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.BACKEND_URL}/admin/roles`, 'GET');
        if(!isValid) alert(message)
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
export async function postNewRole(roleName) {
    try {
        const reqData = JSON.stringify({ name: roleName });
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.BACKEND_URL}/admin/roles`, reqData, 'POST');
        if(!isValid) alert(message)
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
export async function updateRole(roleID, roleName) {
    try {
        const reqData = JSON.stringify({
            id: roleID,
            name: roleName
        });
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.BACKEND_URL}/admin/roles`, reqData, 'PUT');
        if(!isValid) alert(message)
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
export async function deleteRole(roleID) {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.BACKEND_URL}/admin/roles/${roleID}`, 'DELETE');
        if(!isValid) alert(message);
        return true;
    } catch (err) {
        console.error(err);
        throw err;
    }
}