import instance from "@/utils/request";

export const getMakeUpClock = () => {
    return instance.get("/api/makeupClock/get");
}

export const handleMakeUpClock = (id, params) => {
    return instance.put(`/api/makeupClock/update/${id}`, params);
}

export const handleExportClock = async () => {
    try {
        const response = await instance.get('/api/clock/export', {
            responseType: 'blob',
        });

        const excelBlob = response;

        // 创建一个虚拟的下载链接，使用户可以点击下载
        const link = document.createElement('a');
        link.href = URL.createObjectURL(excelBlob);
        link.download = 'weekly_report.xlsx'; // 下载的文件名
        link.style.display = 'none';

        // 将链接添加到 DOM 并触发点击事件
        document.body.appendChild(link);
        link.click();

        // 清理链接对象
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error('发生错误:', error);
    }
};
