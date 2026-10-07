# Living in Owerri

A Nigerian virtual-life multiplayer game prototype inspired by life-simulation games.

## Included
- Owerri-themed game interface and city map
- Player wallet using **virtual OWR currency only**
- Work and money-collection actions
- Home and car state
- Multiplayer Socket.IO chat room
- Online presence counter
- Express backend
- Health endpoint at `/health`

## Run locally
```bash
npm install
npm start
```
Then open `http://localhost:3000`.

## Hosting
This repository is structured as a single Node/Express web service so it can be deployed to a Node hosting provider such as Render.

Recommended production architecture for 300+ concurrent users:
- PostgreSQL for durable player/economy data
- Redis + Socket.IO Redis adapter for multi-instance realtime state
- 2+ Node instances behind a load balancer
- Authentication, rate limits, moderation, audit logs and anti-abuse controls
- Monitoring, backups and automated deployment

## Important
OWR is fictional in-game currency. It is not real money, is not redeemable for cash, and should never be used for real-world payments.
