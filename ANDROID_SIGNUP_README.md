# Android Signup Implementation - AP-Email

## Overview
This document describes the Android implementation of the signup flow for AP-Email, designed to closely match the web version's functionality and visual design.

## Implementation Details

### Architecture
- **MVVM Pattern**: Uses ViewModel to manage UI-related data and business logic
- **Fragment-based Navigation**: Each step is a separate fragment for better modularity
- **Repository Layer**: Placeholder for MongoDB integration (to be implemented by backend team)

### Step Flow (Matching Web Implementation)
1. **Name Step** - First and last name collection
2. **Picture Step** - Profile picture upload from device
3. **Birthday Step** - Birthday selection and gender (3 options: male, female, prefer not to say)
4. **Email/Password Step** - Account credentials with validation

### Key Features
- **Multi-step Navigation**: Back/Next buttons with proper state management
- **Data Persistence**: Form data preserved when navigating between steps
- **Image Upload**: Native Android image picker integration
- **Validation**: Real-time input validation matching web requirements
- **Age Verification**: Minimum age 13 requirement (same as web)
- **Material Design**: Modern UI components with custom styling

### Design Consistency
- **Color Scheme**: Matches web colors (#1976D2 primary, #F1F3F4 background)
- **Typography**: Sans-serif fonts with proper hierarchy
- **Layout**: Side-by-side design with logo on left, form on right
- **Input Fields**: Material Design text inputs with proper styling
- **Buttons**: Rounded corners with consistent spacing and colors
- **Form Validation**: Same validation rules as web implementation

### Technical Specifications
- **Minimum SDK**: Android 21 (Lollipop)
- **Dependencies**: Material Components, Lifecycle components, CardView
- **Permissions**: READ_EXTERNAL_STORAGE for image upload
- **Image Handling**: Built-in Android image picker (no external libraries)

### Files Structure
```
android/app/src/main/
├── java/com/example/ap_emailandroid/
│   ├── ui/signup/
│   │   ├── SignUpActivity.java
│   │   ├── SignUpNavigationListener.java
│   │   ├── NameStepFragment.java
│   │   ├── PictureStepFragment.java
│   │   ├── BirthdayStepFragment.java
│   │   └── EmailPasswordStepFragment.java
│   ├── viewmodel/
│   │   └── SignUpViewModel.java
│   ├── model/
│   │   └── SignUpRequest.java
│   └── repository/
│       └── UserRepository.java
├── res/
│   ├── layout/
│   │   ├── activity_signup.xml
│   │   ├── fragment_name_step.xml
│   │   ├── fragment_picture_step.xml
│   │   ├── fragment_birthday_step.xml
│   │   └── fragment_email_password_step.xml
│   ├── values/
│   │   ├── colors.xml
│   │   └── strings.xml
│   └── drawable/
│       ├── ic_email.xml
│       ├── ic_calendar.xml
│       ├── ic_person_placeholder.xml
│       └── rounded_background.xml
└── AndroidManifest.xml
```

### Validation Rules
- **Name**: Both first and last name required, no special characters
- **Picture**: Optional but recommended
- **Birthday**: Must be 13+ years old, valid date format
- **Gender**: Three options (male, female, prefer not to say)
- **Email**: Valid email format, unique (placeholder validation)
- **Password**: Minimum 8 characters, mixed case, numbers, special chars

### Future Enhancements
- Backend integration with actual MongoDB
- Proper error handling for network requests
- Biometric authentication support
- Social login integration
- Enhanced accessibility features

### Testing Notes
All fragments have been tested for:
- Proper navigation flow
- Data persistence across steps
- Input validation
- UI responsiveness
- Material Design compliance

## Alignment with Web Version
The Android implementation maintains functional parity with the React web version while adapting to Android's native design patterns and user experience conventions. All business logic, validation rules, and step sequences are identical.