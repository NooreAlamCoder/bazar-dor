# 🛒 বাজার দর

বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বর্তমান বাজারদর এক নজরে দেখার জন্য তৈরি একটি responsive web application।

## 📌 Project Overview

**বাজার দর** একটি daily essentials price tracking website যেখানে ব্যবহারকারীরা বিভিন্ন প্রয়োজনীয় পণ্যের বর্তমান দাম, দাম কতটা বেড়েছে বা কমেছে, বিভিন্ন বাজারের সর্বনিম্ন ও সর্বোচ্চ দাম এবং category অনুযায়ী পণ্যের তথ্য দেখতে পারবেন।

প্রজেক্টটি বাংলাদেশের ব্যবহারকারীদের কথা মাথায় রেখে বাংলা ভাষায় তৈরি করা হয়েছে।

---

## 🚀 Live Website

**Live Site:**  
`https://`

> Vercel deployment-এর পরে এখানে তোমার actual live URL বসাতে হবে।

---

## 🛠️ Technologies Used

- Next.js
- TypeScript
- React
- Tailwind CSS
- DaisyUI
- Better Auth
- MongoDB
- React Hot Toast
- Lucide React
- REST API
- Vercel

---

## ✨ Key Features

### 🏠 Home Page

- সুন্দর responsive hero section
- বর্তমান বাজারদরের price ticker
- সবচেয়ে বেশি দাম বেড়েছে এমন পণ্য
- সবচেয়ে বেশি দাম কমেছে এমন পণ্য
- সব পণ্যের তালিকা
- Responsive product cards
- Product details page-এ যাওয়ার সুবিধা

### 📦 Product Details

প্রতিটি পণ্যের জন্য দেখা যায়:

- পণ্যের নাম
- Category
- Unit
- আজকের দাম
- গতকালের দামের তুলনায় পরিবর্তন
- সর্বনিম্ন দাম
- সর্বোচ্চ দাম
- গড় দাম
- বিভিন্ন বাজারের বর্তমান মূল্য

### 🗂️ Category System

পণ্যগুলো বিভিন্ন category অনুযায়ী সাজানো হয়েছে:

- 🍚 চাল
- 🫘 ডাল
- 🛢️ তেল
- 🥬 সবজি
- 🐟 মাছ
- 🍗 মাংস
- 🥚 ডিম-দুধ
- 🌶️ মসলা

Category page থেকে নির্দিষ্ট category-এর পণ্য দেখা এবং price অনুযায়ী sorting করা যায়।

### 🔐 Authentication

Better Auth ব্যবহার করে:

- Email & Password Sign Up
- Email & Password Sign In
- Google Sign In
- GitHub Sign In
- Sign Out
- Protected Product Details
- User Profile

### 👤 User Profile

Logged-in user নিজের:

- নাম
- Email
- Profile information

দেখতে এবং নিজের নাম update করতে পারবেন।

### 📱 Responsive Design

Website-টি:

- Mobile
- Tablet
- Desktop

সব screen size-এর জন্য responsive করা হয়েছে।

### ⚠️ Error & Loading States

- Loading skeleton
- Error toast
- Invalid category handling
- Invalid product handling
- Global 404 page
- Authentication error handling

---

## 🔗 API

এই project-এর product এবং category data REST API থেকে নেওয়া হয়েছে।

### Base API

```text
https://api.api-store.workers.dev/api/bazardor

Available Endpoints
GET /products
GET /products?category=chal
GET /products/:id
GET /categories
GET /categories/:slug

📂 Main Project Structure
src/
├── app/
│   ├── api/
│   │   └── auth/
│   ├── category/
│   ├── product/
│   ├── profile/
│   ├── signin/
│   ├── signup/
│   ├── not-found.tsx
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── category/
│   ├── layout/
│   ├── product/
│   └── ...
│
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   ├── auth-client.ts
│   └── mongodb.ts
│
└── types/
    └── product.ts

⚙️ Run Locally
প্রথমে repository clone করুন:
git clone YOUR_GITHUB_REPOSITORY_URL

Project folder-এ যান:
cd your-project-folder

Dependencies install করুন:
npm install

Development server চালু করুন:
npm run dev

তারপর browser-এ যান:
http://localhost:3000

🔐 Environment Variables
Project চালানোর জন্য প্রয়োজনীয় environment variables:
NEXT_PUBLIC_API_URL=
MONGODB_URI=
MONGODB_DB=
BETTER_AUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

Sensitive credentials কখনো public repository-তে commit করা উচিত নয়।

📱 Responsive Support
এই website বিভিন্ন device-এর জন্য optimized:
Device	Support
📱 Mobile	✅
📱 Tablet	✅
💻 Desktop	✅


🎯 Project Goals
এই project-এর মূল লক্ষ্য হলো বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদরকে সহজ, পরিষ্কার এবং user-friendly interface-এর মাধ্যমে উপস্থাপন করা।
ব্যবহারকারী যেন খুব দ্রুত জানতে পারেন:
“আজ কোন পণ্যের দাম কত?”
👨‍💻 Author
Developed as a Programming Hero assignment project.
🛒 বাজার দর
বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের দাম এক নজরে।