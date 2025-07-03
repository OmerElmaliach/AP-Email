# Android Signup Implementation - AP-Email

## Overview
This document describes the Android implementation of the signup flow for AP-Email, designed to closely match the web version's functionality and visual design with exact specifications.

## Implementation Details

### Architecture
- **MVVM Pattern**: Uses ViewModel to manage UI-related data and business logic
- **Fragment-based Navigation**: Each step is a separate fragment for better modularity
- **Repository Layer**: Placeholder for MongoDB integration (to be implemented by backend team)

### Step Flow (Exact Chain of Events)
1. **Signup Page** - Main activity with side-by-side layout (logo left, form right)
2. **Name Step** - First and last name collection with "Sign In" option
3. **Picture Step** - Profile picture upload from device
4. **Birthday Step** - Gender selection first, then birthday (dd/mm/yyyy format)
5. **Email/Password Step** - Account credentials with @AP-Email suffix

### Step-by-Step Specifications

#### 1. Main Signup Activity
- **Logo**: Uses favicon.png instead of launcher icons
- **Layout**: Side-by-side design with logo on left, form container on right
- **Background**: Matches web color scheme (#F1F3F4)

#### 2. Name Step
- **Header**: "Welcome!" (black) + "Create your AP-Email account" (grey)
- **Inputs**: "First Name" and "Last Name" (camel case hints)
- **Buttons**: 
  - "Sign In" (white rounded pill with gray outline and gray text)
  - "Next" (blue rounded pill with white text)

#### 3. Picture Step
- **Header**: "Welcome!" (black) + "Create your AP-Email account" (grey)
- **Content**: "Upload your picture" text + circular image preview
- **Button**: "Choose Image" (gray box with black font)
- **Navigation**: "Back" and "Next" buttons (identical formatting)

#### 4. Birthday Step
- **Header**: "Welcome!" (black) + "Create your AP-Email account" (grey)
- **Gender First**: Dropdown with "Gender" hint, "Select Gender" prompt
  - Options: "Male", "Female", "Prefer not to say" (sets gender to null)
- **Birthday Second**: Floating form with "Birthday" hint, "dd/mm/yyyy" prompt
- **Calendar Icon**: Black color
- **Navigation**: "Back" and "Next" buttons (identical formatting)

#### 5. Email/Password Step
- **Header**: "Welcome!" (black) + "Create your AP-Email account" (grey)
- **Email Field**: Camel case text with gray "@AP-Email" suffix
- **Password Fields**: Camel case hints, show/hide toggle
- **Create Button**: 
  - Text: "Create Email!"
  - State: Faded when forms empty, normal when properly filled
- **Navigation**: "Back" button (rounded pill format)

### Design Consistency
- **Color Scheme**: Exact web colors (#1976D2 primary, #F1F3F4 background)
- **Typography**: Proper camel case for field labels, consistent font families
- **Buttons**: All navigation buttons in rounded pill format
- **Layout**: Header text consistent across all steps
- **Form Validation**: Real-time validation with button state changes

### Key Features
- **Multi-step Navigation**: Back/Next buttons with proper state management
- **Data Persistence**: Form data preserved when navigating between steps
- **Image Upload**: Native Android image picker integration
- **Validation**: Real-time input validation with visual feedback
- **Age Verification**: Minimum age 13 requirement (same as web)
- **Button States**: Dynamic enable/disable with alpha changes
- **Gender Handling**: Null value support for "Prefer not to say"

### Technical Specifications
- **Minimum SDK**: Android 21 (Lollipop)
- **Logo**: favicon.png from drawable directory
- **Date Format**: dd/mm/yyyy for user display
- **Email Suffix**: @AP-Email displayed in gray
- **Button Positioning**: Bottom right for Next/Create, bottom left for Back
- **Form Validation**: Real-time with alpha transparency effects

### Updated Files Structure
```
android/app/src/main/
├── java/com/example/ap_emailandroid/
│   ├── ui/signup/
│   │   ├── SignUpActivity.java (updated for side-by-side layout)
│   │   ├── NameStepFragment.java (updated)
│   │   ├── PictureStepFragment.java (updated)
│   │   ├── BirthdayStepFragment.java (completely rewritten)
│   │   └── EmailPasswordStepFragment.java (updated)
│   └── ...
├── res/
│   ├── layout/
│   │   ├── activity_signup.xml (side-by-side with favicon)
│   │   ├── fragment_name_step.xml (Welcome header + camel case)
│   │   ├── fragment_picture_step.xml (Welcome header + upload text)
│   │   ├── fragment_birthday_step.xml (gender first, birthday second)
│   │   └── fragment_email_password_step.xml (@AP-Email suffix)
│   ├── drawable/
│   │   └── favicon.png (copied from web project)
│   └── ...
```

### Validation Rules
- **Name**: Both first and last name required (camel case display)
- **Picture**: Optional but recommended
- **Gender**: Three options, "Prefer not to say" = null value
- **Birthday**: dd/mm/yyyy format, 13+ years old validation
- **Email**: Valid format with @AP-Email suffix display
- **Password**: Complex validation with real-time button state updates

### Button Specifications
- **All Navigation Buttons**: Rounded pill shape (20dp corner radius)
- **Next/Create Buttons**: Blue background, white text
- **Back Buttons**: Identical formatting to Next buttons
- **Sign In Button**: White background, gray outline, gray text
- **Create Email Button**: Fades when invalid, normal when valid
- **Button Positioning**: Maintained in bottom left/right as specified

### Recent Updates (Latest Implementation)
1. **Favicon Integration**: Replaced launcher icons with favicon.png
2. **Exact Header Text**: All steps now show "Welcome!" + subtitle
3. **Camel Case Fields**: All form hints in proper camel case
4. **Gender Order**: Gender dropdown appears before birthday field
5. **Date Format**: Changed to dd/mm/yyyy display format
6. **Email Suffix**: Added gray "@AP-Email" to email field
7. **Button States**: Implemented fading for Create Email button
8. **Null Gender Support**: "Prefer not to say" properly sets null value

This implementation now exactly matches the specified requirements with proper button positioning, text formatting, and form behavior.
