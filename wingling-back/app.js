require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const cron = require('node-cron');
const ExcelJS = require('exceljs');
const User = require('./src/models/user');
const MakeupClock = require('./src/models/makeupClock');
const { sendMail } = require('./src/utils/mailer');
const path = require('path');
const connectDB = require('./src/database/database');
const port = process.env.PORT || 3000;
const app = express();
const routes = require('./src/routes');


app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use('/api', routes);
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
    // 创建定时任务，每天晚上 23:40 执行一次
    cron.schedule('40 23 * * *', async () => {
        try {
            // 将用户的打卡状态设置为false
            await User.updateMany({}, { $set: { isClockedIn: false } });
        } catch (error) {
            console.error('An error occurred:', error);
        }
    });
    // 创建定时任务，每周日 23:00 执行一次
    cron.schedule('40 23 * * 0', async () => {
        try {
            // 导出 Excel 数据
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

            const excelBuffer = await workbook.xlsx.writeBuffer();

            User.find({ isAdmin: true }).then(admins => {
                const mailOptions = {
                    from: process.env.MAIL_USER,
                    to: admins.map(admin => admin.email),
                    subject: '考勤周报通知',
                    html: `
                <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                <div style="margin: 20px auto; max-width: 600px; background-color: #ffffff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 10px; border: 2px solid #005ea5;">
                    <div style="background-color: #005ea5; padding: 20px; color: #ffffff; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                    <img src="https://s1.imagehub.cc/images/2023/07/29/logo.png" alt="logo.png" style="max-width: 200px;">
                    <h2 style="margin-top: 15px; font-family: 'Arial Black', Arial, sans-serif;">考勤周报通知</h2>
                    <h3 style="margin-top: 10px; font-family: 'Lucida Handwriting', cursive; color: #ffffff;">翼灵物联网工作室</h3>
                    </div>
                    <div style="padding: 20px;">
                    <p style="font-size: 18px; color: #333333; line-height: 1.6;">尊敬的管理员，本周考勤周报已送达</p>
                    <p style="font-size: 18px; color: #333333; line-height: 1.6;">请及时查阅！</p>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: center; margin-top: 20px; border-top: 2px solid #005ea5; padding: 20px; color: #005ea5; font-size: 14px; text-align: center; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
                    <p style="margin: 0;">本邮件由翼灵物联网工作室自动发出，请勿回复。</p>
                    </div>
                </div>
                <h3 style="font-family: 'Lucida Handwriting', cursive; text-align: center; margin-top: 20px;">Wingling</h3>
                </body>
                `,
                    attachments: [
                        {
                            filename: 'weekly_report.xlsx',
                            content: excelBuffer,
                        },
                    ]
                };
                return sendMail(mailOptions)
                    .then(info => {
                        console.log('邮件发送成功：', info);
                    })
                    .catch(err => {
                        console.error('邮件发送失败：', err);
                    });
            });
            // 更新数据库表的操作
            await User.updateMany({}, { $set: { totalDuration: 0 } });
            await MakeupClock.deleteMany({});
        } catch (error) {
            console.error('An error occurred:', error);
        }
    });
}).catch((err) => {
    console.error('Failed to connect to the database:', err);
})