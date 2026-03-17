# Referral Email Automation System

## Features
- Upload Excel with HR emails
- Bulk email sending
- Worker pool for concurrency
- Structured logging
- SendGrid integration

## Setup

1. Clone repo
2. Create configs/.env
3. Run:
   go mod tidy
   go run ./cmd/server

## API

POST /upload
GET /health