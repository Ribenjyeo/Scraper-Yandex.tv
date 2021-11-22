const fs = require('fs') //пакет для загрузки файла
const axios = require('axios') //пакет для отправки запроса 
const cheerio = require('cheerio') //API для получение структуры сайта

const link = 'https://tv.yandex.ru/channel/pervyy-16'

const parseYandexTv = async () => {
    try {
        let arr = []

        await axios.get(link)
            .then(res => res.data)
            .then(res => {
                let html = res
                $ = cheerio.load(html)


                // const listItem = $('li')
                // listItem.each(function(i , e) {
                //     const channels = {time: "", name: "", link: ""}              
                //     channels.time = $('time.channel-schedule__time', e).text()
                //     channels.name = $('h3.channel-schedule__title', e).text()
                //     channels.link = "https://tv.yandex.ru" + $('a.link.channel-schedule__link', e).attr('href')
                //     arr.push(channels)                    
                // })


                

            

            })
            .catch(err => console.log(err))

        fs.writeFile('tvchanell.json', JSON.stringify(arr), function (error) { //запись в файл
            if (error) throw error
            console.log('Saved file in tvchanell.json');
        })

    } catch (error) {
        console.log(error);
    }
}

parseYandexTv()