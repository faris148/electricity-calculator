
// النصوص باللغتين
const translations = {
    ar: {
        title: "حاسبة فاتورة الكهرباء",
        totalBillLabel: "إجمالي الفاتورة (بالريال):",
        mainStartLabel: "قراءة العداد الرئيسي السابقة (كيلوواط):",
        mainEndLabel: "قراءة العداد الرئيسي الحالية (كيلوواط):",
        subStartLabel: "قراءة العداد الفرعي السابقة (كيلوواط):",
        subEndLabel: "قراءة العداد الفرعي الحالية (كيلوواط):",
        calculateButton: "احسب الفاتورة",
        resultsHeader: "النتائج",
        submeterBill: "فاتورة العداد الفرعي: ",
        mainMeterBill: "فاتورة العداد الرئيسي: ",
        error: "خطأ: يرجى إدخال أرقام صحيحة في جميع الحقول.",
        mainError: "خطأ: يجب أن تكون قراءة العداد الرئيسي الحالية أكبر من أو مساوية للقراءة السابقة.",
        subError: "خطأ: يجب أن تكون قراءة العداد الفرعي الحالية أكبر من أو مساوية للقراءة السابقة."
    },
    en: {
        title: "Electricity Bill Calculator",
        totalBillLabel: "Total Bill (SAR):",
        mainStartLabel: "Previous Main Meter Reading (kWh):",
        mainEndLabel: "Current Main Meter Reading (kWh):",
        subStartLabel: "Previous Submeter Reading (kWh):",
        subEndLabel: "Current Submeter Reading (kWh):",
        calculateButton: "Calculate Bill",
        resultsHeader: "Results",
        submeterBill: "Submeter Bill: ",
        mainMeterBill: "Main Meter Bill: ",
        error: "Error: Please enter valid numbers for all fields.",
        mainError: "Error: Current main meter reading must be greater than or equal to the previous reading.",
        subError: "Error: Current submeter reading must be greater than or equal to the previous reading."
    }
};

// تغيير اللغة
function changeLanguage() {
    const language = document.getElementById("language").value;
    const text = translations[language];
    document.body.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
    document.getElementById("title").innerText = text.title;
    document.getElementById("totalBillLabel").innerText = text.totalBillLabel;
    document.getElementById("mainStartLabel").innerText = text.mainStartLabel;
    document.getElementById("mainEndLabel").innerText = text.mainEndLabel;
    document.getElementById("subStartLabel").innerText = text.subStartLabel;
    document.getElementById("subEndLabel").innerText = text.subEndLabel;
    document.getElementById("calculateButton").innerText = text.calculateButton;
}

// دالة الحساب مع استخدام المعادلة لحساب سعر الكيلوواط
function calculateBill() {
    const language = document.getElementById("language").value;
    const text = translations[language];

    // الحصول على القيم المدخلة
    const totalBill = parseFloat(document.getElementById("totalBill").value);
    const mainStart = parseFloat(document.getElementById("mainStart").value);
    const mainEnd = parseFloat(document.getElementById("mainEnd").value);
    const subStart = parseFloat(document.getElementById("subStart").value);
    const subEnd = parseFloat(document.getElementById("subEnd").value);

    // التحقق من صحة المدخلات
    if (isNaN(totalBill) || isNaN(mainStart) || isNaN(mainEnd) || isNaN(subStart) || isNaN(subEnd)) {
        alert(text.error);
        return;
    }

    if (mainEnd < mainStart) {
        alert(text.mainError);
        return;
    }
    
    if (subEnd < subStart) {
        alert(text.subError);
        return;
    }

    // حساب استهلاك العداد الرئيسي والفرعي
    const mainConsumption = mainEnd - mainStart;
    const subConsumption = subEnd - subStart;

    // حساب سعر الكيلوواط بناءً على إجمالي الفاتورة والاستهلاك الرئيسي
    const pricePerKWh = totalBill / mainConsumption;

    // حساب فاتورة العداد الفرعي
    const submeterBill = subConsumption * pricePerKWh;

    // حساب الفاتورة المتبقية للعداد الرئيسي
    const mainMeterBill = totalBill - submeterBill;

    // عرض النتائج النهائية
    document.getElementById("results").innerHTML = `
        <h3>${text.resultsHeader}</h3>
        <p>${text.mainMeterBill} ${mainMeterBill.toFixed(2)} ريال</p>
        <p>${text.submeterBill} ${submeterBill.toFixed(2)} ريال</p>
    `;
}


// إعداد الخلفية المتحركة باستخدام Three.js
let scene, camera, renderer, stars;

function initBackground() {
    const background = document.getElementById('background');
    const width = window.innerWidth;
    const height = window.innerHeight;

    // إعداد المشهد والكاميرا
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 1; // وضع الكاميرا

    // إعداد المحرك
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    background.appendChild(renderer.domElement);

    // إعداد الجسيمات (Particles) كنجوم
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff, // لون النجوم أبيض
        size: 0.001 // حجم الجسيمات (النجوم)
    });

    const starVertices = [];
    for (let i = 0; i < 10000; i++) { // عدد الجسيمات (النجوم)
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    animateBackground();
}

// دالة التحريك لتحديث النجوم
function animateBackground() {
    requestAnimationFrame(animateBackground);

    // حركة دوران بسيطة للنجوم حول المحورين
    stars.rotation.x += 0.0005;
    stars.rotation.y += 0.0005;

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// تفعيل الخلفية المتحركة
initBackground();

// بقية الكود كما هو...
document.addEventListener("DOMContentLoaded", function() {
    const container = document.querySelector(".container");
    container.style.opacity = "0";
    container.style.transform = "translateY(50px)";
    setTimeout(() => {
        container.style.transition = "all 1s ease";
        container.style.opacity = "1";
        container.style.transform = "translateY(0)";
    }, 100); // يمكنك تغيير مدة التأخير كما تفضل
});

// استيراد المكتبات اللازمة
const express = require('express'); // إنشاء خادم Express
const morgan = require('morgan'); // لتسجيل الطلبات التي تصل إلى الخادم
const useragent = require('express-useragent'); // لتحليل وكشف بيانات المتصفح والجهاز

const app = express(); // إنشاء تطبيق Express

// إعداد morgan لتسجيل الطلبات
app.use(morgan('combined'));

// إعداد useragent لتحليل بيانات المستخدم
app.use(useragent.express());

// قائمة IPs المحظورة
const blockedIPs = ['123.45.67.89'];  // يمكنك وضع IP الشخص الذي تريد حظره هنا

// Middleware للتحقق من الـ IP وحظرها
app.use((req, res, next) => {
    if (blockedIPs.includes(req.ip)) {
        res.status(403).send('Access Forbidden'); // رد بحظر الدخول إذا كان الـ IP محظورًا
    } else {
        next(); // السماح بالمرور إذا لم يكن IP محظورًا
    }
});

// عرض بيانات المتصفح والجهاز عند دخول المستخدم للصفحة الرئيسية
app.get('/', (req, res) => {
    // تسجيل معلومات المتصفح والجهاز في الـ console
    console.log(`IP: ${req.ip}`);
    console.log(`Browser: ${req.useragent.browser}`);
    console.log(`OS: ${req.useragent.os}`);
    console.log(`Platform: ${req.useragent.platform}`);

    // إظهار رسالة للمستخدم في المتصفح
    res.send('Hello, your details are being logged.');
});

// بدء تشغيل الخادم على المنفذ 3000
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
// 1. استيراد المكتبات اللازمة
const express = require('express'); // لإنشاء خادم Express
const morgan = require('morgan'); // لتسجيل الطلبات التي تصل إلى الخادم (مثل IP والمتصفح)
const useragent = require('express-useragent'); // لتحليل بيانات المتصفح والجهاز
const session = require('express-session'); // لإدارة الجلسات بشكل آمن
const bcrypt = require('bcrypt'); // لتشفير كلمات المرور
const csrf = require('csurf'); // لحماية الموقع من هجمات CSRF
const cookieParser = require('cookie-parser'); // لمعالجة ملفات الكوكيز

const app = express(); // إنشاء تطبيق Express

// 2. استخدام morgan لتسجيل الطلبات
// يسجل معلومات عن الطلبات التي تصل إلى الخادم مثل الـ IP ونوع المتصفح
app.use(morgan('combined'));

// 3. استخدام useragent لتحليل بيانات المتصفح والجهاز
app.use(useragent.express());

// 4. إعداد ملفات الكوكيز والحماية من CSRF
// تفعيل الـ CSRF Protection لحماية الطلبات من التزوير
app.use(cookieParser());
app.use(csrf({ cookie: true }));

// 5. إعداد الجلسات (Session Management)
// تأمين الجلسات باستخدام توقيع وتحديد مدة صلاحيتها
app.use(session({
    secret: 'your-secret-key', // مفتاح سري لتوقيع الجلسة
    resave: false, // عدم إعادة حفظ الجلسة إذا لم تتغير
    saveUninitialized: true, // حفظ الجلسات الجديدة
    cookie: { secure: true, maxAge: 60000 } // جعل الكوكيز آمنة وتنتهي بعد 60 ثانية
}));

// 6. قائمة IPs المحظورة
// إدخال أي IP تريد حظره في هذه القائمة
const blockedIPs = ['123.45.67.89']; 

// 7. حظر الوصول للمستخدمين بناءً على عنوان الـ IP
app.use((req, res, next) => {
    if (blockedIPs.includes(req.ip)) {
        res.status(403).send('Access Forbidden'); // إرسال رسالة منع الوصول إذا كان IP محظورًا
    } else {
        next(); // السماح بالمرور إذا كان IP غير محظور
    }
});

// 8. عرض معلومات المتصفح والجهاز عند زيارة المستخدم للموقع
app.get('/', (req, res) => {
    // تسجيل المعلومات في console الخادم
    console.log(`IP: ${req.ip}`);
    console.log(`Browser: ${req.useragent.browser}`);
    console.log(`OS: ${req.useragent.os}`);
    console.log(`Platform: ${req.useragent.platform}`);

    // عرض رسالة مع تضمين token للحماية من CSRF في النموذج
    res.send(`
        <form action="/submit" method="POST">
            <input type="hidden" name="_csrf" value="${req.csrfToken()}">
            <button type="submit">Submit</button>
        </form>
    `);
});

// 9. مثال على تشفير كلمة المرور
app.post('/submit', (req, res) => {
    const password = 'user-password'; // كلمة المرور التي سيتم تشفيرها

    // تشفير كلمة المرور باستخدام bcrypt
    bcrypt.hash(password, 10, function(err, hash) {
        if (err) {
            res.status(500).send('Error in hashing password');
        } else {
            console.log(`Hashed Password: ${hash}`); // عرض كلمة المرور المشفرة في console
            res.send('Password hashed successfully');
        }
    });
});

// 10. تشغيل الخادم على المنفذ 3000
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
