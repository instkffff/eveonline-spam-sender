const esi = require('eve-swagger')
let esi2 = esi ({
	service: 'https://esi.evetech.net',
	source: 'tranquility',
	agent: 'eve-swagger | https://github.com/lhkbob/eve-swagger-js',
	language: 'en-us',
    timeout: 6000,
    minTime: 0,
    maxConcurrent: 0
})

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db/db.json')
const db = low(adapter)

function charactorTest(){
	num = db.get('count').value()
	location = 'characters['+num+'].id'
	Id = db.get(location).value()
	ID = Id + 1

	esi2.characters(ID).info().then(result => {
		console.log('have this character')
		db.get('characters').push({id:ID,status:0,send:0}).write()
		db.update('count', n=> n+1).write()
	}).catch(error => {
		console.log('no new characters')
	})
}



setInterval(function(){
	charactorTest()
},1000)