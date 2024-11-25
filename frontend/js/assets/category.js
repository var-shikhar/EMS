import Config, { handleGETAXIORequest, handlePOSTAXIORequest } from '../config.js';

export async function getCategoryList() {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.INVENTORY_BACKEND}/admin/category-panel`, 'GET');
        if(!isValid) alert(message)        
        return data ?? [];
    } catch (err) {
        console.error(err);
        return [];
    }
}
export async function postNewCategory(formData) {
    try {
        const reqData = JSON.stringify(formData);
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.INVENTORY_BACKEND}/admin/category-panel`, reqData, 'POST');
        if(!isValid) alert(message)
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}
export async function putCategoryDetails(formData) {
    try {
        const reqData = JSON.stringify(formData);
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.INVENTORY_BACKEND}/admin/category-panel`, reqData, 'PUT');
        if(!isValid) alert(message)
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}
export async function putCategoryStatus(formData) {
    try {
        const reqData = JSON.stringify(formData);
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.INVENTORY_BACKEND}/admin/category-panel/${formData.categoryID}`, reqData, 'PUT');
        if(!isValid) alert(message);
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}
export async function deleteCategory(categoryID) {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.INVENTORY_BACKEND}/admin/category-panel/${categoryID}`, 'DELETE');
        if(!isValid) alert(message);
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}