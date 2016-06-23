# Bernard-sBooksVault
###Introduction
This project was for my course at ZJU, principles of database systems. Now uploaded to github.

This is a webapp implemented with node.js for backend and jade template for frontend, which provides a portal for user to query and download programming books with multiple types of keywords, and meanwhile, for administrators, it also provides portals to insert, update or delete books in the database. 

### About the data
All information of programming books are from the website [it-ebooks.info](http://it-ebooks.info), it provides an [api](http://it-ebooks-api.info/). I don't own those books, I simply provide a portal for users to better find books.

### File directories:

* backend

  * **app.js:**the backend code dealing with the routing

  * **SearchEngine.js:** this file contains the code for database queries

  * **package.json:** dependencies of the project

  * **configure.json:** contains the configuration information, like the database address and passwords

* frontend:

  * **views/layout.jade:** a template for pages in the webapp
  * **views/index.jade** index page of the webapp
  * **views/error.jade:** template of error page
  * **views/login.jade:** login page
  * **views/Admin.jade:** administrator portal
  * **views/book_detail.jade:** a page presenting details of a book
  * **views/delete.jade:** book deleting page
  * **views/input_bookinfo.jade:** an input entry of book information
  * **views/insert.jade:** an entry for inserting a new book
  * **views/searchbeforedelete.jade:** search page before deleting a book
  * **views/searchbeforeupdate.jade:** search page before updating a book
  * **views/searchbook.jade:** the page for searching a book
  * **views/searchresult.jade:** a page presenting search result
  * **views/signup.jade:** signing up page
  * **views/update.jade:** updating a book

### How to run:
* prerequisites:
  * node.js
  * npm
* dependencies:

  under the main folder, run
	
		npm install //installing all dependencies
* run the code:

  		node app.js //run the code with node.js
