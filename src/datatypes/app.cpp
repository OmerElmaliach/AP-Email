#include "app.h"
#include "cli.cpp"

void App::run() {
    // Initialize CLI menu and run it.
    CLI* menu = new CLI();
    menu->run();
}