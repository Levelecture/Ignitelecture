# Admin API Spec

Admin-only module for managing the sign-up allowlist.

## Auth

All endpoints require authentication **and** the `admin` role:

- `Authorization: Bearer <token>` — or session cookie

Non-admins receive `403 Forbidden`.

## List Allowed Emails

`GET /api/admin/allowlist`

**200 OK** — sorted by `createdAt` desc.

```json
[
  {
    "id": "clx1234567890",
    "email": "someone@example.com",
    "createdAt": "2026-09-16T16:00:00.000Z"
  }
]
```

## Add Allowed Email

`POST /api/admin/allowlist`

Only emails on this list may sign up with Google. Email is trimmed and lowercased before saving.

Request Body :

```json
{
  "email": "someone@example.com"
}
```

**201 Created**

```json
{
  "id": "clx1234567890",
  "email": "someone@example.com",
  "createdAt": "2026-09-16T16:00:00.000Z"
}
```

**409 Conflict** — email already in the allowlist

```json
{
  "error": "Email already in allowlist"
}
```

## Remove Allowed Email

`DELETE /api/admin/allowlist/:id`

**200 OK**

```json
{
  "id": "clx1234567890",
  "email": "someone@example.com",
  "createdAt": "2026-09-16T16:00:00.000Z"
}
```

**404 Not Found**

```json
{
  "error": "Not found"
}
```

Note: removing an allowlist entry does not log the user out. Ban them instead to revoke access.
