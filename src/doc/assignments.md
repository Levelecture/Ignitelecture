# Assignment API Spec

Semua endpoint butuh autentikasi:

Request Header :
- Authorization : `Bearer <token>` — atau Cookie session

Field:
- `status` : `todo` | `in_progress` | `done` (default `todo`)
- `priority` : `low` | `medium` | `high` | `urgent` (opsional)
- `grade` : number (0–100, 2 desimal) — dikembalikan sebagai number, bukan string. **Hanya boleh diisi saat `status` = `done`.** Isi `grade` tanpa `status: "done"` → `400`. Mengubah `status` keluar dari `done` **otomatis mengosongkan `grade`**.

## Create Assignment

Endpoint : POST /api/assignments

Request Body :

```json
{
  "courseId": "clx1234567890",
  "title": "Tugas 1",
  "notes": "BAB 1-3",
  "taskUrl": "https://example.com/tugas",
  "priority": "high",
  "dueAt": "2026-09-20T16:00:00.000Z"
}
```

Response Body (Success - 201) :

```json
{
  "id": "clx9x8v7b6n5m4k3j2h1g0f",
  "userId": "usr123456",
  "courseId": "clx1234567890",
  "title": "Tugas 1",
  "notes": "BAB 1-3",
  "taskUrl": "https://example.com/tugas",
  "status": "todo",
  "priority": "high",
  "dueAt": "2026-09-20T16:00:00.000Z",
  "reminderAt": null,
  "submittedAt": null,
  "grade": null,
  "createdAt": "2026-09-16T16:00:00.000Z",
  "updatedAt": "2026-09-16T16:00:00.000Z"
}
```

Response Body (Failed - Course Not Found) :

```json
{
  "error": "Course not found"
}
```

## Get All Assignments

Endpoint : GET /api/assignments

Query Parameters (semua opsional) :

| Param | Nilai | Keterangan |
|---|---|---|
| `search` | string | cari di `title` (case-insensitive) |
| `status` | `todo` \| `in_progress` \| `done` | filter status |
| `priority` | `low` \| `medium` \| `high` \| `urgent` | filter priority |
| `courseId` | string | filter per mata kuliah |
| `order` | `asc` \| `desc` | urut `createdAt`, default `desc` |

Contoh :

```
GET /api/assignments?search=uts&status=todo&priority=high&order=asc
```

Response Body (Success) :

```json
{
  "data": [
    {
      "id": "clx9x8v7b6n5m4k3j2h1g0f",
      "courseId": "clx1234567890",
      "courseName": "Pemrograman Dasar",
      "courseCode": "CS101",
      "title": "Tugas UTS",
      "notes": "BAB 1-3",
      "taskUrl": "https://example.com/tugas",
      "status": "todo",
      "priority": "high",
      "dueAt": "2026-09-20T16:00:00.000Z",
      "reminderAt": null,
      "submittedAt": null,
      "grade": null,
      "createdAt": "2026-09-16T16:00:00.000Z",
      "updatedAt": "2026-09-16T16:00:00.000Z"
    }
  ]
}
```

Catatan: list dibungkus `{ "data": [...] }`. Tiap baris tidak menyertakan `userId`, tapi ada `courseName` + `courseCode` (dari join). Respons tunggal (`GET /:id`, `POST`, `PATCH`) tetap objek penuh termasuk `userId`.

## Get Assignment By ID

Endpoint : GET /api/assignments/:id

Response Body (Success) : satu assignment.

Response Body (Failed - Not Found) :

```json
{
  "error": "Not found"
}
```

## Update Assignment

Endpoint : PATCH /api/assignments/:id

Partial. Kirim hanya field yang berubah. Field nullable (`notes`, `taskUrl`, `priority`, `dueAt`, `reminderAt`, `submittedAt`, `grade`) bisa di-set `null` untuk mengosongkan.

Request Body :

```json
{
  "status": "done",
  "submittedAt": "2026-09-19T16:00:00.000Z",
  "grade": 88.5
}
```

Response Body (Success) : assignment lengkap setelah update.

Response Body (Failed - Course Not Found / Not Found) :

```json
{
  "error": "Course not found"
}
```

## Delete Assignment

Endpoint : DELETE /api/assignments/:id

Response Body (Success) :

```json
{
  "data": true
}
```

Response Body (Failed - Not Found) :

```json
{
  "error": "Not found"
}
```
