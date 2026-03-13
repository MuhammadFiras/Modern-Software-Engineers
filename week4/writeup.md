# Week 4 Write-up
Tip: To preview this markdown file
- On Mac, press `Command (⌘) + Shift + V`
- On Windows/Linux, press `Ctrl + Shift + V`

## INSTRUCTIONS

Fill out all of the `TODO`s in this file.

## SUBMISSION DETAILS

Name: **Muhammad Firas** \
SUNet ID: **TODO** \
Citations: **TODO**

This assignment took me about **TODO** hours to do. 


## YOUR RESPONSES
### Automation #1
a. Design inspiration (e.g. cite the best-practices and/or sub-agents docs)
> Terinspirasi dari panduan *Claude Code best practices* mengenai "Code navigation and entry points" serta "Style and safety guardrails". Tujuannya adalah memberikan konteks lingkungan yang kaya kepada agen AI agar tidak tersesat di dalam repositori dan mematuhi standar *coding* yang ditetapkan.

b. Design of each automation, including goals, inputs/outputs, steps
> 
- **Goals**: Mengotomatiskan pemberian instruksi dasar kepada agen AI mengenai arsitektur proyek, perintah terminal yang valid, dan aturan *Test-Driven Development* (TDD).
- **Inputs**: File `CLAUDE.md` dibaca secara pasif oleh Claude Code saat sesi dimulai.
- **Outputs**: Agen AI menyesuaikan perilakunya (contoh: selalu menjalankan `make format` dan `make lint` setelah menulis kode).
- **Steps**: Agen membaca struktur direktori (seperti letak `routers/` dan `schemas.py`), mengenali perintah `make`, dan mengaplikasikan *guardrails* sebelum menyentuh file *database*.

c. How to run it (exact commands), expected outputs, and rollback/safety notes
> 
- **How to run**: Otomatis berjalan (*zero-click*). Buka Claude Code atau Cursor di direktori `week4/`.
- **Expected output**: AI langsung mengetahui cara memutar server (`make run`) dan tidak perlu ditanya berulang kali tentang cara menjalankan *test*.
- **Safety notes**: Terdapat instruksi eksplisit "Do not drop or wipe the SQLite database directly", sehingga mencegah AI melakukan penghapusan data mentah secara destruktif tanpa izin.

d. Before vs. after (i.e. manual workflow vs. automated workflow)
> 
- **Before (Manual Workflow)**: *Developer* harus terus-menerus mengetik *prompt* panjang seperti: *"Tolong buat endpoint baru di routers, gunakan pydantic di schemas.py, lalu jangan lupa jalankan make test dan make lint."*
- **After (Automated Workflow)**: *Developer* cukup mengetik *"Buatkan endpoint untuk menambahkan task baru"*. AI secara otomatis akan menempatkannya di direktori yang benar, membuat *schema*, dan menjalankan proses *linting* di latar belakang.

e. How you used the automation to enhance the starter application
> Saya menggunakan otomatisasi ini untuk menjaga integritas arsitektur aplikasi *starter*. Saat saya meminta AI untuk menambahkan fitur "Delete Note" pada FastAPI *backend*, AI langsung tahu bahwa ia harus membuat *schema* Pydantic (karena larangan penggunaan `Dict[str, Any]` di `CLAUDE.md`) dan secara proaktif menulis *failing test* terlebih dahulu di folder `backend/tests/` sebelum merombak logika di `routers/notes.py`. Ini memastikan standar kualitas aplikasi tidak menurun saat dikembangkan oleh agen otonom.


### Automation #2
a. Design inspiration (e.g. cite the best-practices and/or sub-agents docs)
> Terinspirasi dari fitur *Slash Commands* di *Claude Code best practices* untuk merangkum *workflow* yang repetitif. Mengadaptasi konsep "Test runner with coverage" yang berfungsi sebagai asisten *debugging* instan.

b. Design of each automation, including goals, inputs/outputs, steps
> 
- **Goals**: Mengotomatiskan proses eksekusi *testing* sekaligus menganalisis *error traceback* jika terjadi kegagalan, sehingga *developer* tidak perlu membaca log terminal yang panjang secara manual.
- **Inputs**: Mengetikkan perintah `/test-runner` di antarmuka *chat* agen.
- **Outputs**: Ringkasan status *test* (Sukses/Gagal). Jika gagal, AI akan mengeluarkan identifikasi file yang rusak, penjelasan *error*, dan usulan perbaikan (*proposed code fix*).
- **Steps**: AI mengeksekusi `make test` -> Membaca *exit code* -> Jika > 0, membedah *stack trace* -> Menyusun usulan perbaikan -> Meminta konfirmasi eksekusi kepada *developer*.

c. How to run it (exact commands), expected outputs, and rollback/safety notes
> 
- **How to run**: Ketik `/test-runner` di dalam jendela *chat* Claude Code.
- **Expected output**: Jika sukses: *"✅ All tests passed successfully! The codebase is stable."* Jika gagal, akan muncul analisis *error* terstruktur beserta blok kode solusi.
- **Safety notes**: Terdapat instruksi "Ask for my confirmation before applying any changes", yang bertindak sebagai *safety rollback* agar AI tidak secara sepihak mengubah kode aplikasi tanpa validasi manusia.

d. Before vs. after (i.e. manual workflow vs. automated workflow)
> 
- **Before (Manual Workflow)**: Mengetik `make test` di terminal -> Melihat layar merah -> *Copy* pesan *error* -> *Paste* ke ChatGPT/Claude -> Menunggu jawaban -> Mengaplikasikan perbaikan manual.
- **After (Automated Workflow)**: Mengetik `/test-runner` -> AI langsung mengeksekusi, membaca *error*, dan menyodorkan tombol "Apply Fix" di layar dalam satu siklus terintegrasi.

e. How you used the automation to enhance the starter application
> Saya sangat mengandalkan perintah `/test-runner` saat melakukan perombakan atau penambahan fitur di aplikasi *starter*. Misalnya, saat saya memodifikasi skema *database* di `models.py`, saya langsung mengeksekusi `/test-runner`. Ketika ternyata ada beberapa *test* di `test_notes.py` yang gagal karena ketidakcocokan tipe data, AI langsung menyorot baris spesifik yang menyebabkan kegagalan dan memberikan *patch* perbaikannya, memangkas waktu *debugging* saya secara drastis dari hitungan menit menjadi hanya beberapa detik.


### *(Optional) Automation #3*
*If you choose to build additional automations, feel free to detail them here!*

a. Design inspiration (e.g. cite the best-practices and/or sub-agents docs)
> TODO

b. Design of each automation, including goals, inputs/outputs, steps
> TODO

c. How to run it (exact commands), expected outputs, and rollback/safety notes
> TODO

d. Before vs. after (i.e. manual workflow vs. automated workflow)
> TODO

e. How you used the automation to enhance the starter application
> TODO
