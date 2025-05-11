#include <app.h>
#include <cli.h>

void App::run(int sock, bloomFilterStorage* p_bloomFilterStorage) {
    // Initialize CLI menu and run it.
    CLI* menu = new CLI(sock, p_bloomFilterStorage);
    menu->run();
}