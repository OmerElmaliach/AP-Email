#include <app.h>
#include <cli.h>

void App::run() {
    // Initialize CLI menu and run it.
    CLI* menu = new CLI();
    menu->run();
}

void App::run(int sock) {
    // Initialize CLI menu and run it.
    CLI* menu = new CLI();
    menu->run(sock);
}