# Contact Trash/Recovery Feature - User Guide

## Overview

The Phone Book Management System includes a **Trash/Recovery** feature that allows users to:
- Soft-delete contacts (they are hidden but not permanently removed)
- View all deleted contacts in a dedicated Trash page
- Restore deleted contacts back to the main list
- Permanently delete contacts (irreversible)

---

## How It Works

### 1. **Soft Delete (Delete to Trash)**

When you delete a contact from the main contacts list:
- The contact is **not permanently removed** from the database
- It is marked with a `deleted_at` timestamp (soft delete)
- The contact becomes invisible in the main contacts list
- You can still recover it from the Trash page

**To delete a contact:**
1. Go to the contact detail page
2. Click the **"Xóa"** (Delete) button
3. Confirm the deletion
4. The contact moves to Trash

---

### 2. **View Trashed Contacts**

**Access the Trash page:**
- Navigate to `/contacts`
- Click the **"Thùng Rác"** (Trash) button in the header
- Or directly visit: `http://localhost:8000/contacts/trash`

**On the Trash page you will see:**
- All your deleted contacts with their details (name, phone, email, group, tags)
- The date each contact was deleted
- Two action options per contact: **Restore** or **Permanently Delete**

---

### 3. **Restore a Contact**

**To restore a deleted contact:**
1. Go to the Trash page (`/contacts/trash`)
2. Find the contact you want to restore
3. Click the **⋮** (three dots) menu on the contact card
4. Select **"Khôi phục"** (Restore)
5. Confirm the action in the dialog
6. The contact will be restored and appear again in your main contacts list

**What happens:**
- The `deleted_at` timestamp is cleared
- The contact becomes visible in `/contacts`
- All associated data (group, tags, avatar) remains intact

---

### 4. **Permanently Delete a Contact**

⚠️ **Warning:** This action is **irreversible**. The contact and all associated data will be permanently removed from the database.

**To permanently delete:**
1. Go to the Trash page (`/contacts/trash`)
2. Find the contact you want to permanently delete
3. Click the **⋮** (three dots) menu
4. Select **"Xóa vĩnh viễn"** (Permanently Delete)
5. Read the warning dialog carefully
6. Confirm the action
7. The contact is **permanently removed** and cannot be recovered

---

## Routes

### Web Routes (Browser UI)

| Route | Method | Description |
|-------|--------|-------------|
| `/contacts/trash` | GET | View all trashed contacts |
| `/contacts/{id}/restore` | POST | Restore a soft-deleted contact |
| `/contacts/{id}/force` | DELETE | Permanently delete a contact |

### API Routes (JSON)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/contacts/trashed` | GET | Get trashed contacts (JSON) |
| `/api/contacts/{id}/restore` | POST | Restore contact (JSON) |

---

## Screenshots / UI Flow

### Main Contacts Page
- New button: **"Thùng Rác"** (Trash) in the header

### Trash Page
- **Empty state**: "Thùng rác trống" (Trash is empty)
- **Contact cards**: Display deleted contacts with:
  - Avatar
  - Name, job title
  - Phone, email
  - Deleted date
  - Group and tags
  - Actions menu (Restore / Permanently Delete)

### Restore Dialog
```
Title: Khôi phục liên hệ?
Message: Bạn có chắc chắn muốn khôi phục liên hệ "[Name]"?
         Liên hệ sẽ được hiển thị lại trong danh sách chính.
Actions: [Hủy] [Khôi phục]
```

### Permanent Delete Dialog
```
Title: Xóa vĩnh viễn liên hệ?
Message: Bạn có chắc chắn muốn xóa vĩnh viễn liên hệ "[Name]"?
         Hành động này không thể hoàn tác và dữ liệu sẽ bị mất hoàn toàn.
Actions: [Hủy] [Xóa vĩnh viễn]
```

---

## Authorization

The system uses **ContactPolicy** to ensure users can only restore/delete their own contacts:

```php
// Only the owner can restore
public function restore(User $user, Contact $contact): bool
{
    return $user->id === $contact->user_id;
}

// Only the owner can force delete
public function forceDelete(User $user, Contact $contact): bool
{
    return $user->id === $contact->user_id;
}
```

---

## Technical Details

### Backend (Laravel)

**Model:** `Contact.php`
- Uses `SoftDeletes` trait
- Adds `deleted_at` column to track deletion

**Controller Methods:**
```php
// Web\ContactController
trash()          // Display trashed contacts (Inertia page)
restore($id)     // Restore a contact
forceDelete($id) // Permanently delete
```

**Database Query Examples:**
```php
// Get only trashed contacts
Contact::onlyTrashed()->get();

// Get all contacts including trashed
Contact::withTrashed()->get();

// Restore
$contact->restore();

// Permanently delete
$contact->forceDelete();
```

### Frontend (React + TypeScript)

**Page:** `resources/js/pages/contacts/trash.tsx`
- Displays trashed contacts in a card grid
- Pagination support
- Restore and permanent delete dialogs
- Empty state when no trashed contacts

**Components used:**
- `AlertDialog` - Confirmation dialogs
- `Card` - Contact cards
- `Avatar` - Contact avatars
- `Badge` - Groups and tags
- `DropdownMenu` - Actions menu

---

## Testing

### Manual Testing Steps

1. **Create a contact** via `/contacts/create`
2. **Delete the contact** from the detail page
3. **Verify it appears** in `/contacts/trash`
4. **Restore the contact** and verify it's back in `/contacts`
5. **Delete it again** and **permanently delete** from trash
6. **Verify it's completely gone** (not in trash or main list)

### Automated Tests (if implemented)

```php
// Feature test example
public function test_user_can_restore_trashed_contact()
{
    $contact = Contact::factory()->create(['user_id' => $this->user->id]);
    $contact->delete();

    $this->post("/contacts/{$contact->id}/restore")
        ->assertRedirect();

    $this->assertDatabaseHas('contacts', [
        'id' => $contact->id,
        'deleted_at' => null,
    ]);
}
```

---

## Future Enhancements (Optional)

- Auto-purge contacts after 30 days in trash
- Bulk restore/delete actions
- Trash counter badge in navigation
- Email notification before auto-purge
- Trash for Groups and Tags

---

## Support

If you encounter issues with the trash/recovery feature:
1. Check authorization (ensure you own the contact)
2. Verify routes are registered in `routes/web.php`
3. Check browser console for JavaScript errors
4. Review server logs for backend errors

For more details, see the main [README.md](../README.md) or [REQUIREMENT_ANALYSIS.md](REQUIREMENT_ANALYSIS.md).
