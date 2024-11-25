import Config, { handleGETAXIORequest, handlePOSTAXIORequest } from '../config.js';

export async function getFormOptions() {
    try {
        const [teacherList, classList] = await Promise.all([
            handleGETAXIORequest(`${Config.BACKEND_URL}/admin/section-panel/teacher-list`, 'GET'),
            handleGETAXIORequest(`${Config.BACKEND_URL}/admin/class-panel`, 'GET'),
        ]) 

        if(!teacherList.isValid) alert(teacherList.message)
        if(!classList.isValid) alert(classList.message)        
        
        return { teachers: teacherList.data ?? [], classes: classList.data ?? [] }
    } catch (err) {
        console.error(err);
        return { teacherList: [], classList: [] }
    }
}
export async function getSectionList() {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.BACKEND_URL}/admin/section-panel`, 'GET');
        if(!isValid) alert(message)        
        return data ?? [];
    } catch (err) {
        console.error(err);
        return [];
    }
}
export async function postNewSection(formData) {
    try {
        const reqData = JSON.stringify(formData);
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.BACKEND_URL}/admin/section-panel`, reqData, 'POST');
        if(!isValid) alert(message)
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}
export async function putSectionDetails(formData) {
    try {
        const reqData = JSON.stringify(formData);
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.BACKEND_URL}/admin/section-panel`, reqData, 'PUT');
        if(!isValid) alert(message)
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}
export async function deleteSection(sectionID) {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.BACKEND_URL}/admin/section-panel/${sectionID}`, 'DELETE');
        if(!isValid) alert(message);
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}