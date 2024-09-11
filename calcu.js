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
