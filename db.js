import { MongoClient } from "mongodb"
let dbConnection
export const heck = {
	connectToDb: (cb) => {
		MongoClient.connect("mongodb://localhost:27017/bookstore")
			.then((client) => {
				dbConnection = client.db()
				return cb()
			})
			.catch((err) => {
				console.log(err)
				return cb(err)
			})
	},
	//returns a value, the db connection
	getDb: () => dbConnection,
}
