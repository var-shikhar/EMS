import Config, { handleGETAXIORequest, handlePOSTAXIORequest } from '../config.js';

export async function getFormOptions() {
    try {
        const [roleOBJ, departmentOBJ, degreeOBJ, genderOBJ] = await Promise.all([
            handleGETAXIORequest(`${Config.BACKEND_URL}/admin/custom-role-list/Educator`, 'GET'),
            handleGETAXIORequest(`${Config.BACKEND_URL}/admin/department-panel`, 'GET'),
            handleGETAXIORequest(`${Config.BACKEND_URL}/admin/degree-panel`, 'GET'),
            handleGETAXIORequest(`${Config.BACKEND_URL}/admin/gender-panel`, 'GET'),
        ]);

        if(!roleOBJ.isValid) alert(roleOBJ.message);
        if(!departmentOBJ.isValid) alert(departmentOBJ.message);
        if(!degreeOBJ.isValid) alert(degreeOBJ.message);
        if(!genderOBJ.isValid) alert(genderOBJ.message);
     
        return { genders: genderOBJ.data ?? [], degrees: degreeOBJ.data ?? [], departments: departmentOBJ.data ?? [], roles: roleOBJ.data ?? [] }
    } catch (err) {
        console.error(err);
        return { genders: [], degrees: [], departments: [], roles: [] }
    }
}
export async function getEducatorList() {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.BACKEND_URL}/admin/educator-panel`, 'GET');
        if(!isValid) alert(message)        
        return data ?? [];
    } catch (err) {
        console.error(err);
        return [];
    }
}
export async function postNewEducator(formData) {
    try {
        const reqData = JSON.stringify(formData);
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.BACKEND_URL}/admin/educator-panel`, reqData, 'POST');
        if(!isValid) alert(message)
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}
export async function putEducatorProfile(formData) {
    try {
        const reqData = JSON.stringify(formData);
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.BACKEND_URL}/admin/educator-panel`, reqData, 'PUT');
        if(!isValid) alert(message)
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}
export async function updateStatus(educatorID, value) {
    try {
        const reqData = JSON.stringify({ id: educatorID, value: value });
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.BACKEND_URL}/admin/educator-panel/${educatorID}`, reqData, 'PUT');
        if(!isValid) alert(message)
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
export async function deleteEducator(educatorID) {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.BACKEND_URL}/admin/educator-panel/${educatorID}`, 'DELETE');
        if(!isValid) alert(message);
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}