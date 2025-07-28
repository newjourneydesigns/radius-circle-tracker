#!/usr/bin/env python3
import http.server
import socketserver
import os
from urllib.parse import urlparse

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Remove leading slash for file system check
        file_path = path.lstrip('/')
        
        # If the path is empty, serve index.html
        if not file_path or file_path == '':
            self.path = '/index.html'
        # If it's a file that exists (has extension and exists), serve it normally
        elif '.' in os.path.basename(file_path) and os.path.isfile(file_path):
            # Let the parent handle it normally
            pass
        # If it's a directory that exists, let parent handle it
        elif os.path.isdir(file_path):
            # Let the parent handle it normally
            pass
        # For all other paths (SPA routes), serve index.html
        else:
            self.path = '/index.html'
        
        return super().do_GET()

if __name__ == "__main__":
    PORT = 8000
    
    with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        httpd.serve_forever()
