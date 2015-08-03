The code here represents a portion of the functionality that I developed for a previous employer. It is a CRUD app that manages data for use by two karaoke mobile apps, on both iOS and Android.

Because the API with which it operates is not publicly available, I wrote a very simple server that returns static JSON blobs at specific endpoints. Attempting to save or update a record will likely fail in uninteresting ways.

### To install
Please ensure that node, npm and grunt-cli have been installed. Then:

From project root type
    npm install
    
After this completes, enter
    grunt
    
This task will run unit tests against the code, concat and minify the source, and finally start a local server listening on port 8082.

To login, enter any email address and password.