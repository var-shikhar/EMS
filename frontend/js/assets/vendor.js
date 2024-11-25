import Config, { handleGETAXIORequest, handlePOSTAXIORequest } from '../config.js';

export async function getFormOptions() {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.INVENTORY_BACKEND}/admin/list/category-panel`, 'GET');
        if(!isValid) alert(message)        
        return data ?? [];
    } catch (err) {
        console.error(err);
        return [];
    }
}
export async function getVendorList() {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.INVENTORY_BACKEND}/admin/vendor-panel`, 'GET');
        if(!isValid) alert(message)        
        return data ?? [];
    } catch (err) {
        console.error(err);
        return [];
    }
}
export async function postNewVendor(formData) {
    try {
        const reqData = JSON.stringify(formData);
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.INVENTORY_BACKEND}/admin/vendor-panel`, reqData, 'POST');
        if(!isValid) alert(message)
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}
export async function putVendorDetails(formData) {
    try {
        const reqData = JSON.stringify(formData);
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.INVENTORY_BACKEND}/admin/vendor-panel`, reqData, 'PUT');
        if(!isValid) alert(message)
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}
export async function deleteVendor(vendorID) {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.INVENTORY_BACKEND}/admin/vendor-panel/${vendorID}`, 'DELETE');
        if(!isValid) alert(message);
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}