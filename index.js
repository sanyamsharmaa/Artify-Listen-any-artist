const http = require('http');
const fs = require('fs')
const axios = require('axios')
const hostname = '127.0.0.1';
const port = 3000;

const html = fs.readFileSync('index.html', 'utf-8')
const css = fs.readFileSync('style.css', 'utf-8');

const replace =(flcnt, val) =>{
    let data = flcnt.replace('{%url%}', val.shareUrl)
    data = data.replace('{%imgurl%}', val.visuals.avatar[0].url)
    data = data.replace('{%name%}', val.name)
    return data;
}

const options = {
    method: 'GET',
    responseType: 'stream',


    // url: 'https://spotify-scraper.p.rapidapi.com/v1/artist/albums',
    // params: {
    //   artistId: '7uIbLdzzSEqnX0Pkrb56cR'
    // },


    url: 'https://spotify-scraper.p.rapidapi.com/v1/artist/search',
    params: {name: 'Yo Yo Honey Singh'},


    headers: {
      'X-RapidAPI-Key': '47e8ef22b0msh46e42567763363dp1977fbjsn7d6efff3b928',
      'X-RapidAPI-Host': 'spotify-scraper.p.rapidapi.com'
    }
  }; 

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    if (req.url == '/') {
        // res.write('This page shows you data fetched from API , now Im subscribed baby');

        axios.request(options)
  .then(response => {
    const stream = response.data;
    stream.on('data', (chunk) => {
    //   res.write(chunk)
      const text = chunk.toString('utf-8'); 
      // const obj = [JSON.parse(chunk)]
      const obj = JSON.parse(text)
      console.log(text)
      console.log('Object:',obj );
      console.log('URL:',obj.shareUrl );
      
      // const finalhtml = obj.map((val)=>{
        // })
        const updthtml = replace(html, obj);
        finalhtml = updthtml.replace(/<head>/, `<head><style>${css}</style>`);
      // const ans = replace(html, obj)
        console.log('Final html - ',finalhtml )
        res.write(finalhtml);
      // Process the data chunk here (e.g., write to a file, update UI)a
    });
    stream.on('end', () => {
      console.log('Stream completed');
      res.end();
    });
  })
  .catch(error => console.error(error));
    }

    else if (req.url == '/menu') {
        res.end('<h3>Here is our menu</h3>');
    }
    else {
        res.writeHead(404, { "Content-Type": "text/html" })
        res.end('<h3>404 error</h3>');

    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});