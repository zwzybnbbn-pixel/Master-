import { supabase } from "./supabase.js";

// عناصر الصفحة
const list = document.getElementById("list");
const reportsCount = document.getElementById("reportsCount");

// تأكد أن الكود يعمل في المتصفح فقط
if (typeof window === "undefined") {
  throw new Error("هذا الكود يعمل في المتصفح فقط");
}

// تسجيل دخول Anonymous
async function ensureAuth() {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    const { error } = await supabase.auth.signInAnonymously();
    if (error) {
      console.error("Auth error:", error.message);
    }
  }
}

// جلب البلاغات
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

// تشغيل
loadReports();
