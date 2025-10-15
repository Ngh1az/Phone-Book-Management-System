# 📋 Danh Sách Tất Cả Các Trang Có Thể Truy Cập

## 🌐 URL Overview

### **Root**

- **`/`** → Redirect tự động:
    - Đã đăng nhập → `/dashboard`
    - Chưa đăng nhập → `/login`

---

## 🔐 Authentication Pages (Guest Only)

### **1. Register**

- **URL:** `/register`
- **Method:** GET
- **Page:** `auth/register.tsx`
- **Mô tả:** Đăng ký tài khoản mới
- **Fields:** Name, Email, Password, Confirm Password

### **2. Login**

- **URL:** `/login`
- **Method:** GET
- **Page:** `auth/login.tsx`
- **Mô tả:** Đăng nhập
- **Fields:** Email, Password, Remember Me

### **3. Forgot Password**

- **URL:** `/forgot-password`
- **Method:** GET
- **Page:** `auth/forgot-password.tsx`
- **Mô tả:** Quên mật khẩu - Gửi link reset
- **Fields:** Email

### **4. Reset Password**

- **URL:** `/reset-password/{token}`
- **Method:** GET
- **Page:** `auth/reset-password.tsx`
- **Mô tả:** Reset mật khẩu với token từ email
- **Fields:** Email, Password, Confirm Password

---

## 🔒 Authenticated Pages (Must Login)

### **📊 Dashboard**

- **URL:** `/dashboard`
- **Page:** `dashboard.tsx`
- **Mô tả:** Trang chính với statistics và overview
- **Features:**
    - 4 statistics cards (Total, Favorites, Groups, Tags)
    - 5 recent contacts
    - Top 5 groups by usage
    - Top 5 tags by usage
    - 4 quick action buttons

---

### **👥 Contacts Management**

#### **Contacts Index**

- **URL:** `/contacts`
- **Page:** `contacts/index.tsx`
- **Mô tả:** Danh sách tất cả contacts
- **Features:**
    - Search contacts
    - Filter by group
    - Filter by tag
    - Filter favorites
    - Pagination (15 per page)
    - Toggle favorite
    - Delete contact

#### **Create Contact** ⚠️ (Chưa có UI)

- **URL:** `/contacts/create`
- **Status:** ❌ Page chưa tạo
- **Mô tả:** Form tạo contact mới

#### **View Contact** ⚠️ (Chưa có UI)

- **URL:** `/contacts/{id}`
- **Status:** ❌ Page chưa tạo
- **Mô tả:** Xem chi tiết contact

#### **Edit Contact** ⚠️ (Chưa có UI)

- **URL:** `/contacts/{id}/edit`
- **Status:** ❌ Page chưa tạo
- **Mô tả:** Form chỉnh sửa contact

---

### **📁 Groups Management**

#### **Groups Index** ⚠️ (Chưa có UI)

- **URL:** `/groups`
- **Status:** ❌ Page chưa tạo
- **Backend:** ✅ Controller có sẵn
- **Mô tả:** Danh sách groups

#### **Create Group** ⚠️ (Chưa có UI)

- **URL:** `/groups/create`
- **Status:** ❌ Page chưa tạo
- **Backend:** ✅ Controller có sẵn

#### **View Group** ⚠️ (Chưa có UI)

- **URL:** `/groups/{id}`
- **Status:** ❌ Page chưa tạo
- **Backend:** ✅ Controller có sẵn

#### **Edit Group** ⚠️ (Chưa có UI)

- **URL:** `/groups/{id}/edit`
- **Status:** ❌ Page chưa tạo
- **Backend:** ✅ Controller có sẵn

---

### **🏷️ Tags Management**

#### **Tags Index** ⚠️ (Chưa có UI)

- **URL:** `/tags`
- **Status:** ❌ Page chưa tạo
- **Backend:** ✅ Controller có sẵn
- **Mô tả:** Danh sách tags

#### **Create Tag** ⚠️ (Chưa có UI)

- **URL:** `/tags/create`
- **Status:** ❌ Page chưa tạo
- **Backend:** ✅ Controller có sẵn

#### **View Tag** ⚠️ (Chưa có UI)

- **URL:** `/tags/{id}`
- **Status:** ❌ Page chưa tạo
- **Backend:** ✅ Controller có sẵn

#### **Edit Tag** ⚠️ (Chưa có UI)

- **URL:** `/tags/{id}/edit`
- **Status:** ❌ Page chưa tạo
- **Backend:** ✅ Controller có sẵn

---

### **⚙️ Settings Pages**

#### **Settings (Root)**

- **URL:** `/settings`
- **Redirect:** → `/settings/profile`

#### **Profile Settings**

- **URL:** `/settings/profile`
- **Page:** `settings/profile.tsx`
- **Mô tả:** Cập nhật thông tin cá nhân
- **Features:**
    - Update name
    - Update email
    - Delete account

#### **Password Settings**

- **URL:** `/settings/password`
- **Page:** `settings/password.tsx`
- **Mô tả:** Đổi mật khẩu
- **Features:**
    - Current password
    - New password
    - Confirm password

#### **Appearance Settings**

- **URL:** `/settings/appearance`
- **Page:** `settings/appearance.tsx`
- **Mô tả:** Cài đặt giao diện
- **Features:**
    - Light/Dark mode toggle
    - Theme preferences

#### **Two-Factor Authentication**

- **URL:** `/settings/two-factor`
- **Page:** `settings/two-factor.tsx`
- **Mô tả:** Cài đặt 2FA
- **Features:**
    - Enable/Disable 2FA
    - QR Code scan
    - Recovery codes

---

### **📧 Email Verification**

#### **Verification Notice**

- **URL:** `/verify-email`
- **Page:** `auth/verify-email.tsx`
- **Mô tả:** Thông báo cần xác thực email
- **Trigger:** Sau khi register

#### **Verify Email (Link from Email)**

- **URL:** `/verify-email/{id}/{hash}`
- **Mô tả:** Xác thực email qua link

---

## 📊 Summary

### **✅ HOẠT ĐỘNG (8 pages):**

1. `/` - Home redirect
2. `/login` - Login page
3. `/register` - Register page
4. `/forgot-password` - Forgot password
5. `/reset-password/{token}` - Reset password
6. `/dashboard` - Dashboard (NEW! 🎨)
7. `/contacts` - Contacts list (NEW! 📇)
8. `/settings/*` - 4 settings pages

### **⚠️ BACKEND SẴN SÀNG NHƯNG CHƯA CÓ UI (18 pages):**

**Contacts (3):**

- `/contacts/create`
- `/contacts/{id}`
- `/contacts/{id}/edit`

**Groups (7):**

- `/groups` (index)
- `/groups/create`
- `/groups/{id}` (show)
- `/groups/{id}/edit`
- Plus 3 POST/PUT/DELETE endpoints

**Tags (7):**

- `/tags` (index)
- `/tags/create`
- `/tags/{id}` (show)
- `/tags/{id}/edit`
- Plus 3 POST/PUT/DELETE endpoints

**Email (1):**

- `/verify-email` (notice)

---

## 🎯 Test URLs (Copy & Paste)

### **Public (Không cần login):**

```
http://localhost:8000/
http://localhost:8000/login
http://localhost:8000/register
http://localhost:8000/forgot-password
```

### **Authenticated (Cần login với test@example.com / password):**

```
http://localhost:8000/dashboard
http://localhost:8000/contacts
http://localhost:8000/contacts?search=john
http://localhost:8000/contacts?is_favorite=true
http://localhost:8000/settings/profile
http://localhost:8000/settings/password
http://localhost:8000/settings/appearance
http://localhost:8000/settings/two-factor
```

### **Backend Ready but No UI (sẽ lỗi 404 hoặc blank):**

```
http://localhost:8000/contacts/create ⚠️
http://localhost:8000/contacts/1 ⚠️
http://localhost:8000/groups ⚠️
http://localhost:8000/tags ⚠️
```

---

## 🚀 Next Steps

### **Priority 1: Contact Management Forms**

Cần tạo 3 pages:

1. `contacts/create.tsx` - Form tạo contact
2. `contacts/edit.tsx` - Form sửa contact
3. `contacts/show.tsx` - Xem chi tiết contact

### **Priority 2: Groups Management**

Cần tạo 4 pages:

1. `groups/index.tsx` - Danh sách groups
2. `groups/create.tsx` - Form tạo group
3. `groups/edit.tsx` - Form sửa group
4. `groups/show.tsx` - Xem group + contacts

### **Priority 3: Tags Management**

Cần tạo 4 pages:

1. `tags/index.tsx` - Danh sách tags
2. `tags/create.tsx` - Form tạo tag
3. `tags/edit.tsx` - Form sửa tag
4. `tags/show.tsx` - Xem tag + contacts

---

## 📱 Navigation Structure

```
┌─────────────────────────────────────┐
│            Sidebar Menu             │
├─────────────────────────────────────┤
│ 🏠 Dashboard (/dashboard)          │ ✅
│ 👥 Contacts (/contacts)            │ ✅
│    ├─ List                         │ ✅
│    ├─ Create                       │ ❌
│    └─ Detail                       │ ❌
│ 📁 Groups (/groups)                │ ❌
│ 🏷️  Tags (/tags)                   │ ❌
│ ⚙️  Settings (/settings/*)          │ ✅
│    ├─ Profile                      │ ✅
│    ├─ Password                     │ ✅
│    ├─ Appearance                   │ ✅
│    └─ Two-Factor                   │ ✅
│ 🚪 Logout                          │ ✅
└─────────────────────────────────────┘
```

---

## 🔍 How to Test

### **1. Login:**

```
Email: test@example.com
Password: password
```

### **2. Try These Working Pages:**

- ✅ Dashboard → See statistics
- ✅ Contacts → List, search, filter
- ✅ Settings → Update profile, change password

### **3. These Will Show "404 Not Found":**

- ❌ /contacts/create
- ❌ /groups
- ❌ /tags

**Reason:** Backend có sẵn nhưng chưa có React component (\*.tsx file)

---

## 📊 Progress Tracker

**Total Pages in App:** 26 pages (including forms)

**Completed:** 8 pages (31%)

- ✅ Auth flow (4 pages)
- ✅ Dashboard (1 page)
- ✅ Contacts list (1 page)
- ✅ Settings (4 pages)

**Backend Ready, Need Frontend:** 18 pages (69%)

- ⚠️ Contacts forms (3 pages)
- ⚠️ Groups (7 pages)
- ⚠️ Tags (7 pages)
- ⚠️ Email verification (1 page)

---

**Last Updated:** October 14, 2025  
**Status:** Phase 3 - 31% Complete  
**Next:** Build contact forms (create/edit/show)
