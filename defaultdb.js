//lowdb
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db/db.json')
const db = low(adapter)

//default lowdb
db.defaults({characters:[], count:0, token:[], sent:0}).write()
db.get('characters').push({id:2116439166}).write()
db.get('token').push({token:'1|CfDJ8O+5Z0aH+aBNj61BXVSPWfiESf4B4OSUM7KMrBvRARTJ0U0oMgRGUi55IJ0PEZE9hiQLsFNPkxagycQ8mKI98qoVFVTaZwfOnGloS53jzzxTbPvALpJChK/y1bqjHhOJxwGiM9tha+jQhsqpvG6FMf/1SO/il4vfY3WgE0r98eqy'}).write()