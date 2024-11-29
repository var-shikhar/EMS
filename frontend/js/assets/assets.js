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
export async function getAssetList() {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.INVENTORY_BACKEND}/admin/asset-panel`, 'GET');
        if(!isValid) alert(message)        
        return data ?? [];
    } catch (err) {
        console.error(err);
        return [];
    }
}
export async function postNewAsset(formData) {
    try {
        const reqData = JSON.stringify(formData);
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.INVENTORY_BACKEND}/admin/asset-panel`, reqData, 'POST');
        if(!isValid) alert(message)
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}
export async function putAssetDetails(formData) {
    try {
        const reqData = JSON.stringify(formData);
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.INVENTORY_BACKEND}/admin/asset-panel`, reqData, 'PUT');
        if(!isValid) alert(message)
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}
export async function deleteAsset(assetID) {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.INVENTORY_BACKEND}/admin/asset-panel/${assetID}`, 'DELETE');
        if(!isValid) alert(message);
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}


// Order Controller
export async function getOrderFormOptions() {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.INVENTORY_BACKEND}/admin/vendor-list`, 'GET');
        if(!isValid) alert(message)        
        return data ?? [];
    } catch (err) {
        console.error(err);
        return [];
    }
}
export async function postNewOrder(formData) {
    try {
        const reqData = JSON.stringify(formData);
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.INVENTORY_BACKEND}/admin/asset-panel/order`, reqData, 'POST');
        if(!isValid) alert(message)
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}

// Allotment Controller
export async function getAllotmentUserType() {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.INVENTORY_BACKEND}/admin/role-list`, 'GET');
        if(!isValid) alert(message)        
        return data ?? [];
    } catch (err) {
        console.error(err);
        return [];
    }
}
export async function getAllotmentUsers(roleID) {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.INVENTORY_BACKEND}/admin/users-list/${roleID}`, 'GET');
        if(!isValid) alert(message)        
        return data ?? [];
    } catch (err) {
        console.error(err);
        return [];
    }
}
export async function postAllotAsset(formData) {
    try {
        const reqData = JSON.stringify(formData);
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.INVENTORY_BACKEND}/admin/asset-panel/allotment`, reqData, 'POST');
        if(!isValid) alert(message)
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}
