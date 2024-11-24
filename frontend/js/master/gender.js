
import Config, { handleGETAXIORequest, handlePOSTAXIORequest } from '../config.js';

export async function getGenderList() {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.BACKEND_URL}/admin/gender-panel`, 'GET');
        if(!isValid) alert(message)        
        return data ?? [];
    } catch (err) {
        console.error(err);
        return [];
    }
}
export async function postNewGender(formData) {
    try {
        const reqData = JSON.stringify(formData);
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.BACKEND_URL}/admin/gender-panel`, reqData, 'POST');
        if(!isValid) alert(message)
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}
export async function putGenderDetails(formData) {
    try {
        const reqData = JSON.stringify(formData);
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.BACKEND_URL}/admin/gender-panel`, reqData, 'PUT');
        if(!isValid) alert(message)
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}
export async function deleteGender(genderID) {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.BACKEND_URL}/admin/gender-panel/${genderID}`, 'DELETE');
        if(!isValid) alert(message);
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}