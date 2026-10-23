# Chart API Spec

Modul terpisah untuk data chart di frontend. Semua endpoint butuh autentikasi:

Request Header :
- Authorization : `Bearer <token>` — atau Cookie session

## Get Assignment Status Chart

Endpoint : GET /api/charts/status

Jumlah assignment per status. Selalu memuat ketiga key.

Response Body (Success) :

```json
{
  "data": { "todo": 3, "in_progress": 1, "done": 5 }
}
```

## Get Assignment Grades Chart

Endpoint : GET /api/charts/grades

Assignment yang sudah punya nilai, urut `createdAt` asc.

Response Body (Success) :

```json
{
  "data": [
    { "id": "clx9x8v7b6n5m4k3j2h1g0f", "title": "Tugas UTS", "grade": 88.5 }
  ]
}
```

Catatan: semua data otomatis difilter ke milik user yang login.
