# Nails Squeen

Landing page statis Nails Squeen. HTML, CSS, JavaScript, favicon, dan gambar berada di dalam repository. Semua visual yang sebelumnya disajikan melalui penyimpanan platform kini tersedia lokal di `public/assets/`, sehingga Worker tidak bergantung pada path `/manus-storage/`.

## Menjalankan secara lokal

Perlu Node.js dan npm. Dari root repository:

```bash
npm install
npm run dev
```

Wrangler akan menampilkan alamat lokal untuk preview.

## Deploy ke Cloudflare Workers

Konfigurasi `wrangler.jsonc` memakai Workers Static Assets dan menyajikan folder `public/` secara langsung. Situs tidak membutuhkan backend, database, atau proses build.

Setelah menggunakan akun Cloudflare Anda:

```bash
npx wrangler login
npm run deploy
```

`name` Worker dapat diubah di `wrangler.jsonc` sebelum deploy bila Anda ingin memakai nama lain. File konfigurasi tidak menyimpan account ID, API token, atau kredensial. Deployment Cloudflare belum dijalankan.

## Referensi Cloudflare

- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Konfigurasi Wrangler](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Memasang dan memperbarui Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
