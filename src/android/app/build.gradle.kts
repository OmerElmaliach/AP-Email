plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "com.example.ap_emailandroid"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.ap_emailandroid"
        minSdk = 25
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    lint {
        abortOnError = false
        warningsAsErrors = false
        checkReleaseBuilds = false
    }
}

dependencies {
    implementation(libs.appcompat)
    implementation(libs.material)
    implementation(libs.activity)
    implementation(libs.constraintlayout)
    
    // viewmodel and livedata for mvvm architecture
    implementation("androidx.lifecycle:lifecycle-viewmodel:2.7.0")
    implementation("androidx.lifecycle:lifecycle-livedata:2.7.0")
    
    // fragment support
    implementation("androidx.fragment:fragment:1.6.2")
    
    // cardview for ui components
    implementation("androidx.cardview:cardview:1.0.0")
    
    // for image handling (no external libraries needed, using built-in android)
    implementation(libs.room.runtime)
    implementation(libs.room.common.jvm)
    annotationProcessor(libs.room.compiler)
    implementation(libs.retrofit)
    implementation(libs.gson.converter)
    implementation("com.squareup.okhttp3:okhttp:4.11.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.11.0")
    implementation("com.squareup.picasso:picasso:2.71828")

    testImplementation(libs.junit)
    androidTestImplementation(libs.ext.junit)
    androidTestImplementation(libs.espresso.core)
}
