package com.example.ap_emailandroid.ui.signup;

/**
 * interface for handling navigation between signup steps
 */
public interface SignUpNavigationListener {
    void onNextStep();
    void onPreviousStep();
    void onSignUpComplete();
    void onGoToSignIn();
}
