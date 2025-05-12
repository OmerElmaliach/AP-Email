#include <cli.h>


bool CLI::checkRegex(string input) {
    static regex urlRegex("^\\S+\\s+((https?:\\/\\/)?(www\\.)?([a-zA-Z0-9-]+\\.)+[a-zA-Z0-9]{2,})(\\/\\S*)?\\s*$");
    return regex_match(input, urlRegex);
}

vector<string> CLI::split(string str) {
    vector<string> vec;
    stringstream ss(str);
    string substring;
    while (ss >> substring) {
        vec.push_back(substring);
    }

    return vec;
}



void CLI::registerCommand(string& input, Icommand* command) {
    if (m_cmdMap.find(input) == m_cmdMap.end()) {
        // Command number was not found in map, can insert.
        m_cmdMap.insert({input, command});
    }
}


void CLI::executeCommand(string& input, string& str) {
    string output;
    const char* buffer;
    if (m_cmdMap.find(input) != m_cmdMap.end()) {
        // Command number was found in map, can perform command.
        output = m_cmdMap[input]->executeCommand(str);
        buffer = output.c_str();
        int sent_bytes = send(m_sock, buffer, strlen(buffer), 0);
        // Socket is not valid anymore, exiting...
        if (sent_bytes <= 0) {
            CLI::exit();
        }
    }
}


bool CLI::isRunning() {
    return m_menuState;
}


void CLI::exit() {
    m_menuState = false;
}


CLI::CLI(int sock, bloomFilterStorage* p_bloomFilterStorage)
    : m_sock(sock),
      m_stringHasher(1),
      m_bloomFilter(m_stringHasher)
{
    bloomFilterStorage& stor_ref = *p_bloomFilterStorage;

    // Initialize the commands with the associated numbers to perform them.
    Icommand* cmd_post = new AddURLCommand(stor_ref, m_bloomFilter);  // POST Command
    string post_str = "POST";
    registerCommand(post_str, cmd_post);

    Icommand* cmd_del = new DeleteURLCommand(stor_ref, m_bloomFilter);  // DELETE Command
    string del_str = "DELETE";
    registerCommand(del_str, cmd_del);

    Icommand* cmd_get = new CheckURLCommand(stor_ref, m_bloomFilter); // GET Command

    string get_str = "GET";
    registerCommand(get_str, cmd_get);

    m_menuState = false; // Set the initial menu state to false, not yet running.
}


void CLI::run() {
    // Menu state is permenantly true since no exit protocol defined.
    m_menuState = true;
    bool sock_valid = true, valid_input_recv = false;
    const char* bad_req_msg = "400 Bad Request\n";

    while (isRunning()) {
        char buffer[4096];
        memset(buffer, 0,  MSG_SIZE);
        do {
            // Loop until input is in the proper format for performing commands.
            int read_bytes = recv(m_sock, buffer, MSG_SIZE, 0);
            // Socket is not valid anymore, exiting...
            if (read_bytes <= 0) {
                sock_valid = false;
                CLI::exit();
                break;
            }
            
            // Check if input is in the right format.
            if (!checkRegex(string(buffer))) {
                int sent_bytes = send(m_sock, bad_req_msg, strlen(bad_req_msg), 0);
                // Socket is not valid anymore, exiting...
                if (sent_bytes <= 0) {
                    sock_valid = false;
                    CLI::exit();
                    break;
                }
                memset(buffer, 0, MSG_SIZE);    
            
            } else {
                valid_input_recv = true;
            }
          
        } while(!valid_input_recv);

        printf("exited while\n");

        if (sock_valid) {

            vector<string> str_vec = split(string(buffer));
        
            printf("after split\n");
            
            cout << "1:"<< str_vec[0]<<endl;
            cout<< "2:"<< str_vec[1]<<endl;
            // Execute the command associated with num in map.
            executeCommand(str_vec[0], str_vec[1]);
        }
    }
}