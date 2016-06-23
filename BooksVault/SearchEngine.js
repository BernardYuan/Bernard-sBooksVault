/**
 * Created by Bernard on 2015/4/23.
 */
//search by keyword
function SearchByKeyWords(database,word,func) {
    var pword=word.split(' ').join('%').concat('%');
    var ppword='%'.concat(pword);
    database.query('SELECT books_basic.ID,Title,Subtitle,Image FROM books_basic INNER JOIN books_detail ON books_basic.ID=books_detail.ID WHERE Title LIKE "'+ppword+'" OR Subtitle LIKE "'+ppword+'" OR Description LIKE "'+ppword+'" ORDER BY Year+0 DESC;',func);
}
//search by title
function SearchByTitle(database,word,func) {
    var pword=word.split(' ').join('%').concat('%');
    var ppword='%'.concat(pword);
    database.query('SELECT books_basic.ID,Title,Subtitle,Image FROM books_basic INNER JOIN books_detail ON books_basic.ID=books_detail.ID WHERE Title Like "'+ppword+'" ORDER BY Year+0 DESC;', func);
}
//search by title precisely
function SearchByTitlePre(database,word,func) {
    database.query('SELECT books_basic.ID,Title,Subtitle,Image FROM books_basic WHERE Title = "'+word+'";', func);
}
//search by author
function SearchByAuthor(database,word,func) {
    var pword=word.split(' ').join('%').concat('%');
    var ppword='%'.concat(pword);
    database.query('SELECT books_basic.ID,Title,Subtitle,Image FROM books_basic INNER JOIN books_detail ON books_basic.ID=books_detail.ID WHERE Author LIKE "'+ppword+'" ORDER BY Year+0 DESC;',func);
}
//search by author precisely
function SearchByAuthorPre(database,word,func) {
    database.query('SELECT books_basic.ID,Title,Subtitle,Image FROM books_basic WHERE Author = "'+word+'";',func);
}
//search by publisher
function SearchByPublisher(database,word,func) {
    var pword=word.split(' ').join('%').concat('%');
    var ppword='%'.concat(pword);
    database.query('SELECT books_basic.ID,Title,Subtitle,Image FROM books_basic INNER JOIN books_detail ON books_basic.ID=books_detail.ID WHERE Publisher LIKE "'+ppword+'" ORDER BY Year+0 DESC;',func);
}
//search by publisher precisely
function SearchByPublisherPre(database,word,func) {
    database.query('SELECT books_basic.ID,Title,Subtitle,Image FROM books_basic WHERE ID IN (SELECT ID FROM books_detail WHERE Publisher = "'+word+'");',func);
}
//search by ISBN 
function SearchByISBN(database,word,func) {
    database.query('SELECT books_basic.ID,Title,Subtitle,Image FROM books_basic INNER JOIN books_detail ON books_basic.ID=books_detail.ID WHERE ISBN = "'+word+'"ORDER BY Year+0 DESC;',func);
}
//search by id of book
function SearchByID(database,word,func) {
    database.query('SELECT books_basic.ID,Title,Subtitle,Image FROM books_basic WHERE ID = "'+word+'";',func);
}
var Search={};
Search["Keywords"]=SearchByKeyWords;
Search["Title"]=SearchByTitle;
Search["TitlePre"]=SearchByTitlePre;
Search["Author"]=SearchByAuthor;
Search["AuthorPre"]=SearchByAuthorPre;
Search["Publisher"]=SearchByPublisher;
Search["PublisherPre"]=SearchByPublisherPre;
Search["ISBN"]=SearchByISBN;
Search["ID"]=SearchByID;
module.exports.Search=Search;

// the following search results are ordered
function OrderSearchByKeyWords(database,word,orderkey,func) {
    var pword=word.split(' ').join('%').concat('%');
    var ppword='%'.concat(pword);
    database.query('SELECT books_basic.ID,Title,Subtitle,Image FROM books_basic INNER JOIN books_detail ON books_basic.ID=books_detail.ID WHERE Title LIKE "'+ppword+'" OR Subtitle LIKE "'+ppword+'" OR Description LIKE "'+ppword+'" ORDER BY '+orderkey+ ';',func);
}
function OrderSearchByTitle(database,word,orderkey,func) {
    var pword=word.split(' ').join('%').concat('%');
    var ppword='%'.concat(pword);
    database.query('SELECT books_basic.ID,Title,Subtitle,Image FROM books_basic INNER JOIN books_detail ON books_basic.ID=books_detail.ID WHERE Title Like "'+ppword+'" ORDER BY '+orderkey+';', func);
}
function OrderSearchByTitlePre(database,word,orderkey,func) {
    database.query('SELECT books_basic.ID,Title,Subtitle,Image FROM books_basic WHERE Title = "'+word+'";', func);
}
function OrderSearchByAuthor(database,word,orderkey,func) {
    var pword=word.split(' ').join('%').concat('%');
    var ppword='%'.concat(pword);
    database.query('SELECT books_basic.ID,Title,Subtitle,Image FROM books_basic INNER JOIN books_detail ON books_basic.ID=books_detail.ID WHERE Author LIKE "'+ppword+'" ORDER BY '+orderkey+';',func);
}
function OrderSearchByAuthorPre(database,word,orderkey,func) {
    database.query('SELECT books_basic.ID,Title,Subtitle,Image FROM books_basic WHERE Author = "'+word+'";',func);
}
function OrderSearchByPublisher(database,word,orderkey,func) {
    var pword=word.split(' ').join('%').concat('%');
    var ppword='%'.concat(pword);
    database.query('SELECT books_basic.ID,Title,Subtitle,Image FROM books_basic INNER JOIN books_detail ON books_basic.ID=books_detail.ID WHERE Publisher LIKE "'+ppword+'" ORDER BY '+orderkey+';',func);
}
function OrderSearchByPublisherPre(database,word,orderkey,func) {
    database.query('SELECT books_basic.ID,Title,Subtitle,Image FROM books_basic WHERE ID IN (SELECT ID FROM books_detail WHERE Publisher = "'+word+'");',func);
}

function OrderSearchByISBN(database,word,orderkey,func) {
    database.query('SELECT books_basic.ID,Title,Subtitle,Image FROM books_basic INNER JOIN books_detail ON books_basic.ID=books_detail.ID WHERE ISBN = "'+word+'"ORDER BY '+orderkey+';',func);
}
function OrderSearchByID(database,word,orderkey,func) {
    database.query('SELECT books_basic.ID,Title,Subtitle,Image FROM books_basic WHERE ID = "'+word+'";',func);
}
var OrderSearch={};
OrderSearch["Keywords"]=OrderSearchByKeyWords;
OrderSearch["Title"]=OrderSearchByTitle;
OrderSearch["TitlePre"]=OrderSearchByTitlePre;
OrderSearch["Author"]=OrderSearchByAuthor;
OrderSearch["AuthorPre"]=OrderSearchByAuthorPre;
OrderSearch["Publisher"]=OrderSearchByPublisher;
OrderSearch["PublisherPre"]=OrderSearchByPublisherPre;
OrderSearch["ISBN"]=OrderSearchByISBN;
OrderSearch["ID"]=OrderSearchByID;
module.exports.OrderSearch=OrderSearch;
