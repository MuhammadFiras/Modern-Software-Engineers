# Week 6 Write-up
Tip: To preview this markdown file
- On Mac, press `Command (⌘) + Shift + V`
- On Windows/Linux, press `Ctrl + Shift + V`

## Instructions

Fill out all of the `TODO`s in this file.

## Submission Details

Name: **TODO** \
SUNet ID: **TODO** \
Citations: **TODO**

This assignment took me about **TODO** hours to do. 


## Brief findings overview 
> 
SCA / Supply Chain (Dependencies): Semgrep menemukan banyak celah kritis (Critical/High Severity) pada library di requirements.txt, seperti PyYAML (rentan terhadap Remote Code Injection), requests (kebocoran kredensial), dan werkzeug (CSRF & Path Traversal).

SAST (Code Findings): Pada backend, ditemukan celah SQL Injection karena penggabungan string mentah ke dalam query SQL, konfigurasi CORS yang tidak aman (allow_origins=["*"]), serta eksekusi OS Command yang berbahaya (subprocess.run dengan shell=True). Pada frontend, ditemukan celah Cross-Site Scripting (XSS) akibat penggunaan innerHTML.

False Positives (Ignored Rules): Saya memilih untuk mengabaikan peringatan SQL Injection pada baris stmt.offset(skip).limit(limit) di action_items.py dan notes.py. Semgrep menandainya karena variabel skip dan limit berasal dari input pengguna. Namun, karena FastAPI dan Pydantic secara ketat memvalidasi tipe data (type hinting) parameter tersebut sebagai int, input teks berbahaya tidak akan bisa masuk, sehingga celah ini sebenarnya aman (False Positive).

## Fix #1
a. File and line(s)
> `backend/app/routers/notes.py` (Baris 71-79, fungsi `unsafe_search`)

b. Rule/category Semgrep flagged
> `python.sqlalchemy.security.audit.avoid-sqlalchemy-text`

c. Brief risk description
> Penggunaan f-string (`f"..."`) untuk memasukkan *input* pengguna langsung ke dalam *query* SQL mentah memungkinkan penyerang memanipulasi *query* untuk mencuri atau menghapus data (SQL Injection).

d. Your change (short code diff or explanation, AI coding tool usage)
> 
*Before*: `WHERE title LIKE '%{q}%' OR content LIKE '%{q}%'`
*After*: `WHERE title LIKE :q OR content LIKE :q`. Saya menggunakan *parameterized query* dengan *bind parameters* di eksekusi SQL (`db.execute(sql, {"q": f"%{q}%"})`).


e. Why this mitigates the issue
> Menggunakan *bind parameter* memaksa *database* untuk memperlakukan *input* pengguna murni sebagai data/nilai, bukan sebagai bagian dari kode perintah SQL yang bisa dieksekusi.

## Fix #2
a. File and line(s)
> `frontend/app.js` (Baris 14, fungsi render)

b. Rule/category Semgrep flagged
> `javascript.browser.security.insecure-document-method`

c. Brief risk description
> Penggunaan `innerHTML` dengan data yang berasal dari *database* berisiko mengeksekusi *script* berbahaya (XSS) di browser pengguna jika ada *note* yang mengandung *tag* HTML/Script.

d. Your change (short code diff or explanation, AI coding tool usage)
> 
*Before*: `li.innerHTML = "<strong>" + n.title + "</strong>: " + n.content;`
*After*: Menggantinya dengan manipulasi DOM yang aman menggunakan `document.createElement("strong")` dan menyisipkan teks melalui properti `textContent`.

e. Why this mitigates the issue
> Properti `textContent` secara otomatis melakukan *escape* pada karakter khusus HTML. Jika ada *tag* `<script>`, itu hanya akan dirender sebagai teks biasa dan gagal dieksekusi oleh browser.

## Fix #3
a. File and line(s)
> `requirements.txt`

b. Rule/category Semgrep flagged
> Supply Chain Findings (contoh: CVE-2020-1747 untuk PyYAML, CVE-2024-3772 untuk pydantic)

c. Brief risk description
> Menggunakan pustaka pihak ketiga versi lama yang sudah terpublikasi secara global memiliki celah kritis, seperti *Remote Code Execution* atau *Denial of Service*.

d. Your change (short code diff or explanation, AI coding tool usage)
> 
Gemini berkata

Wah, kamu benar-benar tajam! Aku angkat tangan dan mengakui kesalahanku. 😂🙌

Aku terlalu larut dan fokus membedah drama perbedaan versi Pydantic V1 vs V2, sampai-sampai aku melewatkan satu detail krusial yang sangat mendasar: aiofiles. Kamu yang berhasil memecahkan teka-teki terakhirnya!

Sebagai konteks kenapa kamu benar: Di versi FastAPI modern, fitur StaticFiles (yang dipakai di main.py untuk me-render folder frontend milikmu) wajib menggunakan pustaka aiofiles agar bisa membaca file secara asinkron. Karena kita meng-upgrade FastAPI-nya ke versi modern untuk menambal celah keamanan, kita juga harus mengundang aiofiles ke dalam file requirements.txt. Insting debugging-mu sangat luar biasa!

Sekarang karena terminalmu sudah menunjukkan pesan kemenangan make test berwarna HIJAU, kita bisa menutup lembaran kelam Dependency Hell ini. 🚀

Langkah terakhir untuk Week 6 adalah menyusun laporan akhir. Silakan copy-paste draf di bawah ini ke dalam file week6/writeup.md milikmu:
Markdown

# Week 6 - Scan and Fix Vulnerabilities with Semgrep: Writeup

## 1. Brief Findings Overview
- **Categories Reported**: Semgrep melaporkan banyak celah kritis pada kategori SAST (contoh: SQL Injection, OS Command Injection, dan XSS) serta kategori SCA/Supply Chain (banyak dependensi yang usang dan rentan seperti PyYAML, Werkzeug, dan requests).
- **False Positives Ignored**: Saya mengabaikan peringatan `generic-sql-fastapi` pada baris `stmt.offset(skip).limit(limit)` di file router. Semgrep menandainya karena input berasal dari pengguna, namun karena variabel `skip` dan `limit` sudah divalidasi secara ketat oleh FastAPI/Pydantic sebagai tipe data integer (`int`), input tersebut tidak mungkin disisipi *string* SQL berbahaya.

## 2. Three Fixes (Before -> After)

### Fix 1: SQL Injection (Backend SAST)
- **File and line(s)**: `backend/app/routers/notes.py` (Baris 71-79, fungsi `unsafe_search`)
- **Rule/category**: `python.sqlalchemy.security.audit.avoid-sqlalchemy-text`
- **Brief risk description**: Penggunaan f-string (`f"..."`) untuk memasukkan *input* pengguna langsung ke dalam *query* SQL mentah memungkinkan penyerang memanipulasi *query* untuk mencuri atau menghapus data (SQL Injection).
- **Your change**:
  *Before*: `WHERE title LIKE '%{q}%' OR content LIKE '%{q}%'`
  *After*: `WHERE title LIKE :q OR content LIKE :q`. Saya menggunakan *parameterized query* dengan *bind parameters* di eksekusi SQL (`db.execute(sql, {"q": f"%{q}%"})`).
- **Why this mitigates the issue**: Menggunakan *bind parameter* memaksa *database* untuk memperlakukan *input* pengguna murni sebagai data/nilai, bukan sebagai bagian dari kode perintah SQL yang bisa dieksekusi.

### Fix 2: Cross-Site Scripting / XSS (Frontend SAST)
- **File and line(s)**: `frontend/app.js` (Baris 14, fungsi render)
- **Rule/category**: `javascript.browser.security.insecure-document-method`
- **Brief risk description**: Penggunaan `innerHTML` dengan data yang berasal dari *database* berisiko mengeksekusi *script* berbahaya (XSS) di browser pengguna jika ada *note* yang mengandung *tag* HTML/Script.
- **Your change**:
  *Before*: `li.innerHTML = "<strong>" + n.title + "</strong>: " + n.content;`
  *After*: Menggantinya dengan manipulasi DOM yang aman menggunakan `document.createElement("strong")` dan menyisipkan teks melalui properti `textContent`.
- **Why this mitigates the issue**: Properti `textContent` secara otomatis melakukan *escape* pada karakter khusus HTML. Jika ada *tag* `<script>`, itu hanya akan dirender sebagai teks biasa dan gagal dieksekusi oleh browser.

### Fix 3: Supply Chain Vulnerabilities (Dependencies SCA)
- **File and line(s)**: `requirements.txt`
- **Rule/category**: Supply Chain Findings (contoh: CVE-2020-1747 untuk PyYAML, CVE-2024-3772 untuk pydantic)
- **Brief risk description**: Menggunakan pustaka pihak ketiga versi lama yang sudah terpublikasi secara global memiliki celah kritis, seperti *Remote Code Execution* atau *Denial of Service*.
- **Your change**:
  *Before*: Menggunakan versi lama seperti `PyYAML==5.1` dan `pydantic==1.5.1`.
  *After*: Meng-*upgrade* pustaka tersebut ke versi modern yang sudah di-*patch* (misalnya `PyYAML>=6.0.1` dan `pydantic>=2.4.0`). Penyesuaian ini juga mengharuskan saya merombak sintaks `.dict()` menjadi `.model_dump()` di kode aplikasi, serta menambahkan pustaka `aiofiles` secara manual untuk mengakomodasi FastAPI versi modern.

e. Why this mitigates the issue
> Menggunakan versi pustaka terbaru memastikan bahwa perbaikan keamanan resmi (*security patches*) dari para *maintainer* pustaka tersebut sudah diterapkan di aplikasi kita, menutup lubang eksploitasi yang sudah diketahui publik.