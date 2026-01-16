# Custom Integration Setup Guide

This guide walks you through creating a custom integration to connect any REST API or data source to Whiteout AI, enabling governance and compliance monitoring for proprietary or unsupported systems.

## Overview

The Custom Integration feature allows you to:
- Connect any REST API-based data source
- Index content from proprietary internal systems
- Build connectors for unsupported third-party tools
- Create specialized integrations for unique workflows

## Prerequisites

Before you begin, ensure you have:
- **Whiteout AI Admin** privileges
- **Technical knowledge** of the target system's API
- **API credentials** for the target system
- Understanding of REST APIs and JSON

---

## Setup Process

### Step 1: Gather Target System Information

Before configuring, collect the following:

| Information | Description | Example |
|-------------|-------------|---------|
| **Base URL** | API endpoint base URL | `https://api.example.com/v1` |
| **Authentication type** | How the API authenticates | API Key, OAuth 2.0, Basic Auth |
| **Endpoints** | Specific API endpoints to query | `/documents`, `/users` |
| **Response format** | API response structure | JSON, XML |
| **Rate limits** | API rate limiting rules | 100 requests/minute |

### Step 2: Create Custom Integration in Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **Data Integrations**
3. Find **Custom Integration** and click **Connect**
4. Click **Create New Custom Integration**

### Step 3: Configure Basic Settings

| Field | Description | Example |
|-------|-------------|---------|
| **Integration Name** | Display name | `Internal Wiki` |
| **Description** | Purpose description | `Connect to company wiki system` |
| **Base URL** | API base endpoint | `https://wiki.company.com/api` |
| **Icon** | Optional custom icon | Upload PNG/SVG |

### Step 4: Configure Authentication

Choose and configure the authentication method:

#### Option A: API Key Authentication

| Field | Value |
|-------|-------|
| **Authentication Type** | API Key |
| **Key Name** | Header name (e.g., `X-API-Key`) |
| **Key Value** | Your API key |
| **Key Location** | Header / Query Parameter |

#### Option B: OAuth 2.0 (Client Credentials)

| Field | Value |
|-------|-------|
| **Authentication Type** | OAuth 2.0 |
| **Grant Type** | Client Credentials |
| **Token URL** | `https://api.example.com/oauth/token` |
| **Client ID** | Your client ID |
| **Client Secret** | Your client secret |
| **Scopes** | Required scopes (space-separated) |

#### Option C: OAuth 2.0 (Authorization Code)

| Field | Value |
|-------|-------|
| **Authentication Type** | OAuth 2.0 |
| **Grant Type** | Authorization Code |
| **Authorization URL** | `https://api.example.com/oauth/authorize` |
| **Token URL** | `https://api.example.com/oauth/token` |
| **Redirect URI** | `https://your-whiteout-instance.com/api/integrations/custom/callback` |
| **Client ID** | Your client ID |
| **Client Secret** | Your client secret |

#### Option D: Basic Authentication

| Field | Value |
|-------|-------|
| **Authentication Type** | Basic Auth |
| **Username** | Service account username |
| **Password** | Service account password |

#### Option E: Bearer Token

| Field | Value |
|-------|-------|
| **Authentication Type** | Bearer Token |
| **Token** | Your bearer token |

---

## Endpoint Configuration

### Define Data Endpoints

Configure the API endpoints Whiteout AI will query:

```json
{
  "endpoints": [
    {
      "name": "documents",
      "path": "/documents",
      "method": "GET",
      "description": "Fetch all documents",
      "pagination": {
        "type": "offset",
        "pageParam": "offset",
        "limitParam": "limit",
        "defaultLimit": 100
      }
    },
    {
      "name": "document_detail",
      "path": "/documents/{id}",
      "method": "GET",
      "description": "Fetch document details"
    }
  ]
}
```

### Pagination Types

Configure how to handle paginated responses:

| Type | Parameters | Example |
|------|------------|---------|
| **Offset** | `offset`, `limit` | `?offset=100&limit=50` |
| **Page** | `page`, `per_page` | `?page=2&per_page=50` |
| **Cursor** | `cursor`, `next` field in response | `?cursor=abc123` |
| **Link Header** | Parse `Link` header | RFC 5988 format |

### Request Configuration

Add custom headers or parameters:

```json
{
  "headers": {
    "Accept": "application/json",
    "X-Custom-Header": "value"
  },
  "queryParams": {
    "include": "content,metadata"
  }
}
```

---

## Response Mapping

Map API responses to Whiteout AI's data model:

### Field Mapping Configuration

```json
{
  "mapping": {
    "id": "$.document_id",
    "title": "$.name",
    "content": "$.body.text",
    "author": "$.created_by.email",
    "created_at": "$.timestamps.created",
    "updated_at": "$.timestamps.modified",
    "url": "$.web_link",
    "metadata": {
      "department": "$.attributes.department",
      "classification": "$.attributes.security_level"
    }
  }
}
```

### JSONPath Expressions

Use JSONPath to extract data:

| Expression | Description | Example |
|------------|-------------|---------|
| `$.field` | Direct field access | `$.title` |
| `$.nested.field` | Nested field | `$.author.name` |
| `$.array[0]` | Array index | `$.tags[0]` |
| `$.array[*].field` | All items in array | `$.comments[*].text` |
| `$..field` | Recursive search | `$..id` |

### Content Extraction

Configure how to extract indexable content:

```json
{
  "contentExtraction": {
    "fields": ["title", "body", "comments"],
    "combineWith": "\n\n",
    "stripHtml": true,
    "maxLength": 100000
  }
}
```

---

## Advanced Configuration

### Incremental Sync

Configure change detection:

```json
{
  "incremental": {
    "enabled": true,
    "method": "modified_since",
    "parameter": "modified_after",
    "dateFormat": "ISO8601"
  }
}
```

### Webhook Support

If the source system supports webhooks:

```json
{
  "webhooks": {
    "enabled": true,
    "endpoint": "/api/integrations/custom/{integration_id}/webhook",
    "events": ["created", "updated", "deleted"],
    "signatureHeader": "X-Webhook-Signature",
    "signatureAlgorithm": "HMAC-SHA256"
  }
}
```

### Rate Limiting

Configure rate limit handling:

```json
{
  "rateLimiting": {
    "requestsPerMinute": 60,
    "retryAfterHeader": "Retry-After",
    "backoffStrategy": "exponential",
    "maxRetries": 3
  }
}
```

### Error Handling

Configure error handling behavior:

```json
{
  "errorHandling": {
    "retryStatusCodes": [429, 500, 502, 503],
    "maxRetries": 3,
    "retryDelay": 1000,
    "failureAction": "skip_and_log"
  }
}
```

---

## Testing Your Integration

### Step 1: Connection Test

1. Click **Test Connection**
2. Verify authentication succeeds
3. Check base URL is reachable

### Step 2: Endpoint Testing

For each endpoint:

1. Click **Test Endpoint**
2. Review the response preview
3. Verify field mapping extracts expected data

### Step 3: Sample Sync

1. Run a sample sync (limited to 10 items)
2. Review indexed content
3. Verify data appears correctly in Whiteout AI

---

## Example Configurations

### Internal Wiki System

```json
{
  "name": "Internal Wiki",
  "baseUrl": "https://wiki.internal.company.com/api/v2",
  "auth": {
    "type": "api_key",
    "keyName": "Authorization",
    "keyPrefix": "Bearer ",
    "keyLocation": "header"
  },
  "endpoints": [
    {
      "name": "pages",
      "path": "/pages",
      "method": "GET",
      "pagination": {
        "type": "cursor",
        "cursorField": "next_cursor"
      }
    }
  ],
  "mapping": {
    "id": "$.id",
    "title": "$.title",
    "content": "$.content.body",
    "url": "$.url",
    "author": "$.created_by.display_name",
    "updated_at": "$.updated_at"
  }
}
```

### CRM System

```json
{
  "name": "Sales CRM",
  "baseUrl": "https://api.salescrm.com/v1",
  "auth": {
    "type": "oauth2",
    "grantType": "client_credentials",
    "tokenUrl": "https://api.salescrm.com/oauth/token",
    "clientId": "your-client-id",
    "clientSecret": "your-client-secret",
    "scope": "read:contacts read:deals"
  },
  "endpoints": [
    {
      "name": "deals",
      "path": "/deals",
      "method": "GET",
      "pagination": {
        "type": "page",
        "pageParam": "page",
        "perPageParam": "per_page"
      }
    }
  ],
  "mapping": {
    "id": "$.deal_id",
    "title": "$.name",
    "content": "$.description",
    "metadata": {
      "value": "$.amount",
      "stage": "$.pipeline_stage",
      "owner": "$.owner.email"
    }
  }
}
```

### Document Management System

```json
{
  "name": "Document Archive",
  "baseUrl": "https://docs.company.com/api",
  "auth": {
    "type": "basic",
    "username": "service-account",
    "password": "secure-password"
  },
  "endpoints": [
    {
      "name": "documents",
      "path": "/documents/search",
      "method": "POST",
      "body": {
        "query": "*",
        "fields": ["id", "title", "content", "metadata"]
      }
    }
  ],
  "mapping": {
    "id": "$.doc_id",
    "title": "$.title",
    "content": "$.full_text",
    "url": "$.view_url"
  }
}
```

---

## Sync Settings

| Setting | Recommended Value | Description |
|---------|-------------------|-------------|
| **Full sync interval** | 24 hours | Complete re-fetch |
| **Incremental sync** | 1 hour | Fetch changes only |
| **Batch size** | 100 | Items per request |
| **Concurrent requests** | 2 | Parallel API calls |

---

## Troubleshooting

### "Authentication failed" Error

- Verify credentials are correct
- Check token hasn't expired
- Ensure OAuth scopes are sufficient
- Verify API key format and location

### "Invalid response" Error

- Check base URL is correct
- Verify endpoint path
- Test API directly with curl/Postman
- Check response format matches expected

### Mapping Errors

- Verify JSONPath expressions
- Check for null/missing fields
- Test with sample API responses
- Use optional operators (`$.field?`)

### Rate Limiting

- Reduce concurrent requests
- Increase sync interval
- Implement request queuing
- Check API documentation for limits

### Timeout Errors

- Increase request timeout setting
- Reduce batch size
- Check target system performance
- Verify network connectivity

---

## Security Considerations

- **Credential Storage**: All credentials are encrypted at rest
- **Network Security**: Use HTTPS for all API calls
- **Secret Rotation**: Rotate API keys/tokens regularly
- **Minimal Access**: Request only necessary permissions
- **Audit Logging**: All API calls are logged for audit

---

## Revoking Access

To remove a custom integration:

1. **In Whiteout AI:**
   - **Settings** > **Data Integrations** > **[Integration Name]** > **Delete**

2. **In Target System:**
   - Revoke API keys or OAuth tokens
   - Remove webhook registrations
   - Delete service accounts if applicable

3. **Clean up:**
   - Clear indexed data if required
   - Remove stored credentials
   - Document removal for compliance
