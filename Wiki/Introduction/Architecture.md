# AP-Email Overview

# AP-Email Overview

## What is AP-Email?

AP-Email is a simple email service that you can use in two ways:

1. **Web Browser** - Use any web browser to access your emails
2. **Android App** - Use an android emulator/download the app to your phone using 

## How It Works

```
┌─────────────────┐    ┌─────────────────┐
│   Web Client    │    │  Android App    │
│   (React.js)    │    │    (Java)       │
└─────────┬───────┘    └─────────┬───────┘
          │                      │
          └──────────┬───────────┘
                     │
            ┌────────▼────────┐
            │   Backend API   │
            │   (Node.js)     │
            └────────┬────────┘
                     │
        ┌────────────▼────────────┐
        │     Data Layer          │
        │  ┌─────────────────┐    │
        │  │    MongoDB      │    │
        │  │                 │    │
        │  └─────────────────┘    │
        │  ┌─────────────────┐    │
        │  │  Local Storage  │    │
        │  │ (Room/Browser)  │    │
        │  └─────────────────┘    │
        └─────────────────────────┘
```

- **Sign up** for an account with your email address
- **Sign in** to access your emails
- **Send and receive** emails like any other email service
- **Organize** emails with labels
- **Access** your emails from both web and mobile

That's it! AP-Email keeps your communication simple and accessible.
