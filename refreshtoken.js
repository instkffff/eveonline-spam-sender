//axios
const axios = require('axios')
const oauth = require('axios-oauth-client')

//lowdb
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db/db.json')
const db = low(adapter)

//refresh access token
const getRefreshToken = oauth.client(axios.create(), {
  url: 'https://login.eveonline.com/oauth/token',
  grant_type: 'refresh_token',
  client_id: 'f6686d90484e414fb2ba5060781c94cd',
  client_secret: 'GyA81sTLv6TCwPg30ll6W98cXUr5XVPueS6yyhFZ',
  refresh_token: "uCmN4CUK9BT0D2S8EWLD96YfUHlLejDsiLc7P6liCGY",
  scope: 'esi-mail.send_mail.v1'
})

async function getkey(){
	auth = await getRefreshToken()
	accessToken = auth.access_token
	console.log(accessToken)
	db.get('token[0]').assign({ token:`${accessToken}` }).write()
}


setInterval(function(){
	getkey()
},600000)
