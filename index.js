

const fs = require('fs') //пакет для загрузки файла
const axios = require('axios') //пакет для отправки запроса 
const cheerio = require('cheerio') //API для получение структуры сайта


const link = 'https://tv.yandex.ru/channel/pervyy-16'
// const link = 'https://tv.yandex.ru/'
let arr = []
const other_channels = []
const parseYandexTv = async () => {
    try {

        await axios.get(link)
            .then(res => res.data)
            .then(res => {
                let html = res
                $ = cheerio.load(html)


                $('div.calendar__item-wrapper').each(function (i, e) {
                    const channels = { data: "", link_data: "", other_channels }
                    channels.link_data = "https://tv.yandex.ru/channel/pervyy-16/" + $(e).find('a.calendar__item', e).attr('href')
                    channels.data = $(e).find('a.calendar__item', e).text()

                    const message = async () => {
                        await axios.get(channels.link_data) //переходим по всем ссылкам и берем информацию
                            .then(res => res.data)
                            .then(res => {

                                const iformation_channel = { time: "", name: "", link: "", description: "", leading: "", image_news: "" }

                                let html = res
                                $ = cheerio.load(html)
                                $('li').each(async function (i, e) {
                                    iformation_channel.time = $('time.channel-schedule__time', e).text()
                                    iformation_channel.name = $('h3.channel-schedule__title', e).text().slice(0, -1)
                                    iformation_channel.link = "https://tv.yandex.ru" + $('a.link.channel-schedule__link', e).attr('href')
                                    // arr.push(channels)
                                    // fs.writeFile('tvchanell.json', JSON.stringify(arr), function (error) { //запись в файл
                                    //     if (error) throw error
                                    //     console.log('Saved file in tvchanell.json');
                                    // })
                                    // $('li').each(async function (i, e) {
                                    //     //    channels.description = $(e).find('p.program-description__paragraph', e).text()
                                    //     //    channels.leading = $(e).find('div.program-details__text:first', e).text()    
                                    //     // try{
                                    //     //     channels.image_news = $(e).find("section > meta").attr('content')
                                    //     // }catch(error){
                                    //     //     channels.image_news = null
                                    //     // }
                                    //     channels.time = $('time.channel-schedule__time', e).text()
                                    // })
                                    // arr.push(channels)
                                    other_channels.push(iformation_channel)

                                    other_channels.sort(function (a, b) { //сортировка по времени
                                        if (a.time > b.time) return 1
                                        if (a.time < b.time) return -1
                                        return 0
                                    })


                                    // arr.push(channels)

                                    // console.log(other_channels);

                                    fs.writeFile('tvchanell.json', JSON.stringify(other_channels), function (error) { //запись в файл
                                        if (error) throw error
                                        console.log('Saved file in tvchanell.json');
                                    })
                                    // console.log(other_channels);

                                    // fs.writeFile('tvchanell.json', JSON.stringify(arr), function (error) { //запись в файл
                                    //     if (error) throw error
                                    //     console.log('Saved file in tvchanell.json');
                                    // })
                                })
                            })


                    }

                    message()




                    // console.log(arr.push(channels));
                    if (i == 13) {
                        return false;
                    }
                })

                // const listItem = $('li')
                // listItem.each(async function (i, e) {

                //     const channels = { time: "", name: "", link: "", description: "", leading: "", image_news: "" }
                //     channels.time = $('time.channel-schedule__time', e).text()
                //     channels.name = $('h3.channel-schedule__title', e).text().slice(0, -1)
                //     channels.link = "https://tv.yandex.ru" + $('a.link.channel-schedule__link', e).attr('href')

                //     await axios.get(channels.link) //переходим по всем ссылкам и берем информацию
                //         .then(res => res.data)
                //         .then(res => {

                //             let html = res
                //             $ = cheerio.load(html)
                //             $(html).find('main.content.content_program').each((i, e) => {
                //                 channels.description = $(e).find('p.program-description__paragraph', e).text()
                //                 channels.leading = $(e).find('div.program-details__text:first', e).text()
                //                 try {
                //                     channels.image_news = $(e).find("section > meta").attr('content')
                //                 } catch (error) {
                //                     channels.image_news = null
                //                 }

                //             })
                //             arr.push(channels)
                //         })

                //     arr.sort(function (a, b) { //сортировка по времени
                //         if (a.time > b.time) return 1
                //         if (a.time < b.time) return -1
                //         return 0
                //     })
                //     fs.writeFile('tvchanell.json', JSON.stringify(arr), function (error) { //запись в файл
                //         if (error) throw error
                //         console.log('Saved file in tvchanell.json');
                //     })

                // })





            })
            .catch(err => console.log(err))


    } catch (error) {
        console.log(error);
    }
}




parseYandexTv()
