import { supabase } from "./supabase.js";

const list = document.getElementById("list");
const reportsCount = document.getElementById("reportsCount");

async function ensureAuth() {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
        await supabase.auth.signInAnonymously();
    }
}

async function loadReports() {
    list.textContent = "⏳ جاري تحميل البلاغات...";
    await ensureAuth();

    const { data: reports, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Fetch error:", error.message);
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
            <strong>${report.name}</strong>
            <p>${report.details}</p>
            <small>${new Date(report.created_at).toLocaleString("ar-EG")}</small>
            <hr>
        `;
        list.appendChild(div);
    });
}

loadReports();
