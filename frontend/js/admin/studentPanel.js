import Config, { handleGETAXIORequest, handlePOSTAXIORequest } from '../config.js';

export async function getStudentList() {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.BACKEND_URL}/admin/student-panel`, 'GET');
        if(!isValid) alert(message)        
        return data ?? [];
    } catch (err) {
        console.error(err);
        return [];
    }
}
export async function getClassandSectionList() {
    try {
        const [classOBJ, sectionOBJ, genderOBJ] = await Promise.all([
            handleGETAXIORequest(`${Config.BACKEND_URL}/admin/class-panel`, 'GET'),
            handleGETAXIORequest(`${Config.BACKEND_URL}/admin/section-panel`, 'GET'),
            handleGETAXIORequest(`${Config.BACKEND_URL}/admin/gender-panel`, 'GET'),
        ]);

        if(!classOBJ.isValid) alert(classOBJ.message);
        if(!sectionOBJ.isValid) alert(sectionOBJ.message);
        if(!genderOBJ.isValid) alert(genderOBJ.message);
     
        return { classes: classOBJ.data ?? [], sections: sectionOBJ.data ?? [], genders: genderOBJ?.data ?? [] }
    } catch (err) {
        console.error(err);
        return { classes: [], sections: [], genders: [] }
    }
}
export async function postNewStudent(formData) {
    try {
        const reqData = JSON.stringify(formData);
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.BACKEND_URL}/admin/student-panel`, reqData, 'POST');
        if(!isValid) alert(message)
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}
export async function putStudentDetails(formData) {
    try {
        const reqData = JSON.stringify(formData);
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.BACKEND_URL}/admin/student-panel`, reqData, 'PUT');
        if(!isValid) alert(message)
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}
export async function updateStatus(studentID, value) {
    alert(value ? 'True' : 'False');
    try {
        const reqData = JSON.stringify({ id: studentID, value: value });
        const { data, isValid, message } = await handlePOSTAXIORequest(`${Config.BACKEND_URL}/admin/student-panel/${studentID}`, reqData, 'PUT');
        if(!isValid) alert(message)
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
export async function deleteStudent(studentID) {
    try {
        const { data, isValid, message } = await handleGETAXIORequest(`${Config.BACKEND_URL}/admin/student-panel/${studentID}`, 'DELETE');
        if(!isValid) alert(message);
        return isValid;
    } catch (err) {
        console.error(err);
        return false;
    }
}