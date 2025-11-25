# Migrasi Database ke Supabase

## Status Saat Ini
- ✅ Supabase Authentication: 1 user ditemukan
- ❌ Database Tables: Belum dibuat

## Cara Melakukan Migrasi Manual

### Langkah 1: Buka Supabase Dashboard
1. Kunjungi: https://app.supabase.com
2. Login dengan akun Anda
3. Pilih project: `xsdiaykgzkfkhgmaxtrs`

### Langkah 2: Buka SQL Editor
1. Di sidebar kiri, klik **"SQL Editor"**
2. Klik **"New query"** untuk membuat query baru

### Langkah 3: Pilih Schema yang Akan Dijalankan

**Pilihan A: Schema Lengkap (Recommended)**
- File: `supabase/schema-complete.sql`
- Isi: Semua table yang dibutuhkan aplikasi (users, personas, chat_messages, dll)
- Cocok untuk: Production / Development penuh

**Pilihan B: Schema Minimal (Authentication Only)**
- File: `supabase/schema-ready-to-run.sql`
- Isi: Hanya table users dan user_sessions
- Cocok untuk: Testing authentication saja

### Langkah 4: Eksekusi SQL
1. Buka file yang dipilih (misal: `supabase/schema-complete.sql`)
2. Copy semua isi file
3. Paste di SQL Editor
4. Klik **"Run"** untuk mengeksekusi

### Langkah 5: Verifikasi
Setelah berhasil, Anda akan melihat tabel-tabel baru di:
- **Table Editor** → **public** schema
- Table yang dibuat: users, user_sessions, personas, chat_messages, dll

### Langkah 6: Testing
Jalankan command ini untuk testing:
```bash
# Test koneksi ke Supabase
node test-supabase-connection.js

# Test authentication dengan Supabase
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@admin.com", "password": "admin"}'
```

## File yang Tersedia

1. **`supabase/schema-complete.sql`** - Schema lengkap (Recommended)
   - Semua table dari Prisma schema
   - Indexes untuk performance
   - Functions dan triggers
   - Default admin user (admin@admin.com / admin)

2. **`supabase/schema-ready-to-run.sql`** - Schema minimal
   - Hanya table users dan user_sessions
   - Basic authentication
   - Session validation

3. **`supabase/schema.sql`** - Schema lengkap alternatif
   - Versi lengkap dengan UUID
   - Struktur yang sama dengan schema-complete.sql

## Setelah Migrasi

### ✅ Benefits:
- Session tracking di database
- User management capabilities
- Enhanced security features
- Full audit trail
- Better performance dengan indexes

### ⚠️ Security Notes:
- Ganti password admin default sesegera mungkin
- Enable Row Level Security (RLS) untuk production
- Gunakan service role key hanya untuk server-side operations

## Troubleshooting

### Error: "relation "users" does not exist"
- Pastikan SQL sudah dijalankan dengan benar
- Check di Table Editor apakah table users sudah ada

### Error: "Permission denied"
- Pastikan menggunakan service role key untuk operasi database
- Check user permissions di Supabase

### Error: "Connection failed"
- Pastikan environment variables sudah benar
- Check Supabase project masih aktif

## Support

Jika ada masalah:
1. Check console logs untuk error details
2. Pastikan SQL dijalankan dengan urutan yang benar
3. Verifikasi environment variables

---

**Catatan:** System saat ini bekerja dalam fallback mode dan bisa digunakan tanpa database Supabase. Buat database tables hanya jika dibutuhkan untuk production.