# Week 8 Write-up
Tip: To preview this markdown file
- On Mac, press `Command (⌘) + Shift + V`
- On Windows/Linux, press `Ctrl + Shift + V`

## Instructions

Fill out all of the `TODO`s in this file.

## Submission Details

Name: **Muhammad Firas** \
SUNet ID: **2210817110014** \
Citations: ****

This assignment took me about **8** hours to do. 


## App Concept 
```
Konsep aplikasi yang dibangun adalah "Developer Control Center", sebuah alat sederhana untuk membantu pengembang mengelola ide dan tugas mereka. Aplikasi ini memiliki dua fitur utama:
1. **Notes**: Untuk membuat, membaca, memperbarui, dan menghapus catatan teks (CRUD).
2. **Action Items**: Untuk mengelola daftar tugas dengan status 'selesai' atau 'belum selesai' (CRUD).```


## Version #1 Description
```
APP DETAILS:
===============
Folder name: v0 project
AI app generation platform: No (manually built)
Tech Stack: React 18 + Next.js 16 + Tailwind CSS + Shadcn/ui
Persistence: Browser Local Storage (JSON serialization)
Frameworks/Libraries Used: React, Next.js, Radix UI, Shadcn/ui, Lucide Icons, TypeScript
(Optional but recommended) Screenshots of core flows: TODO

REFLECTIONS:
===============
a. Issues encountered per stack and how you resolved them: difficuly in moving the project from v0 to this folder

b. Prompting (e.g. what required additional guidance; what worked poorly/wel): pretty well using copilot

c. Approximate time-to-first-run and time-to-feature metrics: 2 hours
```

## Version #2 Description
```
APP DETAILS:
===============
Folder name: developer-control-center-nextjs
AI app generation platform: No (manually built)
Tech Stack: React 18 + Next.js 14 + Tailwind CSS + Prisma ORM + SQLite
Persistence: SQLite Database (dev.db file)
Frameworks/Libraries Used: React, Next.js, Prisma, TypeScript, Tailwind CSS, Axios
(Optional but recommended) Screenshots of core flows: TODO

REFLECTIONS:
===============
a. Issues encountered per stack and how you resolved them: - Prisma setup and migrations were a bit tricky at first, but following the documentation and some trial-and-error helped me get it working.
- Integrating Prisma with Next.js API routes required some adjustments to ensure proper database connections and error

b. Prompting (e.g. what required additional guidance; what worked poorly/wel): - Copilot was helpful for generating boilerplate code for API routes and Prisma queries, but I had to manually adjust the logic to fit the specific requirements of the app.
- I found that breaking down the features into smaller tasks and prompting for each step helped me stay

c. Approximate time-to-first-run and time-to-feature metrics: 4 hours (including time spent on Prisma setup and debugging)
```

## Version #3 Description
```
APP DETAILS:
===============
Folder name: DCC2
AI app generation platform: TBD (Bolt.new or manual)
Tech Stack: Django + Django REST Framework (Python Backend) + React 18 + Vite (Frontend) + PostgreSQL
Persistence: PostgreSQL Database
Frameworks/Libraries Used: Django, Django REST Framework, React, Vite, TypeScript, Tailwind CSS
(Optional but recommended) Screenshots of core flows: TODO

REFLECTIONS:
===============
a. Issues encountered per stack and how you resolved them: - Setting up Django REST Framework and integrating it with React was a bit challenging, especially with CORS issues. I resolved this by configuring the Django CORS headers properly and ensuring that the frontend and backend were running on compatible ports.
- Database migrations and schema design took some time to get right, but I used Django's built

b. Prompting (e.g. what required additional guidance; what worked poorly/wel): - i found that it is easy when using claude opus, the problem is that the front end and back end needed to be manually turned on

c. Approximate time-to-first-run and time-to-feature metrics: 4 hours (including time spent on Django setup and debugging)
```
