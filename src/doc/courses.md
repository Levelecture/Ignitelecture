# Course API Spec

## Create Course

Endpoint : POST /api/courses

Request Header :
- Authorization : `Bearer <token>` — atau Cookie session

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

Response Body (Success) :

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

Response Body (Failed - Duplicate Code) :

```json
{
  "error": "Course code already exists"
}
```

## Get All Courses

Endpoint : GET /api/courses

Request Header :
- Authorization : `Bearer <token>` — atau Cookie session

Response Body (Success) :

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

Endpoint : GET /api/courses/:id

Request Header :
- Authorization : `Bearer <token>` — atau Cookie session

Response Body (Success) :

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

Response Body (Failed - Not Found) :

```json
{
  "error": "Not found"
}
```

## Update Course

Endpoint : PATCH /api/courses/:id

Request Header :
- Authorization : `Bearer <token>` — atau Cookie session

Request Body :

```json
{
  "name": "Pemrograman Lanjut",
  "sks": 4,
  "status": "selesai"
}
```

Response Body (Success) :

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

Response Body (Failed - Not Found) :

```json
{
  "error": "Not found"
}
```

## Delete Course

Endpoint : DELETE /api/courses/:id

Request Header :
- Authorization : `Bearer <token>` — atau Cookie session

Response Body (Success) :

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

Response Body (Failed - Not Found) :

```json
{
  "error": "Not found"
}
```
