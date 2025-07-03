# Android Signup Implementation

## Overview
This implementation provides a complete multi-step signup process for the AP-Email Android application, following the same flow as the web implementation.

## Architecture
- **MVVM Pattern**: Uses Model-View-ViewModel architecture with LiveData and ViewModels
- **Fragment-based Navigation**: Each signup step is implemented as a separate Fragment
- **Repository Pattern**: Placeholder repository for future MongoDB integration

## Features Implemented

### ✅ Multi-Step Signup Process
1. **Name Step**: Collects first and last name with validation
2. **Picture Step**: Allows users to select profile picture from device gallery
3. **Birthday Step**: Date picker for birthday and gender selection (radio buttons)
4. **Email/Password Step**: Email and password with comprehensive validation

### ✅ Navigation Between Steps
- Back and Next buttons for navigation
- Progress indicator at the top of the screen
- Ability to go back to previous steps
- Data persistence across steps using ViewModel

### ✅ Image Upload from Device
- **External Libraries Used**: None (using built-in Android image picker)
- Uses `Intent.ACTION_PICK` with `MediaStore.Images.Media.EXTERNAL_CONTENT_URI`
- Requests `READ_EXTERNAL_STORAGE` permission for Android 6.0+
- Image preview in circular CardView

### ✅ Validation and User Prompts
- **Name validation**: Minimum 2 characters for first/last name
- **Age validation**: Must be at least 13 years old
- **Email validation**: Uses Android's built-in email pattern matching
- **Password validation**: Identical to web implementation:
  - At least 8 characters
  - Must contain uppercase letter
  - Must contain lowercase letter
  - Must contain at least one number
  - Only letters and numbers allowed (no special characters)
- **Password confirmation**: Must match original password
- Real-time error messages displayed on input fields
- Toast messages for additional feedback

### ✅ Database Integration (Placeholder)
- Repository pattern ready for MongoDB integration
- SignUpRequest model matches web implementation data structure
- Placeholder methods in UserRepository for another team member to implement
- Simulated network call with loading indicator

### ✅ Navigation to Sign In
- Successfully redirects to SignInActivity after completion
- "Sign in instead" button on first step

### ✅ Design Similar to Web
- Material Design components
- Color scheme matches web implementation
- Similar layout structure and flow
- Progress indicators
- Rounded input fields
- Primary color: #1976D2 (blue)

## Files Created

### Java Classes
- `SignUpActivity.java` - Main activity managing the signup flow
- `SignUpNavigationListener.java` - Interface for step navigation
- `NameStepFragment.java` - First step: name collection
- `PictureStepFragment.java` - Second step: picture upload
- `BirthdayStepFragment.java` - Third step: birthday and gender
- `EmailPasswordStepFragment.java` - Fourth step: credentials
- `SignUpViewModel.java` - ViewModel managing signup data and state
- `SignUpRequest.java` - Data model for signup request
- `UserRepository.java` - Placeholder repository for database operations
- `SignInActivity.java` - Placeholder for signin (to be implemented by team)

### Layout Files
- `activity_signup.xml` - Main signup activity layout with progress bar
- `fragment_name_step.xml` - Name input step layout
- `fragment_picture_step.xml` - Picture upload step layout
- `fragment_birthday_step.xml` - Birthday and gender step layout
- `fragment_email_password_step.xml` - Email/password step layout

### Resource Files
- `colors.xml` - Updated with app color scheme
- `AndroidManifest.xml` - Updated with permissions and activities
- `build.gradle.kts` - Updated with necessary dependencies
- `ic_person_placeholder.xml` - Placeholder icon for profile picture
- `rounded_background.xml` - Background drawable for components

## Dependencies Added
```kotlin
implementation("androidx.lifecycle:lifecycle-viewmodel:2.7.0")
implementation("androidx.lifecycle:lifecycle-livedata:2.7.0")
implementation("androidx.fragment:fragment:1.6.2")
implementation("androidx.cardview:cardview:1.0.0")
```

## External Libraries Used
**None** - The implementation uses only built-in Android components:
- Built-in image picker (`Intent.ACTION_PICK`)
- Built-in date picker (`DatePickerDialog`)
- Material Design components (already included in Android)
- Standard Android permissions system

## Notes for Team Integration

### For MongoDB Integration Team Member:
1. Implement actual methods in `UserRepository.java`
2. Replace placeholder network simulation in `SignUpViewModel.submitSignUp()`
3. Add proper error handling for network failures
4. Implement email/username uniqueness checking

### For SignIn Implementation Team Member:
1. Implement actual `SignInActivity` with proper layout and functionality
2. The signup flow automatically navigates to SignInActivity upon completion

## Testing
- All form validations work as expected
- Image selection from gallery works on Android 6.0+
- Data persists when navigating between steps
- Loading states and error messages display correctly
- Navigation flow matches web implementation

## Comments Style
All comments are in lowercase as requested, following the format:
```java
// this is a comment explaining the functionality
```
