
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

