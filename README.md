# next-js-sqlite

Website made with Next JS with SQLite for a school project.  
repo: https://github.com/FlafyDev/next-js-sqlite

## Running

### Prerequisites

- [Node.js](https://nodejs.org)

### Building

- Create a file named `.env.local` in the project's directory with the content:

```
COOKIE_SECRET=replace_this_with_32_random_characters
```

- Open a terminal on the project's directory and enter the following commands:

```
npm install
npm run build
npm run reset-database
```

### Starting

- Open a terminal on the project's directory and enter the following command:

```
npm run start
```

or for debugging:

```
npm run dev
```

### Default users

```
npm run reset-database
```

Generates 2 users by default:

```
[
  {
    Username: "User",
    Password: "UserUser",
  },
  {
    Username: "Admin",
    Password: "AdminAdmin",
  },
]
```

### License

MIT
