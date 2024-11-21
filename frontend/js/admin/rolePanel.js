import Config, { handleGETAXIORequest, handlePOSTAXIORequest } from '../config.js';

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