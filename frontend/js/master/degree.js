
import Config, { handleGETAXIORequest, handlePOSTAXIORequest } from '../config.js';

export async function getFormOptions() {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.BACKEND_URL}/admin/degree-panel/dept-list`, 'GET');
        if(!isValid) alert(message)        
        return data ?? [];
    } catch (err) {
        console.error(err);
        return [];
    }
}
export async function getDegreeList() {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.BACKEND_URL}/admin/degree-panel`, 'GET');
        if(!isValid) alert(message)        
        return data ?? [];
    } catch (err) {
        console.error(err);
        return [];
    }
}
export async function postNewDegree(formData) {
    try {
        const reqData = JSON.stringify(formData);
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.BACKEND_URL}/admin/degree-panel`, reqData, 'POST');
        if(!isValid) alert(message)
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}
export async function putDegreeDetails(formData) {
    try {
        const reqData = JSON.stringify(formData);
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.BACKEND_URL}/admin/degree-panel`, reqData, 'PUT');
        if(!isValid) alert(message)
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}
export async function deleteDegree(degreeID) {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.BACKEND_URL}/admin/degree-panel/${degreeID}`, 'DELETE');
        if(!isValid) alert(message);
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}