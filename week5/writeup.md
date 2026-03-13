# Week 5 Write-up
Tip: To preview this markdown file
- On Mac, press `Command (⌘) + Shift + V`
- On Windows/Linux, press `Ctrl + Shift + V`

## INSTRUCTIONS

Fill out all of the `TODO`s in this file.

## SUBMISSION DETAILS

Name: **TODO** \
SUNet ID: **TODO** \
Citations: **TODO**

This assignment took me about **TODO** hours to do. 


## YOUR RESPONSES
### Automation A: Warp Drive saved prompts, rules, MCP servers

a. Design of each automation, including goals, inputs/outputs, steps
> 
- **Goals**: Memaksa agen AI untuk selalu menerapkan standar jaminan kualitas perangkat lunak (*software quality assurance*) secara proaktif setiap kali mengimplementasikan fitur baru, tanpa perlu diinstruksikan ulang oleh *developer*.
- **Inputs**: Sebuah *Saved Prompt* di Warp Drive yang diaktifkan sebelum memberikan *prompt* instruksi *coding*.
- **Outputs**: Eksekusi berurutan dari `make format`, `make lint`, dan `make test` yang berjalan otomatis di terminal setelah AI selesai menulis kode.
- **Steps**: Agen menganalisis direktori -> Menulis kode -> Menjalankan *formatter* (Black) -> Menjalankan *linter* (Ruff) -> Menjalankan *test suite* (Pytest) -> Melakukan *self-correction* jika *exit code* > 0.

b. Before vs. after (i.e. manual workflow vs. automated workflow)
> 
- **Before (Manual Workflow)**: *Developer* harus terus-menerus mengetik atau mengingatkan AI untuk mengecek *style* dan menjalankan tes. Seringkali *developer* lupa, sehingga *commit* yang masuk merusak integrasi (*broken build*).
- **After (Automated Workflow)**: Standar operasi (SOP) terbungkus dalam satu klik (*Rule*). AI tidak akan berhenti bekerja sebelum layar terminal menunjukkan *all tests passed*, memberikan jaminan bahwa kode yang dihasilkan selalu *production-ready*.

c. Autonomy levels used for each completed task (what code permissions, why, and how you supervised)
> 
Saya memberikan tingkat otonomi penuh (*High Autonomy*) bagi agen untuk membaca, mengedit file di dalam `backend/` dan `frontend/`, serta mengeksekusi perintah terminal `make`. Supervisi dilakukan secara pasif dengan memantau proses *output* terminal di blok Warp; saya hanya akan mengintervensi jika agen terjebak dalam *looping error* saat *testing*.

d. (if applicable) Multi‑agent notes: roles, coordination strategy, and concurrency wins/risks/failures
> None

e. How you used the automation (what pain point it resolves or accelerates)
> Otomatisasi ini sangat mempercepat alur kerja saya dengan menghilangkan beban kognitif untuk selalu mengingat perintah QA. Rasa frustrasi (*pain point*) saat AI menghasilkan kode yang logikanya benar tetapi formatnya berantakan (*lint error*) berhasil diselesaikan secara permanen.



### Automation B: Multi‑agent workflows in Warp 

a. Design of each automation, including goals, inputs/outputs, steps
> 
- **Goals**: Memaksimalkan efisiensi waktu penyelesaian proyek dengan mendelegasikan dua tugas independen dari `TASKS.md` kepada dua agen AI yang bekerja secara paralel di *tab* terminal Warp yang berbeda.
- **Inputs**: Dua *prompt* terpisah yang dieksekusi nyaris bersamaan di dua *tab*. Tab A mengerjakan Task 7 (Error handling di `main.py` & `schemas.py`), Tab B mengerjakan Task 8 (Pagination di `routers/`).
- **Outputs**: Dua fitur berbeda berhasil diimplementasikan, diformat, dan diuji secara serentak dalam waktu yang sama.

b. Before vs. after (i.e. manual workflow vs. automated workflow)
> 
- **Before (Manual Workflow)**: Pengerjaan linier. Selesaikan Task 7 -> Tes -> Selesaikan Task 8 -> Tes. Membutuhkan waktu tunggu komputasi yang dua kali lebih lama.
- **After (Automated Workflow)**: Pengerjaan asinkron secara paralel. Total waktu penyelesaian (*wall-clock time*) dipangkas hingga 50%.

c. Autonomy levels used for each completed task (what code permissions, why, and how you supervised)
> 
- **Roles**: Agen A bertindak sebagai *Core Infrastructure Engineer* (menangani *envelope error* global). Agen B bertindak sebagai *API Feature Engineer* (menangani parameter paginasi *endpoint*).
- **Coordination Strategy**: Kunci keberhasilan koordinasi ini adalah pemilihan tugas yang memiliki isolasi domain (*domain isolation*). Karena Agen A dan Agen B menyentuh file yang sama sekali berbeda, risiko *race conditions* atau *git file locking* berhasil dihindari tanpa perlu repot menggunakan `git worktree`.
- **Wins/Risks**: 
  - *Wins*: Utilisasi *resource* dan waktu yang luar biasa efisien. Kedua agen berhasil melewati rintangan *testing* bersamaan.
  - *Risks*: Jika tugas yang diberikan memiliki *overlap* file (misal sama-sama mengedit `models.py`), agen berisiko menimpa (*clobbering*) kode satu sama lain yang dapat merusak arsitektur *database*.

d. (if applicable) Multi‑agent notes: roles, coordination strategy, and concurrency wins/risks/failures
> None

e. How you used the automation (what pain point it resolves or accelerates)
> Otomatisasi multi-agen ini menuntaskan hambatan waktu (*bottleneck*). Alih-alih menunggu satu agen selesai "berpikir" dan mengeksekusi perintah terminal, saya memposisikan diri sebagai manajer agen yang mengorkestrasi beberapa pekerja maya sekaligus, memberikan skalabilitas nyata dalam pengerjaan *software*.


### (Optional) Automation C: Any Additional Automations
a. Design of each automation, including goals, inputs/outputs, steps
> TODO

b. Before vs. after (i.e. manual workflow vs. automated workflow)
> TODO

c. Autonomy levels used for each completed task (what code permissions, why, and how you supervised)
> TODO

d. (if applicable) Multi‑agent notes: roles, coordination strategy, and concurrency wins/risks/failures
> TODO

e. How you used the automation (what pain point it resolves or accelerates)
> TODO

