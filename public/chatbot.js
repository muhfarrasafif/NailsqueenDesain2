(() => {
  const launcher = document.querySelector('#chatbot-launcher');
  const panel = document.querySelector('#chatbot-panel');
  const closeButton = document.querySelector('#chatbot-close');
  const messages = document.querySelector('#chatbot-messages');
  const form = document.querySelector('#chatbot-form');
  const input = document.querySelector('#chatbot-input');

  if (!launcher || !panel || !closeButton || !messages || !form || !input) return;

  const whatsappNumber = '6281240003946';
  const services = [
    { id: 'clean', name: 'Clean & Minimal', price: 125000, description: 'Manicure dengan tampilan bersih dan minimal.' },
    { id: 'floral', name: 'Floral Details', price: 185000, description: 'Contoh nail art dengan detail floral.' },
    { id: 'color', name: 'Color Pop', price: 145000, description: 'Warna cerah untuk look yang ekspresif.' },
    { id: 'press-on', name: 'Press-On Nails', price: 165000, description: 'Set kuku press-on dengan desain pilihan.' },
  ];
  const products = [
    { name: 'Cuticle Oil Mini', price: 45000, description: 'Contoh produk perawatan kutikula.' },
    { name: 'Nail Care Mini Set', price: 95000, description: 'Contoh set perawatan kuku.' },
  ];

  let hasStarted = false;
  let booking = null;
  let bookingStep = '';

  const formatPrice = (amount) => `Rp${amount.toLocaleString('id-ID')}`;
  const scrollToLatest = () => { messages.scrollTop = messages.scrollHeight; };

  function addMessage(text, sender = 'bot') {
    const bubble = document.createElement('div');
    bubble.className = `chatbot-message chatbot-message-${sender}`;
    bubble.textContent = text;
    messages.append(bubble);
    scrollToLatest();
    return bubble;
  }

  function lockQuickReplies() {
    messages.querySelectorAll('.chatbot-quick-replies button').forEach((button) => {
      button.disabled = true;
    });
  }

  function addQuickReplies(items) {
    lockQuickReplies();
    const group = document.createElement('div');
    group.className = 'chatbot-quick-replies';

    items.forEach((item) => {
      const button = document.createElement('button');
      button.className = 'chatbot-quick-reply';
      button.type = 'button';
      button.textContent = item.label;
      button.addEventListener('click', () => {
        lockQuickReplies();
        addMessage(item.label, 'user');
        handleAction(item.action);
      });
      group.append(button);
    });

    messages.append(group);
    scrollToLatest();
  }

  function showMenu() {
    addQuickReplies([
      { label: 'Booking', action: 'start-booking' },
      { label: 'Layanan & harga demo', action: 'services' },
      { label: 'Produk & harga demo', action: 'products' },
      { label: 'Lokasi salon', action: 'location' },
    ]);
  }

  function showWelcome() {
    addMessage('Halo! Aku asisten virtual Nails Squeen. Mau booking, tanya layanan dan harga, atau lihat produk demo?');
    showMenu();
  }

  function openChat() {
    panel.hidden = false;
    launcher.setAttribute('aria-expanded', 'true');
    if (!hasStarted) {
      hasStarted = true;
      showWelcome();
    }
    input.focus();
  }

  function closeChat() {
    panel.hidden = true;
    launcher.setAttribute('aria-expanded', 'false');
    launcher.focus();
  }

  function showServices() {
    const list = services.map((service) => `• ${service.name} — ${formatPrice(service.price)} (contoh)`).join('\n');
    addMessage(`Layanan demo:\n${list}\n\nNama layanan dan harga ini hanya contoh sementara, bukan daftar resmi Nails Squeen. Harga final perlu dikonfirmasi melalui WhatsApp.`);
    addQuickReplies([
      { label: 'Mulai booking', action: 'start-booking' },
      { label: 'Lihat produk demo', action: 'products' },
      { label: 'Menu utama', action: 'menu' },
    ]);
  }

  function showProducts() {
    const list = products.map((product) => `• ${product.name} — ${formatPrice(product.price)} (contoh)`).join('\n');
    addMessage(`Produk demo:\n${list}\n\nContoh produk dan harga ini belum dikonfirmasi sebagai katalog resmi atau ketersediaan Nails Squeen. Silakan tanyakan harga dan stok terbaru melalui WhatsApp.`);
    addQuickReplies([
      { label: 'Lihat layanan demo', action: 'services' },
      { label: 'Menu utama', action: 'menu' },
    ]);
  }

  function showLocation() {
    addMessage('Studio Nails Squeen berada di Cilegon. Untuk alamat lengkap, jam operasional, dan ketersediaan slot terbaru, silakan konfirmasi melalui WhatsApp.');
    addQuickReplies([
      { label: 'Mulai booking', action: 'start-booking' },
      { label: 'Menu utama', action: 'menu' },
    ]);
  }

  function askForCurrentBookingStep() {
    if (bookingStep === 'date') {
      addMessage('Tanggal berapa yang kamu inginkan? Contoh: 25 Oktober 2026.');
    } else if (bookingStep === 'time') {
      addMessage('Jam berapa yang kamu inginkan? Contoh: 14.00 atau sore.');
    } else if (bookingStep === 'name') {
      addMessage('Siapa nama yang akan digunakan untuk permintaan booking?');
    } else if (bookingStep === 'phone') {
      addMessage('Nomor WhatsApp yang bisa dihubungi? Masukkan nomor dengan kode negara bila memungkinkan.');
    }
    if (bookingStep && bookingStep !== 'service') {
      addQuickReplies([{ label: 'Batalkan booking', action: 'cancel-booking' }]);
    }
  }

  function startBooking() {
    booking = {};
    bookingStep = 'service';
    addMessage('Yuk, siapkan permintaan booking. Pilih layanan contoh yang kamu inginkan:');
    addQuickReplies([
      ...services.map((service) => ({ label: `${service.name} · ${formatPrice(service.price)} (demo)`, action: `service:${service.id}` })),
      { label: 'Batalkan booking', action: 'cancel-booking' },
    ]);
  }

  function selectService(id) {
    const service = services.find((item) => item.id === id);
    if (!service) return;
    booking = { service };
    bookingStep = 'date';
    addMessage(`${service.name} dipilih. Harga ${formatPrice(service.price)} hanya contoh/demo, belum harga resmi.`);
    askForCurrentBookingStep();
  }

  function showBookingSummary() {
    bookingStep = 'confirm';
    const { service, date, time, name, phone } = booking;
    addMessage(`Ringkasan permintaan (belum terkonfirmasi):\nNama: ${name}\nLayanan: ${service.name} — ${formatPrice(service.price)} (harga demo)\nTanggal: ${date}\nWaktu: ${time}\nWhatsApp: ${phone}\n\nBelum ada booking yang tersimpan. Kirim ringkasan ini ke WhatsApp agar Nails Squeen dapat mengonfirmasi jadwal dan harga resmi.`);
    addQuickReplies([
      { label: 'Kirim permintaan via WhatsApp', action: 'send-booking' },
      { label: 'Mulai lagi', action: 'start-booking' },
      { label: 'Menu utama', action: 'cancel-booking' },
    ]);
  }

  function processBookingInput(value) {
    if (!booking) return;

    if (bookingStep === 'date') {
      if (value.length < 4 || !/\d/.test(value)) {
        addMessage('Tulis tanggal yang diinginkan, misalnya 25 Oktober 2026.');
        askForCurrentBookingStep();
        return;
      }
      booking.date = value;
      bookingStep = 'time';
      askForCurrentBookingStep();
      return;
    }

    if (bookingStep === 'time') {
      const normalizedTime = value.toLowerCase();
      const validTime = /^(?:(?:[01]?\d|2[0-3])(?:[:.]\d{2})?|pagi|siang|sore|malam)$/.test(normalizedTime);
      if (!validTime) {
        addMessage('Masukkan jam seperti 14.00, atau pilih bagian hari seperti pagi/sore.');
        askForCurrentBookingStep();
        return;
      }
      booking.time = value;
      bookingStep = 'name';
      askForCurrentBookingStep();
      return;
    }

    if (bookingStep === 'name') {
      if (value.length < 2) {
        addMessage('Boleh masukkan nama minimal 2 karakter?');
        askForCurrentBookingStep();
        return;
      }
      booking.name = value;
      bookingStep = 'phone';
      askForCurrentBookingStep();
      return;
    }

    if (bookingStep === 'phone') {
      const digits = value.replace(/\D/g, '');
      if (digits.length < 9 || digits.length > 15) {
        addMessage('Nomor WhatsApp belum terbaca. Masukkan 9–15 digit, misalnya 081234567890.');
        askForCurrentBookingStep();
        return;
      }
      booking.phone = value;
      showBookingSummary();
    }
  }

  function detectIntent(value) {
    const text = value.toLowerCase();
    if (/\b(batal|cancel|keluar)\b/.test(text)) return 'cancel';
    if (/\b(produk|product|cuticle|nail care|stok)\b/.test(text)) return 'products';
    if (/\b(lokasi|alamat|di mana|dimana|jam buka|operasional)\b/.test(text)) return 'location';
    if (/\b(booking|book|reservasi|pesan jadwal)\b/.test(text)) return 'booking';
    if (/\b(layanan|service|harga|price|biaya|tarif|manicure|press.on|nail art)\b/.test(text)) return 'services';
    if (/\b(menu|halo|hai|hi|hello)\b/.test(text)) return 'menu';
    return 'unknown';
  }

  function handleText(value) {
    const intent = detectIntent(value);

    if (intent === 'cancel') {
      booking = null;
      bookingStep = '';
      addMessage('Permintaan booking dibatalkan. Kamu bisa mulai lagi kapan saja.');
      showMenu();
      return;
    }

    if (bookingStep && ['products', 'location', 'services'].includes(intent)) {
      if (intent === 'products') showProducts();
      if (intent === 'location') showLocation();
      if (intent === 'services') showServices();
      askForCurrentBookingStep();
      return;
    }

    if (bookingStep && intent !== 'booking' && intent !== 'menu' && intent !== 'unknown') {
      processBookingInput(value);
      return;
    }

    if (bookingStep && intent === 'unknown') {
      processBookingInput(value);
      return;
    }

    if (intent === 'booking') {
      startBooking();
    } else if (intent === 'services') {
      showServices();
    } else if (intent === 'products') {
      showProducts();
    } else if (intent === 'location') {
      showLocation();
    } else if (intent === 'menu' || intent === 'unknown') {
      if (intent === 'unknown') addMessage('Aku belum punya jawaban untuk itu. Kamu bisa tanya layanan/harga demo, produk demo, lokasi, atau mulai booking.');
      showMenu();
    }
  }

  function sendBookingToWhatsApp() {
    if (!booking || !booking.service) return;
    const text = [
      'Halo Nails Squeen, saya ingin mengajukan booking:',
      `Nama: ${booking.name}`,
      `Layanan: ${booking.service.name}`,
      `Tanggal: ${booking.date}`,
      `Waktu: ${booking.time}`,
      `Nomor WhatsApp: ${booking.phone}`,
      `Harga contoh/demo: ${formatPrice(booking.service.price)}. Mohon konfirmasi harga dan slot resmi.`,
    ].join('\n');
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    booking = null;
    bookingStep = '';
    addMessage('WhatsApp terbuka untuk mengirim permintaan. Booking baru dianggap terkonfirmasi setelah Nails Squeen membalas.');
    showMenu();
  }

  function handleAction(action) {
    if (action === 'start-booking') return startBooking();
    if (action === 'services') return showServices();
    if (action === 'products') return showProducts();
    if (action === 'location') return showLocation();
    if (action === 'menu') return showMenu();
    if (action === 'cancel-booking') {
      booking = null;
      bookingStep = '';
      addMessage('Kembali ke menu utama.');
      return showMenu();
    }
    if (action === 'send-booking') return sendBookingToWhatsApp();
    if (action.startsWith('service:')) return selectService(action.slice('service:'.length));
  }

  launcher.addEventListener('click', () => {
    if (panel.hidden) openChat();
    else closeChat();
  });
  closeButton.addEventListener('click', closeChat);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) closeChat();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    lockQuickReplies();
    addMessage(value, 'user');
    input.value = '';
    handleText(value);
  });
})();
