

let token = '';
let currentPage = 1;
let totalPages = 1;

document.addEventListener("DOMContentLoaded", function() {
    const username = "luopeng";
    const password = "123456a";
    document.getElementById('username').value = username;
    document.getElementById('password').value = password;
    login(username, password);
});

// 用户登录函数
function login(username, password) {
    const loginUrl = 'http://dfyun.tuech.cn:2023/api.info/gettoken';

    fetch(loginUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: username,
            pwd: password
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('登录响应数据:', data);
        if (data.status === 1) {
            token = data.Data.token;
            document.getElementById('project-info').style.display = 'block';
            getProjectInfo();
        } else {
            alert(data.mess);
        }
    })
    .catch(error => {
        console.error('登录错误:', error);
        alert('登录失败');
    });
}

// 获取项目信息
function getProjectInfo() {
    const projectInfoUrl = 'http://dfyun.tuech.cn:2023/api.info/getproinfo';

    fetch(projectInfoUrl, {
        method: 'GET',
        headers: {
            token
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('项目信息响应数据:', data);
        if (data.status === 1) {
            displayProjectInfo(data.Data);
        } else {
            alert(data.mess);
        }
    })
    .catch(error => {
        console.error('项目信息错误:', error);
        alert('获取项目信息失败');
    });
}

// 显示项目信息
function displayProjectInfo(data) {
    const dataContainer = document.getElementById('data-container');
    dataContainer.innerHTML = '';

    data.forEach(project => {
        const projectDiv = document.createElement('div');
        const projectTitle = document.createElement('h3');
        projectTitle.textContent = project.pro_name + ' (' + project.create_time + ')';
        projectDiv.appendChild(projectTitle);

        const table = document.createElement('table');
        const headerRow = document.createElement('tr');
        const headers = ['IMEI', 'Status', 'ICCID', 'Volt', 'Batt', 'RSSI'];
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        project.imei.forEach(device => {
            const row = document.createElement('tr');
            Object.values(device).forEach(value => {
                const td = document.createElement('td');
                td.textContent = value;
                row.appendChild(td);
            });
            table.appendChild(row);
        });

        projectDiv.appendChild(table);
        dataContainer.appendChild(projectDiv);
    });
}

// 获取历史信息
function getHistoryInfo() {
    const imei = document.getElementById('imei').value;
    const page = currentPage;
    const limit = document.getElementById('limit').value || 10;

    if (!imei) {
        alert('请输入IMEI号');
        return;
    }

    const historyInfoUrl = `http://dfyun.tuech.cn:2023/api.info/getimeihistory?imei=${imei}&page=${page}&limit=${limit}`;

    console.log('获取历史信息的URL:', historyInfoUrl);

    fetch(historyInfoUrl, {
        method: 'GET',
        headers: {
            token
        }
    })
    .then(response => {
        console.log('响应状态:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP错误! 状态: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('历史信息响应数据:', data);
        if (data.status === 1) {
            totalPages = data.totalPage;
            displayHistoryInfo(data.Data.imeihistory);
        } else {
            alert(data.mess);
        }
    })
    .catch(error => {
        console.error('获取历史信息错误:', error);
        alert('获取历史信息失败');
    });
}

// 显示历史信息
function displayHistoryInfo(data) {
    const historyContainer = document.getElementById('history-container');
    const historyData = document.getElementById('history-data');
    const historyPagination = document.getElementById('history-pagination');
    const pageInfo = document.getElementById('page-info');

    historyContainer.style.display = 'block';
    historyData.innerHTML = '';
    historyPagination.style.display = 'block';
    pageInfo.textContent = `第 ${currentPage} 页，共 ${totalPages} 页`;

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    const headers = ['更新时间', '运行时间', '电压', '电池', 'RSSI'];
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    data.forEach(detail => {
        const row = document.createElement('tr');
        const values = [detail.imei_updatetime, detail.imei_runtime, detail.imei_volt, detail.imei_batt, detail.imei_rssi];
        values.forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            row.appendChild(td);
        });
        table.appendChild(row);
    });

    historyData.appendChild(table);
}

// 获取设备详情
function getDeviceDetails() {
    const imei = document.getElementById('imei').value;

    if (!imei) {
        alert('请输入IMEI号');
        return;
    }

    const detailsInfoUrl = `http://dfyun.tuech.cn:2023/api.info/getimeidetails?imei=${imei}`;

    console.log('获取设备详情的URL:', detailsInfoUrl);

    fetch(detailsInfoUrl, {
        method: 'GET',
        headers: {
            token
        }
    })
    .then(response => {
        console.log('响应状态:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP错误! 状态: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('设备详情响应数据:', data);
        if (data.status === 1) {
            displayRawData(data, 'details-data');
        } else {
            alert(data.mess);
        }
    })
    .catch(error => {
        console.error('获取设备详情错误:', error);
        alert('获取设备详情失败');
    });
}

// 显示原始数据
function displayRawData(data, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';

    const imeiDetails = data.Data.imeidetails;

    // 创建表格
    const table = document.createElement('table');

    // 添加表格标题行
    const headerRow = document.createElement('tr');
    const headers = ['字段', '值'];
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // 添加数据行
    for (const key in imeiDetails) {
        const row = document.createElement('tr');
        
        const fieldCell = document.createElement('td');
        fieldCell.textContent = key;
        row.appendChild(fieldCell);
        
        const valueCell = document.createElement('td');
        valueCell.textContent = imeiDetails[key];
        row.appendChild(valueCell);
        
        table.appendChild(row);
    }

    container.appendChild(table);
}

// 获取设备传感器信息
function getDeviceSensorInfo() {
    const imei = document.getElementById('imei').value;

    if (!imei) {
        alert('请输入IMEI号');
        return;
    }

    const sensorInfoUrl = `http://dfyun.tuech.cn:2023/api.info/getimei2device?imei=${imei}`;

    console.log('获取设备传感器信息的URL:', sensorInfoUrl);

    fetch(sensorInfoUrl, {
        method: 'GET',
        headers: {
            token, // 使用 Authorization 头传递 token
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('响应状态:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP错误! 状态: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('设备传感器信息响应数据:', data);
        if (data.status === 1) {
            console.log('数据成功获取:', data.Data);
            displayRawSensorData(data.Data);
        } else {
            console.error('API错误消息:', data.mess);
            alert(data.mess);
        }
    })
    .catch(error => {
        console.error('获取设备传感器信息错误:', error);
        alert('获取设备传感器信息失败');
    });
}


// 显示传感器信息
function displayRawSensorData(data) {
    const container = document.getElementById('sensor-data');
    container.innerHTML = ''; // 清空之前的内容

    // 创建表格元素
    const table = document.createElement('table');

    // 创建表头
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['传感器名称', '实时值', '参考值', '状态', '时间'];

    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // 创建表格主体
    const tbody = document.createElement('tbody');

    data.forEach(sensor => {
        const row = document.createElement('tr');

        // 创建表格单元格并填入数据
        const nameCell = document.createElement('td');
        nameCell.textContent = sensor.sName || 'N/A';
        row.appendChild(nameCell);

        const realTimeValueCell = document.createElement('td');
        realTimeValueCell.textContent = sensor.sRealTimeValue || 'N/A';
        row.appendChild(realTimeValueCell);

        const referValueCell = document.createElement('td');
        referValueCell.textContent = sensor.sReferValue || 'N/A';
        row.appendChild(referValueCell);

        const statusCell = document.createElement('td');
        statusCell.textContent = sensor.sStatus || 'N/A';
        row.appendChild(statusCell);

        const timeCell = document.createElement('td');
        timeCell.textContent = sensor.sTime || 'N/A';
        row.appendChild(timeCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
}

// 获取最新传感器数据
function getLatestSensorData() {
    const sDataTable = document.getElementById('sDataTable').value;
    const type = document.getElementById('type').value;

    if (!sDataTable || !type) {
        alert('请输入传感器名称和类型');
        return;
    }

    const latestSensorInfoUrl = 'http://dfyun.tuech.cn:2023/api.info/getDeviceNewInfoByDeviceName';

    console.log('获取最新传感器数据的URL:', latestSensorInfoUrl);
    console.log('sDataTable:', sDataTable);
    console.log('类型:', type);

    fetch(latestSensorInfoUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            token
        },
        body: JSON.stringify({
            sDataTable,
            type
        })
    })
    .then(response => {
        console.log('响应状态:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP错误! 状态: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('最新传感器数据响应:', data);
        if (data.status === 1) {
            console.log('数据成功获取:', data.Data);
            displayLatestSensorData(data.Data);
        } else {
            console.error('API错误消息:', data.mess);
            alert(data.mess);
        }
    })
    .catch(error => {
        console.error('获取最新传感器数据错误:', error);
        alert('获取最新传感器数据失败');
    });
}

// 显示最新传感器数据为表格
function displayLatestSensorData(data) {
    const container = document.getElementById('latest-sensor-data');
    container.innerHTML = ''; // 清空之前的内容

    // 创建表格
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    // 添加表头
    const headerRow = document.createElement('tr');
    const headers = ['字段', '值'];
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        th.style.border = '1px solid black';
        th.style.padding = '8px';
        th.style.textAlign = 'left';
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // 添加数据行
    for (const key in data) {
        const row = document.createElement('tr');

        const fieldCell = document.createElement('td');
        fieldCell.textContent = key;
        fieldCell.style.border = '1px solid black';
        fieldCell.style.padding = '8px';
        row.appendChild(fieldCell);

        const valueCell = document.createElement('td');
        valueCell.textContent = data[key];
        valueCell.style.border = '1px solid black';
        valueCell.style.padding = '8px';
        row.appendChild(valueCell);

        table.appendChild(row);
    }

    container.appendChild(table);
}

// 翻页功能
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        getHistoryInfo();
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        getHistoryInfo();
    }
}
