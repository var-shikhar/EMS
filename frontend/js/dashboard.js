import Config, { handleGETAXIORequest } from './config.js';

export async function getUserPanelDashboardData() {
    try {
        const dashboardData = await handleGETAXIORequest(`${Config.BACKEND_URL}/admin/dashboard-data/user-panel`, 'GET');

        if(!dashboardData.isValid) alert(roleOBJ.message);     
        return dashboardData.data ?? []
    } catch (err) {
        console.error(err);
        return []
    }
}