import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ضع الرابط والمفتاح مباشرة
const supabaseUrl = "https://gxuumjhtutkipvkljjhj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4dXVtamh0dXRraXB2a2hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NTM2MzEsImV4cCI6MjA4MTEyOTYzMX0.rmsSRTQ57cAJ3VAiQMe0mdxEYcERh6zQDep7DN_frFI";

const supabase = createClient(supabaseUrl, supabaseKey);

const list = document.getElementById("list");
const reportsCount = document.getElementById("reportsCount");

async function loadReports() {
    list.textContent = "⏳ جاري تحميل البلاغات...";

    // تسجيل دخول مجهول لضمان الجلسة
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
        await supabase.auth.signInAnonymously();
    }

    const { data: reports, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("خطأ في تحميل البلاغات:", error.message);
        list.textContent = "❌ فشل تحميل البلاغات";
        return;
    }

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
            <strong>${report.name || "غير محدد"}</strong>
            <p>${report.details || "لا توجد تفاصيل"}</p>
            <small>${new Date(report.created_at).toLocaleString("ar-EG")}</small>
            <hr>
        `;
        list.appendChild(div);
    });
}

loadReports();
