# Auth-Gated App Testing Playbook (Emergent Google Auth)

## Step 1: Create Test User & Session (mongosh)
```
mongosh --eval "
use('test_database');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({ user_id: userId, email: 'admin.test@example.com', name: 'Admin Test', picture: '', is_admin: true, created_at: new Date() });
db.user_sessions.insertOne({ user_id: userId, session_token: sessionToken, expires_at: new Date(Date.now()+7*24*60*60*1000), created_at: new Date() });
print('Session token: ' + sessionToken);
"
```

## Step 2: Backend API
```
curl -X GET "$BASE/api/auth/me" -H "Authorization: Bearer <TOKEN>"
curl -X GET "$BASE/api/admin/enquiries" -H "Authorization: Bearer <TOKEN>"
curl -X POST "$BASE/api/admin/projects" -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{"name":"चाचणी पार्क","nameEn":"Test Park","price":"499"}'
```

## Step 3: Browser
Set cookie `session_token` (domain = app host, path=/, httpOnly, secure, sameSite=None) then navigate to /admin.

## Notes
- Admin gating: first user to log in becomes admin (is_admin=true). Others are non-admin and get 403 on /api/admin/*.
- All user queries exclude MongoDB `_id` via {"_id":0}.
- Session token via httpOnly cookie first, then Authorization: Bearer fallback.
