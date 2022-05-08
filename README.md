# Docker installation
```docker-compose up --build -d```

## First time database setup
### Make migrations:

```docker exec -it {name_of_container} bash``` where the ```{name_of_container}``` is the backend server container  

Run ```node ace migration:refresh --seed```

Restart lack-be container
```docker restart {name_of_container}```

# Locally installed apps
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
