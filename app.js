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
        <p>${text.submeterBill} ${submeterBill.toFixed(2)} ريال</p>
        <p>${text.mainMeterBill} ${mainMeterBill.toFixed(2)} ريال</p>
    `;
}

// إعداد الخلفية المتحركة باستخدام Three.js
let scene, camera, renderer, particleSystem;

function initBackground() {
    const background = document.getElementById('background');
    const width = window.innerWidth;
    const height = window.innerHeight;

    // إعداد المشهد والكاميرا
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 100;

    // إعداد المحرك
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    background.appendChild(renderer.domElement);

    // إعداد الجسيمات
    const particleCount = 500;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 400;
        const y = (Math.random() - 0.5) * 400;
        const z = (Math.random() - 0.5) * 400;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({ color: 0x00bcd4, size: 2 });
    particleSystem = new THREE.Points(particles, material);
    scene.add(particleSystem);

    animateBackground();
}

function animateBackground() {
    requestAnimationFrame(animateBackground);

    // حركة الجسيمات
    particleSystem.rotation.x += 0.0005;
    particleSystem.rotation.y += 0.001;

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
