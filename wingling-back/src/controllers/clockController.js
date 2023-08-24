const User = require('../models/user');
const Attendance = require('../models/attendance');
const moment = require('moment-timezone');
const ExcelJS = require('exceljs');

const clockInController = (req, res) => {
    const userId = req.body.userId;
    const clockInTime = moment.tz(moment(), 'Asia/Shanghai');

    // 查找用户是否已经有当天的打卡记录
    Attendance.findOne({
        userId: userId,
        date: { $gte: moment().startOf('day').toDate() }
    })
        .then((attendance) => {
            if (attendance) {
                // 如果有当天的打卡记录，直接更新上卡时间
                attendance.clockInTimes.push(clockInTime);
                return attendance.save();
            } else {
                // 如果没有当天的打卡记录，创建新的打卡记录
                const newAttendance = new Attendance({
                    userId: userId,
                    date: moment().startOf('day').toDate(),
                    clockInTimes: [clockInTime]
                });
                return newAttendance.save();
            }
        })
        .then((savedAttendance) => {
            // 更新用户的 isClockedIn 状态为 true
            return User.findByIdAndUpdate(userId, { isClockedIn: true }, { new: true }).lean();
        })
        .then((updatedUser) => {
            res.json({
                code: 'SUCCESS',
                msg: '上卡成功',
                data: updatedUser
            });
        })
        .catch((err) => {
            console.error('上卡失败：', err);
            res.status(500).json({
                code: 'SERVER_ERROR',
                msg: '服务器错误，请稍后再试',
                data: null
            });
        });
};

const clockOutController = (req, res) => {
    const userId = req.body.userId;
    const clockOutTime = moment.tz(moment(), 'Asia/Shanghai');

    // 更新下卡时间
    Attendance.findOneAndUpdate(
        { userId: userId, date: moment().startOf('day').toDate() },
        { $push: { clockOutTimes: clockOutTime } },
        { new: true, upsert: true }
    ).lean()
        .then((updatedAttendance) => {
            // 获取一周的范围
            const weekStart = moment.tz('Asia/Shanghai').startOf('week').add(1, 'day');
            const weekEnd = moment.tz('Asia/Shanghai').endOf('week').add(1, 'day');

            // 查询整个一周的打卡记录
            return Attendance.find({
                userId: userId,
                date: { $gte: weekStart.toDate(), $lte: weekEnd.toDate() }
            }).lean()
                .then((weekAttendance) => {
                    let totalDuration = 0;

                    // 计算总时长
                    for (const record of weekAttendance) {
                        let dailyTotalDuration = 0;
                        if (record.clockInTimes.length < record.clockOutTimes.length) {
                            record.clockOutTimes.shift();
                        }
                        for (let i = 0; i < record.clockInTimes.length && i < record.clockOutTimes.length; i++) {
                            const clockInTime = moment.tz(record.clockInTimes[i], 'Asia/Shanghai');
                            const clockOutTime = moment.tz(record.clockOutTimes[i], 'Asia/Shanghai');
                            const duration = Math.round((clockOutTime - clockInTime) / (1000 * 60));
                            dailyTotalDuration += duration;
                        }

                        totalDuration += dailyTotalDuration;
                    }
                    console.log(totalDuration);

                    // 更新用户总时长
                    return User.findByIdAndUpdate(userId, { totalDuration: totalDuration, isClockedIn: false }, { new: true }).lean()
                        .then((updatedUser) => {
                            res.json({
                                code: 'SUCCESS',
                                msg: '下卡成功',
                                data: updatedUser
                            });
                        });
                });
        })
        .catch((err) => {
            console.error('下卡失败：', err);
            res.status(500).json({
                code: 'SERVER_ERROR',
                msg: '服务器错误，请稍后再试',
                data: null
            });
        });
};

const exportClockController = async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('User Data');

        // 添加 Excel 表头
        worksheet.addRow([
            '姓名',
            '学号',
            '年级',
            '目标时长',
            '本周时长',
        ]);
        // 查询所有用户
        const users = await User.find().exec();

        // 填充数据
        for (const user of users) {
            worksheet.addRow([
                user.realname,
                user.username,
                user.grade,
                user.targetTime,
                (user.totalDuration / 60).toFixed(2),
            ]);
        }

        // 导出 Excel
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=user_data.xlsx');

        // 生成 Excel 数据流
        const excelBuffer = await workbook.xlsx.writeBuffer();

        // 设置 Content-Length 响应头
        res.setHeader('Content-Length', excelBuffer.length);

        // 发送 Excel 数据流给前端
        res.end(excelBuffer);

        console.log('Excel 文件已导出');
    } catch (error) {
        console.error('导出 Excel 文件时出错:', error);
        res.status(500).send('导出 Excel 文件时出错');
    }
};

module.exports = { clockInController, clockOutController, exportClockController };