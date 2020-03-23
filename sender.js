//lowdb
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db/db.json')
const db = low(adapter)

//esi
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


//sender 

function send_mail(){
	accessToken = db.get('token[0].token').value()
	sent = db.get('sent').value()
	location = 'characters[' + sent +'].id'
	id = db.get(location).value()
	
	if (id === undefined){
		console.log('no new')
	} else {
		esi2.characters(2112869932, `${accessToken}`).mail.send({
			"approved_cost" : 0,
			"body" : "test" ,
			"recipients" : [
				{
					"recipient_id": `${id}`,
					"recipient_type": "character"
				}
			],
			"subject": "subject empty"
		}).then(result => {
			console.log(result)
			db.update('sent', n => n+1).write()
		}).catch(error => {
			console.log(error)
		})
	}
}



setInterval(function(){
	send_mail()
},3000)
