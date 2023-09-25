const { create } = require("domain")
const fileSystem = require("fs")     //used in file (read/write)
const http = require('http')         //used in server part
const url = require('url')           //used in routing part

const slugify = require('slugify')  

//out whole replaceTemp function taken to the module folder inside tempReplace.js file so we imporiting it here
const replaceTemp = require('./module/tempReplace')


//^^^^^^^^^^^^^^^^^^^^^^ FILES ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// 1
// const message = "Hellooooo Worlddddd"
// console.log(message)


// 2 Read / Write

// A Synchronous code (it will use input and output.txt file only)
// Reading from file
// const readText = fileSystem.readFileSync('./txt/input.txt', 'utf-8')
// console.log(readText)

//Creating output.txt and writing content in it
// const writeText = ` Information about Avacado : ${readText}`
// fileSystem.writeFileSync('./txt/output.txt', writeText)


//B Ansynchronous code (it will use start,read-this,append and final.txt files)

//Now the whole code for read/write
//1 read from start.txt (it will return 'read-this')
//2 now start.txt ne 'read-this' ye return kia so isko hum as a file path use krlenge inside wale k liye using backtic(it will return the content inside 'read-this.txt' file)
//3 now abb append.txt file ka content read krenge in data3

// fileSystem.readFile('./txt/start.txt', 'utf-8', (err,data1)=>{
//     if(err){
//         return console.log("Errorr")
//     }
//     else{
//         fileSystem.readFile(`./txt/${data1}.txt`, 'utf-8', (err,data2)=>{
//             console.log(data2)
//             fileSystem.readFile(`./txt/append.txt`, 'utf-8', (err,data3)=>{
//                 console.log(data3)

//                 fileSystem.writeFile(`./txt/final.txt`,`${data2}\n ${data3}`, 'utf-8', err=>{
//                     console.log("Your text written in final.txt")

//                 })
//             })
//         })
//     }
// })



//^^^^^^^^^^^^^^^^^^^^^^ SERVER ^^^^^^^^^^^^^^^^^^^^^^^^^^^^

//A Creating server
// const server = http.createServer((req, res)=>{
//     // console.log(req)                  //show many things in terminal which we can use with request
//       res.end("Helloo from server")
// })

//B Listen to the response
// server.listen(port, ip adressd , ()=>{})   callback is just optional parameter

// server.listen(8000, '127.0.0.1', ()=>{
//     console.log("Listening the response")
// })



//^^^^^^^^^^^^^^^^^^^^^^ Routing ^^^^^^^^^^^^^^^^^^^^^^^^^^^^

//Routing = Website k Different pages par jana 

// A Here in console hum jab bhi sever par 8000 k badd kuch bhi likenge vo console m show hoga (/favicon.ico isko ignore kro )
// const server = http.createServer((req, res)=>{
//     console.log(req.url)
//     res.end("Helloo from server")
// })
// server.listen(8000, '127.0.0.1', ()=>{
//     console.log("Listening the response")
// })


// B
// const server = http.createServer((req, res) => {
//     const pathName = req.url
//     if (pathName === '/' || pathName === '/overview') {
//         res.end("This is overview")
//     } else if (pathName === '/product') {
//         res.end("This is product")
//     } else {
//         res.writeHead(404, {
//             'Content-type': 'text/html',
//             'my-own-header': 'Helloo world'
//         })
//         res.end("Page not found")
//     }
// })

// server.listen(8000, '127.0.0.1', () => {
//     console.log("Listening the response")
// })



//^^^^^^^^^^^^^^^^^^^^^^ Creating Our Own API ^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// A
// const server = http.createServer((req, res) => {
//     const pathName = req.url;

//     if (pathName === '/api') {
//         fileSystem.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
//                 // Get the data from data.json file
//                 const productData = JSON.parse(data);
//                 res.writeHead(200, {
//                     'Content-type': 'application/json'
//                 });
//                 res.end(data);
//         });
//     }
//     else {
//         res.writeHead(404, {
//             'Content-Type': 'text/plain'
//         });
//         res.end('404 - Not Found');
//     }
// });

// server.listen(8000, '127.0.0.1', () => {
//     console.log("Listening the response")
// })



//B In above code whenever user /api path m jayga har bar file read hogi if 1 million bar users jaynge toh 1 million times read hogi so we want bas starting m ek bar ho so hum uss code ko callback se bahar nikal denge (async code se bahar likh denge) 
// const data = fileSystem.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
// // const productData = JSON.parse(data);

// const server = http.createServer((req, res) => {
//     const pathName = req.url;

//     if (pathName === '/api') {
//         res.writeHead(200, {
//             'Content-type': 'application/json'
//         });
//         res.end(data);
//     }
//     else {
//         res.writeHead(404, {
//             'Content-Type': 'text/plain'
//         });
//         res.end('404 - Not Found');
//     }
// });

// server.listen(8000, '127.0.0.1', () => {
//     console.log("Listening the response")
// })




//^^^^^^^^^^^^^^^^^^^^^^ Node Farm^^^^^^^^^^^^^^^^^^^^^^^^^^^^

const tempOverview = fileSystem.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fileSystem.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fileSystem.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fileSystem.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);


const server = http.createServer((req, res) => {
    // console.log(req.url)     //it will print only this part of the url --> /product?id=0

    // console.log(url.parse(req.url, true))
    // we get query and pathname from above code
    // query: [Object: null prototype] { id: '0' },
    // pathname: '/product',

    //so now we use ES6 to use query and pathname
    const { query, pathname } = url.parse(req.url, true)

    //Overview Page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-Type': 'text/html' })

        const cardsHTML = dataObj.map((element) => {
            // console.log(element)     //element contain all the json content
            return replaceTemp(tempCard, element)
        })

        const result = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHTML)

        res.end(result)
    }

    //Product Page
    else if (pathname === '/product') {
        //why we use query (below 2 console will explain you)
        // console.log(query)
        // console.log(query.id)

        res.writeHead(200, { 'Content-Type': 'text/html' })

        const products = dataObj[query.id]     //dataObj is an array of objects so we are accessing the id 
        const result = replaceTemp(tempProduct, products)
        res.end(result)
    }
    //API page
    else if (pathname === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        });
        res.end(data);
    }
    //Not Found
    else {
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        res.end('404 - Not Found');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log("Listening the response")
})


