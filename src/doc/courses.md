# Course API Spec

## Auth

All endpoints require authentication:

- `Authorization: Bearer <token>` — or session cookie

## Create Course

`POST /api/courses`

Request Body :

```json
{
  "code": "CS101",
  "name": "Pemrograman Dasar",
  "sks": 3,
  "lecturerName": "Dr. Aris",
  "room": "Lab 1",
  "semester": 1,
  "cover": "https://example.com/cover.jpg"
}
```

**201 Created**

```json
{
  "id": "clx1234567890",
  "userId": "usr123456",
  "code": "CS101",
  "name": "Pemrograman Dasar",
  "sks": 3,
  "lecturerName": "Dr. Aris",
  "room": "Lab 1",
  "status": "aktif",
  "cover": "https://example.com/cover.jpg",
  "semester": 1,
  "createdAt": "2026-09-16T16:00:00.000Z",
  "updatedAt": "2026-09-16T16:00:00.000Z"
}
```

**409 Conflict** — duplicate code

```json
{
  "error": "Course code already exists"
}
```

## Get All Courses

`GET /api/courses`

**200 OK**

```json
[
  {
    "id": "clx1234567890",
    "userId": "usr123456",
    "code": "CS101",
    "name": "Pemrograman Dasar",
    "sks": 3,
    "lecturerName": "Dr. Aris",
    "room": "Lab 1",
    "status": "aktif",
    "cover": "https://example.com/cover.jpg",
    "semester": 1,
    "createdAt": "2026-09-16T16:00:00.000Z",
    "updatedAt": "2026-09-16T16:00:00.000Z"
  }
]
```

## Get Course By ID

`GET /api/courses/:id`

**200 OK**

```json
{
  "id": "clx1234567890",
  "userId": "usr123456",
  "code": "CS101",
  "name": "Pemrograman Dasar",
  "sks": 3,
  "lecturerName": "Dr. Aris",
  "room": "Lab 1",
  "status": "aktif",
  "cover": "https://example.com/cover.jpg",
  "semester": 1,
  "createdAt": "2026-09-16T16:00:00.000Z",
  "updatedAt": "2026-09-16T16:00:00.000Z"
}
```

**404 Not Found**

```json
{
  "error": "Not found"
}
```

## Update Course

`PATCH /api/courses/:id`

Request Body :

```json
{
  "name": "Pemrograman Lanjut",
  "sks": 4,
  "status": "selesai"
}
```

**200 OK**

```json
{
  "id": "clx1234567890",
  "userId": "usr123456",
  "code": "CS101",
  "name": "Pemrograman Lanjut",
  "sks": 4,
  "lecturerName": "Dr. Aris",
  "room": "Lab 1",
  "status": "selesai",
  "cover": "https://example.com/cover.jpg",
  "semester": 1,
  "createdAt": "2026-09-16T16:00:00.000Z",
  "updatedAt": "2026-09-16T16:05:00.000Z"
}
```

**404 Not Found**

```json
{
  "error": "Not found"
}
```

## Delete Course

`DELETE /api/courses/:id`

**200 OK**

```json
{
  "data": true
}
```

**404 Not Found**

```json
{
  "error": "Not found"
}
```
