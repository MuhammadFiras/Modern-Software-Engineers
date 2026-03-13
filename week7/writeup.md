# Week 7 Write-up
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


## Task 1: Add more endpoints and validations
a. Links to relevant commits/issues
> TODO

b. PR Description
> Menambahkan *endpoint* `DELETE` untuk fitur Notes dan Action Items beserta *error handling* (404 Not Found). Menambahkan juga Pydantic `Field` validation (`min_length=1`) untuk memastikan *input* tidak boleh berupa teks kosong.

c. Graphite Diamond generated code review
> MAI memberikan ringkasan yang bagus tentang implementasi status code `204 No Content`, namun gagal menyadari bahwa penambahan `max_length` mematahkan file *test* yang sudah ada.

## Task 2: Extend extraction logic
a. Links to relevant commits/issues
> TODO

b. PR Description
> Memperbarui logika ekstraksi di `services/extract.py` dengan *regex* tingkat lanjut untuk mengenali awalan seperti `TODO:`, `ACTION:`, `TASK:`, dan *markdown checkboxes* (`- [ ]`, `* [ ]`).

c. Graphite Diamond generated code review
> AI dengan tepat memuji penggunaan Regex yang lebih efisien dan *clean architecture* yang dipertahankan. (Disubmit otomatis menggunakan Graphite CLI `gt submit`).

## Task 3: Try adding a new model and relationships
a. Links to relevant commits/issues
> TODO

b. PR Description
> Menambahkan model `Tag` baru pada *database* yang memiliki relasi *Many-to-Many* dengan model `Note` menggunakan tabel asosiasi. Menambahkan operasi dasar CRUD untuk Tag dan mengintegrasikannya ke *schema* dan *router* yang ada.

c. Graphite Diamond generated code review
> AI mampu menganalisis pembuatan tabel asosiasi SQLAlchemy dan validasi Pydantic untuk *nested models* (daftar Tag di dalam Note).

## Task 4: Improve tests for pagination and sorting
a. Links to relevant commits/issues
> TODO

b. PR Description
> Menambahkan fungsi pengujian ekstensif di `tests/test_notes.py` dan `tests/test_action_items.py` untuk memvalidasi fitur *pagination* (`skip`, `limit`) dan *sorting* (`sort=title`, `sort=-created_at`).

c. Graphite Diamond generated code review
> AI mengapresiasi peningkatan *test coverage* dan memvalidasi penggunaan *FastAPI TestClient* yang tepat.

## Brief Reflection 
a. The types of comments you typically made in your manual reviews (e.g., correctness, performance, security, naming, test gaps, API shape, UX, docs).
> Dalam *manual review* yang saya lakukan, saya cenderung fokus pada **Correctness** dan **Test Gaps**. Contohnya, saya sangat memperhatikan apakah aturan validasi Pydantic yang dibuat AI tidak merusak data uji (*test data*) yang sudah ada di *codebase*, serta memastikan nama *field* sinkron antara *schema* Pydantic dan model SQLAlchemy. 

b. A comparison of **your** comments vs. **Graphite’s** AI-generated comments for each PR.
> TODO

c. When the AI reviews were better/worse than yours (cite specific examples)
> TODO

d. Your comfort level trusting AI reviews going forward and any heuristics for when to rely on them.
>TODO 



