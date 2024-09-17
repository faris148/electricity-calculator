// app.js

// استيراد المكتبات اللازمة
const express = require('express');
const morgan = require('morgan'); // لتسجيل الطلبات
const useragent = require('express-useragent'); // لتحليل بيانات المستخدم
const bcrypt = require('bcrypt');

// إنشاء تطبيق Express
const app = express();

// إعدادات التطبيق الأساسية
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// استيراد وتطبيق ملف الأمان
const security = require('./security');
security(app); // تطبيق الإجراءات الأمنية

// استخدام morgan لتسجيل الطلبات
app.use(morgan('combined'));

// استخدام useragent لتحليل بيانات المستخدم
app.use(useragent.express());

// قائمة IPs المحظورة
const blockedIPs = ['123.45.67.89'];

// Middleware لحظر الـ IPs المحظورة
app.use((req, res, next) => {
    if (blockedIPs.includes(req.ip)) {
        res.status(403).send('Access Forbidden');
    } else {
        next();
    }
});

// إعداد مسارات التطبيق
app.get('/', (req, res) => {
    res.send('Welcome to the secure app!');
});

// مسار لتشفير كلمة المرور
app.post('/submit', (req, res) => {
    const password = 'user-password';
    bcrypt.hash(password, 10, function(err, hash) {
        if (err) {
            res.status(500).send('Error in hashing password');
        } else {
            res.send('Password hashed successfully');
        }
    });
});

// تشغيل الخادم على المنفذ 3000
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
 