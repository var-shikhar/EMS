import Config, { handleGETAXIORequest, handlePOSTAXIORequest } from '../config.js';

export async function getOrderList() {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.INVENTORY_BACKEND}/admin/order-panel`, 'GET');
        if(!isValid) alert(message)        
        return data ?? [];
    } catch (err) {
        console.error(err);
        return [];
    }
}
export async function getOrderSummary(orderID) {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.INVENTORY_BACKEND}/admin/order-panel/${orderID}`, 'GET');
        if(!isValid) alert(message)        
        return data ?? [];
    } catch (err) {
        console.error(err);
        return [];
    }
}
export async function getTransactionList(orderID) {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.INVENTORY_BACKEND}/admin/transaction-list/${orderID}`, 'GET');
        if(!isValid) alert(message)        
        return data ?? [];
    } catch (err) {
        console.error(err);
        return [];
    }
}
export async function postPayment(formData) {
    try {
        const reqData = JSON.stringify(formData);
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.INVENTORY_BACKEND}/admin/transaction-list`, reqData, 'POST');
        if(!isValid) alert(message)
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function getOrderFormOptions() {
    try {
        const [vendorList, assetList] = await Promise.all([
            handleGETAXIORequest(`${Config.INVENTORY_BACKEND}/admin/vendor-list`, 'GET'),
            handleGETAXIORequest(`${Config.INVENTORY_BACKEND}/admin/asset-list`, 'GET'),
        ]);

        if(!vendorList.isValid) alert(vendorList.message);
        if(!assetList.isValid) alert(assetList.message);

        return {vendors: vendorList.data ?? [], assets: assetList.data ?? []};
    } catch (err) {
        console.error(err);
        return {vendors: [], assets: []};
    }
}
export async function postOrder(formData) {
    try {
        const reqData = JSON.stringify(formData);
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.INVENTORY_BACKEND}/admin/order-panel`, reqData, 'POST');
        if(!isValid) alert(message)
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}