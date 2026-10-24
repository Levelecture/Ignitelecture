# Chart API Spec

Separate module for frontend chart data.

## Auth

All endpoints require authentication:

- `Authorization: Bearer <token>` — or session cookie

## Get Assignment Status Chart

`GET /api/charts/status`

Assignment count per status. Always includes all three keys.

**200 OK**

```json
{
  "data": { "todo": 3, "in_progress": 1, "done": 5 }
}
```

## Get Assignment Grades Chart

`GET /api/charts/grades`

Assignments that already have a grade, sorted by `createdAt` asc.

**200 OK**

```json
{
  "data": [
    { "id": "clx9x8v7b6n5m4k3j2h1g0f", "title": "Tugas UTS", "grade": 88.5 }
  ]
}
```

Note: all data is automatically filtered to the logged-in user.
