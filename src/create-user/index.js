const axios = require("axios");

const BASE_URL = "http://localhost:8000";
const MANAGER_USERNAME = "MindPoint"; // <-- сюда вставь username вашего менеджера

async function login(username, password) {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        username,
        password,
    });

    return response.data.access || response.data.token;
}

async function attachToManager(token, managerUsername) {
    const response = await axios.post(
        `${BASE_URL}/api/employee_settings/request_manager_by_name`,
        {
            manager_username: managerUsername,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}

async function bindUsersToManager() {
    for (let i = 10; i <= 100; i++) {
        const username = `test${i}`;

        try {
            const token = await login(username, "123");
            const result = await attachToManager(token, MANAGER_USERNAME);

            console.log(`✅ ${username} закреплён за менеджером ${MANAGER_USERNAME}`);
            console.log(result);
        } catch (e) {
            console.log(`❌ Ошибка для ${username}`);
            console.log(e.response?.data || e.message);
        }
    }
}

bindUsersToManager();