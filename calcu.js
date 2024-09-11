// النصوص باللغتين العربية والإنجليزية
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

// دالة لتغيير اللغة
function changeLanguage() {
    const language = document.getElementById("language").value;
    const text = translations[language];

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

    // عرض النتائج النهائية بدون سعر الكيلوواط
    document.getElementById("results").innerHTML = `
        <h3>${text.resultsHeader}</h3>
        <p>${text.submeterBill} ${submeterBill.toFixed(2)} ريال</p>
        <p>${text.mainMeterBill} ${mainMeterBill.toFixed(2)} ريال</p>
    `;
}

// إعداد خلفية الرموز الحسابية المتحركة باستخدام Three.js

let scene, camera, renderer, particleSystem;

function init() {
    const background = document.getElementById('background');
    const width = window.innerWidth;
    const height = window.innerHeight;

    // إعداد المشهد والكاميرا
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(100, width / height, 0.9, 1000);
    camera.position.z = 100; // تعديل للعمق

    // إعداد المحرك
    renderer = new THREE.WebGLRenderer({ alpha: true }); // تفعيل الشفافية
    renderer.setSize(width, height);
    background.appendChild(renderer.domElement);

    // الرموز الحسابية
    const symbols = ['+', '-', '=', '×', '÷'];
    const particleCount = 200;
    const particles = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 9);

    for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 800;
        const y = (Math.random() - 0.5) * 800;
        const z = (Math.random() - 0.5) * 800;

        particlePositions[i * 3] = x;
        particlePositions[i * 3 + 1] = y;
        particlePositions[i * 3 + 2] = z;

        // تغيير الألوان إلى البنفسجي والأزرق والبرتقالي
        colors[i * 3] = Math.random(); // R
        colors[i * 3 + 1] = 0.5; // G
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2; // B
    }

    particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // إنشاء مادة الجسيمات (رموز حسابية متحركة)
    const particleMaterial = new THREE.PointsMaterial({
        size: 10,
        vertexColors: true, // لتفعيل الألوان المتغيرة
    });

    particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // حركة بطيئة للجسيمات
    particleSystem.rotation.y += 0.0014;

    renderer.render(scene, camera);
}

// تحديث حجم الشاشة عند تغيير حجم النافذة
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

init();

let startX, startY, endX, endY;

// تتبع بداية لمس الشاشة
document.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

// تتبع نهاية لمس الشاشة وتحريك الصفحة
document.addEventListener('touchmove', function(e) {
    endX = e.touches[0].clientX;
    endY = e.touches[0].clientY;

    let deltaX = startX - endX;
    let deltaY = startY - endY;

    window.scrollBy(deltaX, deltaY);

    startX = endX; // تحديث الإحداثيات للاستمرار بالحركة
    startY = endY;
});

// تتبع السحب باستخدام الماوس
let isMouseDown = false;

document.addEventListener('mousedown', function(e) {
    isMouseDown = true;
    startX = e.clientX;
    startY = e.clientY;
});

document.addEventListener('mousemove', function(e) {
    if (isMouseDown) {
        endX = e.clientX;
        endY = e.clientY;

        let deltaX = startX - endX;
        let deltaY = startY - endY;

        window.scrollBy(deltaX, deltaY);

        startX = endX; // تحديث الإحداثيات للاستمرار بالحركة
        startY = endY;
    }
});

document.addEventListener('mouseup', function() {
    isMouseDown = false;
});
