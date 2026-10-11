// Nhận yêu cầu tư vấn từ form trên website và gửi về Telegram.
// Cần đặt 2 biến môi trường trong Netlify:
//   TELEGRAM_BOT_TOKEN  - token của bot Telegram
//   TELEGRAM_CHAT_ID    - ID nhóm/cuộc trò chuyện nhận tin

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

const clean = (value, max) => String(value || "").trim().slice(0, max);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, error: "Method not allowed" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return json(500, { ok: false, error: "Telegram chưa được cấu hình" });
  }

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { ok: false, error: "Dữ liệu không hợp lệ" });
  }

  // Honeypot: bot thường điền vào ô ẩn "website" -> bỏ qua âm thầm
  if (data.website) {
    return json(200, { ok: true });
  }

  const name = clean(data.name, 100);
  const phone = clean(data.phone, 20);
  const service = clean(data.service, 100);
  const note = clean(data.note, 1000);

  if (!name || !phone) {
    return json(400, { ok: false, error: "Vui lòng nhập họ tên và số điện thoại" });
  }

  const lines = [
    "📩 Yêu cầu tư vấn mới - Serene Travel",
    `👤 Họ tên: ${name}`,
    `📞 SĐT / Zalo: ${phone}`,
    service && `🧭 Dịch vụ: ${service}`,
    note && `📝 Nội dung: ${note}`,
  ].filter(Boolean);

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: lines.join("\n") }),
    });
    if (!res.ok) {
      return json(502, { ok: false, error: "Không gửi được tin nhắn" });
    }
  } catch {
    return json(502, { ok: false, error: "Không kết nối được Telegram" });
  }

  return json(200, { ok: true });
};
