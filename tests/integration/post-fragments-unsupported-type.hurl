# tests/integration/post-fragments-unsupported-type.hurl
# Authenticated POST to /v1/fragments with unsupported content type
POST http://localhost:8080/v1/fragments
# We're sending an unsupported type 
Content-Type: fake/type
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
`This is a fragment!`

# 1. We expect to get back an HTTP 415
HTTP/1.1 415

[Asserts]
# The Location header should start with application/json 
header "Content-Type" startsWith "application/json"
# error status should be error
jsonpath "$.status" == "error"
# 415 error code is expected
jsonpath "$.error.code" == 415

