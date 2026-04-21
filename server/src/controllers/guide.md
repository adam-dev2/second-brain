## Section Endpoints

```
POST   /api/sections
```
**Body:** `{ name: string, description?: string }`

---

```
GET    /api/sections
```
No body — pulls all sections for the logged-in user

---

```
PATCH  /api/sections/:id
```
**Body:** `{ name?: string, description?: string }`

---

```
DELETE /api/sections/:id
```
No body — cards in this section get `sectionId` set back to `null` automatically

---

## Bookmark Move Endpoints

```
PATCH  /api/bookmarks/:id/move
```
**Body:** `{ sectionId: string | null }`
For single card move (the × button back to default pool)

---

```
PATCH  /api/bookmarks/bulk-move
```
**Body:**
```json
{
  "moves": [
    { "bookmarkId": "string", "sectionId": "string | null" }
  ]
}
```
For the Save button in the dialog

---

```
GET    /api/bookmarks?sectionId=<id>
GET    /api/bookmarks?sectionId=default
```
Fetching cards per section. `default` = query where `sectionId` is `null`. Your existing GET bookmarks endpoint probably just needs this one extra query param added.