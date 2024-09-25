// server.js

// استيراد المكتبات اللازمة
const express = require('express');
const morgan = require('morgan'); // لتسجيل الطلبات
const useragent = require('express-useragent'); // لتحليل بيانات المستخدم
const bcrypt = require('bcrypt');
const path = require('path');
const security = require('./security'); // تأكد من وجود ملف security.js

// إنشاء تطبيق Express
const app = express();

// إعدادات التطبيق الأساسية
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// تطبيق الإجراءات الأمنية
security(app); // تطبيق الإجراءات الأمنية من security.js

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

// خدمة الملفات الثابتة (static files)
app.use(express.static(path.join(__dirname)));

// إعداد مسار الجذر لإرسال ملف index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// مسار لتشفير كلمة المرور (مثال)
app.post('/submit', (req, res) => {
    const password = 'user-password'; // يجب استبداله بكلمة المرور الفعلية
    bcrypt.hash(password, 10, function(err, hash) {
        if (err) {
            res.status(500).send('Error in hashing password');
        } else {
            res.send('Password hashed successfully');
        }
    });
});

// تشغيل الخادم على المنفذ 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
