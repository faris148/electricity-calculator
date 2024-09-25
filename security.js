// security.js

// استيراد المكتبات اللازمة
const helmet = require('helmet'); // لحماية التطبيق من بعض هجمات الويب المعروفة
const rateLimit = require('express-rate-limit'); // لتحديد حد أقصى للطلبات من نفس IP
const xssClean = require('xss-clean'); // لحماية التطبيق من هجمات XSS
const mongoSanitize = require('express-mongo-sanitize'); // لمنع هجمات SQL Injection
const cors = require('cors'); // لتحديد سياسات مشاركة الموارد عبر المصادر
const csrf = require('csurf'); // لحماية التطبيق من هجمات CSRF
const session = require('express-session'); // لإدارة الجلسات بشكل آمن
const RedisStore = require('connect-redis').default; // الإصدار الجديد من connect-redis
const redis = require('redis'); // عميل Redis
const cookieParser = require('cookie-parser'); // إضافة مكتبة cookie-parser

// إنشاء عميل Redis
const redisClient = redis.createClient({
    host: 'localhost', // عنوان خادم Redis
    port: 6379, // منفذ Redis الافتراضي
});

// إعداد rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقيقة
    max: 100, // حد أقصى 100 طلب من نفس الـ IP في النافذة الزمنية المحددة
    message: 'Too many requests from this IP, please try again after 15 minutes',
});

// إعداد CSRF protection مع الكوكيز
const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: false, // true إذا كنت تستخدم HTTPS
        sameSite: 'strict',
    }
});

// إعداد CORS
const corsOptions = {
    origin: 'https://yourdomain.com', // حدد النطاقات المسموح لها بالوصول إلى API الخاص بك
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // للسماح بإرسال الكوكيز مع الطلبات
};

// تصدير دالة لتعزيز الأمان في التطبيق
module.exports = (app) => {
    // استخدام Helmet لتأمين رؤوس HTTP
    app.use(helmet());

    // استخدام cookie-parser
    app.use(cookieParser());

    // تطبيق CORS مع الخيارات المحددة
    app.use(cors(corsOptions));

    // تطبيق rate limiter على جميع الطلبات
    app.use(limiter);

    // تنظيف البيانات المدخلة من هجمات XSS
    app.use(xssClean());

    // تنظيف البيانات المدخلة من هجمات MongoDB Injection
    app.use(mongoSanitize());

    // إعداد إدارة الجلسات باستخدام Redis
    app.use(session({
        store: new RedisStore({ client: redisClient }),
        secret: 'your-very-secure-secret', // استخدم مفتاحًا سريًا قويًا
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: true, // التأكد من أن الكوكيز يتم إرسالها عبر HTTPS فقط
            httpOnly: true, // منع الوصول إلى الكوكيز من خلال جافاسكريبت
            sameSite: 'lax', // حماية إضافية ضد هجمات CSRF
            maxAge: 60 * 60 * 1000, // مدة الجلسة 1 ساعة
        },
    }));

    // تطبيق CSRF protection بعد إدارة الجلسات
    app.use(csrfProtection);

    // التعامل مع أخطاء CSRF
    app.use((err, req, res, next) => {
        if (err.code !== 'EBADCSRFTOKEN') return next(err);

        // معالجة أخطاء CSRF
        res.status(403);
        res.send('Form tampered with');
    });

   const crypto = require('crypto');

app.use((req, res, next) => {
    res.locals.nonce = crypto.randomBytes(16).toString('hex'); // إنشاء رقم مميز (nonce)
    next();
});

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com', (req, res) => `'nonce-${res.locals.nonce}'`], // السماح بالجافا سكريبت مع nonce
            styleSrc: ["'self'", 'https://fonts.googleapis.com'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:', 'https://yourdomain.com'],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    })
);

    // إضافة حماية ضد Clickjacking
    app.use(
        helmet.frameguard({
            action: 'deny',
        })
    );

    // إزالة X-Powered-By header
    app.disable('x-powered-by');
};
