const express = require('express')
const path = require('path')
const app = express();
const bodyparser = require('body-parser')
const axios = require('axios');
// const { title } = require('process');
const hostname = '127.0.0.1';
const port = 3000;

app.use(bodyparser.urlencoded({ extended: true }))

// function capitalizeFirstLetters(sentence) {
//     const words = sentence.split(" ");
//     let capitalizedSentence = "";
//     for (let i = 0; i < words.length; i++) {
//       const word = words[i];
//       capitalizedSentence += word[0].toUpperCase() + word.slice(1) + " ";
//     }
//     return capitalizedSentence; // Remove trailing space
//   }

app.use(express.static(path.join(__dirname, '/views')))

app.set('view engine', 'hbs')

app.get("/", (req, res) => {
    res.render('index', {
        title: 'Artify',
        name: 'Artify - Search any artist',
        url: '/',
        imgurl: 'A.png'
    });

})

app.post(`/submit`, (req, res) => {
    let userData = req.body.floatingInputGroup1;
    // userData = capitalizeFirstLetters(userData)
    // console.log('User Input-', userData)
    const options = {
        method: 'GET',
        responseType: 'stream',

        url: 'https://spotify-scraper.p.rapidapi.com/v1/artist/search',
        params: { name: `${userData}` },


        headers: {
            'X-RapidAPI-Key': '47e8ef22b0msh46e42567763363dp1977fbjsn7d6efff3b928',
            'X-RapidAPI-Host': 'spotify-scraper.p.rapidapi.com'
        }
    };

    axios.request(options)
        .then(response => {
            const stream = response.data;
            // console.log('Stream-', stream)
            stream.on('data', (chunk) => {

                const text = chunk.toString('utf-8');
                // const obj = [JSON.parse(chunk)]
                const obj = JSON.parse(text)
                //   console.log('text-', text)
                console.log('Object:', obj);
                //   console.log('URL:',obj.shareUrl );

                const vis = Object.keys(obj.visuals).length
                userData = obj.name
                // console.log('visuals', vis)
                res.render('index', {
                    title: userData,
                    name: userData,
                    url: obj.shareUrl,
                    imgurl: vis == 1 ? obj.visuals.avatar[0].url : 'A.png'
                })

            });
            // stream.on('end', () => {
            //   console.log('Stream completed');
            //   res.end();
            // });
        })
        .catch(error => console.error(error));

});

app.get("*", (req, res) => {
    res.send('404 error')
})

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})