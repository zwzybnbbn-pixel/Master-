import { supabase } from "./supabase.js";

const list = document.getElementById("list");
const reportsCount = document.getElementById("reportsCount");

// =========================
// 🟢 التحقق من الجلسة أو تسجيل دخول مجهول
// =========================
async function ensureAuth() {
    let sessionData = localStorage.getItem("supabase_session");

    if (sessionData) {
        const session = JSON.parse(sessionData);
        return session;
    }

    const { data, error } = await supabase.auth.getSession();
    if (data.session) {
        localStorage.setItem("supabase_session", JSON.stringify(data.session));
        return data.session;
    }

    const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
    if (anonError) {
        console.error("❌ خطأ في تسجيل الدخول المجهول:", anonError.message);
        return null;
    }

    localStorage.setItem("supabase_session", JSON.stringify(anonData.session));
    return anonData.session;
}

// =========================
// 📋 تحميل وعرض البلاغات
// =========================
async function loadReports() {
    list.textContent = "⏳ جاري تحميل البلاغات...";
    const session = await ensureAuth();
    if (!session) {
        list.textContent = "❌ لم يتم تسجيل الدخول.";
        return;
    }

    try {
        // جلب كل البلاغات
        const { data: reports, error } = await supabase
            .from("reports")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        if (!reports || reports.length === 0) {
            list.textContent = "لا توجد بلاغات حتى الآن.";
            reportsCount.textContent = "0 بلاغ";
            return;
        }

        list.textContent = "";
        reportsCount.textContent = `${reports.length} بلاغ`;

        reports.forEach(report => {
            const div = document.createElement("div");
            div.className = "report-item";
            div.innerHTML = `
                <strong>المرسل: ${report.name || "غير محدد"}</strong>
                <p>النوع: ${report.type || "غير محدد"}</p>
                <p>الموقع: ${report.location || "غير محدد"}</p>
                <p>الهاتف: ${report.phone || "غير محدد"}</p>
                <p>التفاصيل: ${report.details || "لا توجد تفاصيل"}</p>
                <small>التاريخ: ${new Date(report.created_at).toLocaleString("ar-EG")}</small>
                <hr>
            `;
            list.appendChild(div);
        });

    } catch (err) {
        console.error("❌ فشل تحميل البلاغات:", err.message);
        list.textContent = "❌ فشل تحميل البلاغات";
        reportsCount.textContent = "0 بلاغ";
    }
}

// =========================
// 🚀 بدء التحميل
// =========================
loadReports();
