# 💬 Lack - IRC like chat app
Slack clone full stack app

## Description
### Used technologies:
- Back-end: AdonisJS, PostgreSQL
- Front-end: Vue.js - Quasar - SPA
- Socket.io modification for websocket instant message sending

## Docker installation
```docker-compose up --build -d```

### First time database setup
### Make migrations:

```docker exec -it {name_of_container} bash``` where the ```{name_of_container}``` is the backend server container  

Run ```node ace migration:refresh --seed```

Restart lack-be container
```docker restart {name_of_container}```

## Locally installed apps
lack-backend
- ```npm install```
- setup .env
- ```node ace migration:refresh --seed```
- ```npm run dev```

lack-frontend
- ```npm install```
- ```npm run dev```

----
seeded users:
- login: tester@test.sk
- login: test@test.sk
- login: xprvy@tester.sk
- login: xdruhy@tester.sk

passwords are: 123456

### Features:
- Register/Login
- Actions can be performed with commands or through the UI
- Channels
  - Create channel \[public, private]
  - Join channel - `/join channelName [private]`
  - Leave channel - `/cancel`
  - Delete channel - `/quit`
  - Show users - `/list`
  - Invite users to channel - `/invite nickName`
  - Kick users from channel - `/kick nickName` or `/revoke nickName`
  - Ban users if admin of a channel or if 3 users kick someone
- Messages
  - Send instantly to channel
  - View in real time who is typing and read currently typed message
  - Address message to user by including @nickname
  - Infinite scrolling in channel
- OS based notifications
- Channel is deleted after 30 days of inactivity
- Status
  - Online, DND, offline
  - Status is shown to other users
  - DND mutes notifications
  - Offline leaves sockets and after going online loads up new messages


<p align="center"><a href="https://quasar.dev" target="_blank"><img src="https://cdn.quasar.dev/logo-v2/svg/logo-vertical.svg" width="400"></a></p>

<p align="center"><a href="https://adonisjs.com" target="_blank"><img src="https://camo.githubusercontent.com/8a6e492d3ced504699ba3a46b1eb480379efa99d2df69d8105a0d060af57d9ac/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f61646f6e69736a732f696d6167652f75706c6f61642f715f3130302f76313535383631323836392f61646f6e69732d726561646d655f7a73637963752e6a7067" width="400"></a></p>
