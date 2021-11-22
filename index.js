

const fs = require('fs') //пакет для загрузки файла
const axios = require('axios') //пакет для отправки запроса 
const cheerio = require('cheerio') //API для получение структуры сайта


const link = 'https://tv.yandex.ru/channel/pervyy-16'
// const link = 'https://tv.yandex.ru/'
let arr = []
const parseYandexTv = async () => {
    try {

        await axios.get(link)
            .then(res => res.data)
            .then(res => {
                let html = res
                $ = cheerio.load(html)

                const listItem = $('li')
                listItem.each(async function (i, e) {
                    
                    const channels = { time: "", name: "", link: "", description: "", leading: "", image_news: ""}
                    channels.time = $('time.channel-schedule__time', e).text()
                    channels.name = $('h3.channel-schedule__title', e).text().slice(0, -1)
                    channels.link = "https://tv.yandex.ru" + $('a.link.channel-schedule__link', e).attr('href')
                                      
                    await axios.get(channels.link) //переходим по всем ссылкам и берем информацию
                        .then(res => res.data)
                        .then(res => {
                            
                            let html = res
                            $ = cheerio.load(html)
                            $(html).find('main.content.content_program').each((i, e) => {
                               channels.description = $(e).find('p.program-description__paragraph', e).text()
                               channels.leading = $(e).find('div.program-details__text:first', e).text()    
                                try{
                                    channels.image_news = $(e).find("section > meta").attr('content')
                                }catch(error){
                                    channels.image_news = null
                                }
                                
                            })
                            arr.push(channels)
                        })
                        
                        arr.sort(function (a, b){ //сортировка по времени
                            if(a.time > b.time) return 1
                            if(a.time < b.time) return -1
                            return 0
                        })
                        fs.writeFile('tvchanell.json', JSON.stringify(arr), function (error) { //запись в файл
                            if (error) throw error
                            console.log('Saved file in tvchanell.json');
                        })
                       
                })

                

               

            })
            .catch(err => console.log(err))


    } catch (error) {
        console.log(error);
    }
}




parseYandexTv()
