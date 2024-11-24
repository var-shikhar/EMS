import Config, { handleGETAXIORequest, handlePOSTAXIORequest } from '../config.js';

export async function getFormOptions() {
    try {
        const [roleOBJ, degreeOBJ, genderOBJ] = await Promise.all([
            handleGETAXIORequest(`${Config.BACKEND_URL}/admin/custom-role-list/Academic`, 'GET'),
            handleGETAXIORequest(`${Config.BACKEND_URL}/admin/degree-panel`, 'GET'),
            handleGETAXIORequest(`${Config.BACKEND_URL}/admin/gender-panel`, 'GET'),
        ]);

        if(!roleOBJ.isValid) alert(roleOBJ.message);
        if(!degreeOBJ.isValid) alert(degreeOBJ.message);
        if(!genderOBJ.isValid) alert(genderOBJ.message);
     
        return { genders: genderOBJ.data ?? [], degrees: degreeOBJ.data ?? [], roles: roleOBJ.data ?? [] }
    } catch (err) {
        console.error(err);
        return { genders: [], degrees: [], roles: [] }
    }
}
export async function getAcadStaffList() {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.BACKEND_URL}/admin/academic-staff-panel`, 'GET');
        if(!isValid) alert(message)        
        return data ?? [];
    } catch (err) {
        console.error(err);
        return [];
    }
}
export async function postNewAcadStaff(formData) {
    try {
        const reqData = JSON.stringify(formData);
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.BACKEND_URL}/admin/academic-staff-panel`, reqData, 'POST');
        if(!isValid) alert(message)
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}
export async function putAcadStaffProfile(formData) {
    try {
        const reqData = JSON.stringify(formData);
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.BACKEND_URL}/admin/academic-staff-panel`, reqData, 'PUT');
        if(!isValid) alert(message)
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}
export async function updateStatus(staffID, value) {
    try {
        const reqData = JSON.stringify({ id: staffID, value: value });
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.BACKEND_URL}/admin/academic-staff-panel/${staffID}`, reqData, 'PUT');
        if(!isValid) alert(message)
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
export async function deleteAcadStaff(staffID) {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.BACKEND_URL}/admin/academic-staff-panel/${staffID}`, 'DELETE');
        if(!isValid) alert(message);
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}

