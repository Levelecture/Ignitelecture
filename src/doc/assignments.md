# Assignment API Spec

## Auth

All endpoints require authentication:

- `Authorization: Bearer <token>` — or session cookie

## Fields

- `status` : `todo` | `in_progress` | `done` (default `todo`)
- `priority` : `low` | `medium` | `high` | `urgent` (optional)
- `grade` : number (2 decimal places) — returned as a number, not a string. **Only allowed when `status` = `done`.** Sending `grade` without `status: "done"` → `400`. Changing `status` away from `done` **clears `grade` automatically**.

## Create Assignment

`POST /api/assignments`

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

**201 Created**

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

**400 Bad Request** — `grade` sent without `status: "done"`

```json
{
  "error": "Grade hanya bisa diisi saat status done"
}
```

**404 Not Found** — course does not belong to the user

```json
{
  "error": "Course not found"
}
```

## Get All Assignments

`GET /api/assignments`

Query Parameters (all optional) :

| Param | Value | Notes |
|---|---|---|
| `search` | string | searches `title` (case-insensitive) |
| `status` | `todo` \| `in_progress` \| `done` | filter by status |
| `priority` | `low` \| `medium` \| `high` \| `urgent` | filter by priority |
| `courseId` | string | filter by course |
| `order` | `asc` \| `desc` | sorts by `createdAt`, default `desc` |

Example :

```
GET /api/assignments?search=uts&status=todo&priority=high&order=asc
```

**200 OK**

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

Note: the list is wrapped in `{ "data": [...] }`. Each row omits `userId` but includes `courseName` + `courseCode` (from the join). Single responses (`GET /:id`, `POST`, `PATCH`) still return the full object including `userId`.

## Get Assignment By ID

`GET /api/assignments/:id`

**200 OK** — a single assignment.

**404 Not Found**

```json
{
  "error": "Not found"
}
```

## Update Assignment

`PATCH /api/assignments/:id`

Partial. Send only the fields that changed. Nullable fields (`notes`, `taskUrl`, `priority`, `dueAt`, `reminderAt`, `submittedAt`, `grade`) can be set to `null` to clear them.

Request Body :

```json
{
  "status": "done",
  "submittedAt": "2026-09-19T16:00:00.000Z",
  "grade": 88.5
}
```

**200 OK** — the full assignment after the update.

**400 Bad Request** — `grade` sent while the resulting status is not `done`

```json
{
  "error": "Grade hanya bisa diisi saat status done"
}
```

**404 Not Found** — assignment or course not found

```json
{
  "error": "Course not found"
}
```

## Delete Assignment

`DELETE /api/assignments/:id`

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
