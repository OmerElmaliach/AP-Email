import socket
import sys
import re

def isValid(argv):
    """
    Checks whether a set of arguments is in valid regex.

    Args:
        argv - Command arguments.

    Returns:
        True if is in format, otherwise False.
    """
    ip_reg = '^((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)$'
    port_reg = '^([0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$'
    if re.search(ip_reg, argv[0]) and re.search(port_reg, argv[1]):
        return True
    return False


def main():
    # TCP Over IPv4.
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # Confirm number of arguments amounted to 2 -> IP and Port.
    if len(sys.argv) == 3:
        if isValid(sys.argv[1:]):
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