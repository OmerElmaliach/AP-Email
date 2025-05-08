import socket
import sys


def main():
    # TCP Over IPv4.
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # Confirm number of arguments amounted to 2 -> IP and Port.
    if len(sys.argv) == 3:
        dest_ip = sys.argv[1]
        dest_port = int(sys.argv[2])
        try:
            s.connect((dest_ip, dest_port))
            msg = input("")
            # No exit condition defined.
            while True:
                try:
                    s.send(bytes(msg, 'utf-8'))
                    data = s.recv(4096)
                    print(data.decode('utf-8'))
                    msg = input("")
                except:
                    break

            s.close()
        # Couldn't make a connection with the server.
        except:
            pass


if __name__ == "__main__":
    main()