import Config, { handleGETAXIORequest, handlePOSTAXIORequest } from '../config.js';

export async function getFormOptions() {
    try {
        const [roleOBJ, genderOBJ] = await Promise.all([
            handleGETAXIORequest(`${Config.BACKEND_URL}/admin/custom-role-list/Other`, 'GET'),
            handleGETAXIORequest(`${Config.BACKEND_URL}/admin/gender-panel`, 'GET'),
        ]);

        console.log(roleOBJ.data)
        if(!roleOBJ.isValid) alert(roleOBJ.message);
        if(!genderOBJ.isValid) alert(genderOBJ.message);
     
        return { genders: genderOBJ.data ?? [], roles: roleOBJ.data ?? [] }
    } catch (err) {
        console.error(err);
        return { genders: [], roles: [] }
    }
}
export async function getUsersList() {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.BACKEND_URL}/admin/other-user-panel`, 'GET');
        if(!isValid) alert(message)        
        return data ?? [];
    } catch (err) {
        console.error(err);
        return [];
    }
}
export async function postNewUser(formData) {
    try {
        const reqData = JSON.stringify(formData);
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.BACKEND_URL}/admin/other-user-panel`, reqData, 'POST');
        if(!isValid) alert(message)
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}
export async function putUserProfileUpdates(formData) {
    try {
        const reqData = JSON.stringify(formData);
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.BACKEND_URL}/admin/other-user-panel`, reqData, 'PUT');
        if(!isValid) alert(message)
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}
export async function updateStatus(userID, value) {
    try {
        const reqData = JSON.stringify({ id: userID, value: value });
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.BACKEND_URL}/admin/other-user-panel/${userID}`, reqData, 'PUT');
        if(!isValid) alert(message)
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
export async function deleteUser(userID) {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.BACKEND_URL}/admin/other-user-panel/${userID}`, 'DELETE');
        if(!isValid) alert(message);
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}

