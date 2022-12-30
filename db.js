import { MongoClient } from "mongodb"
let dbConnection
export const heck = {
	connectToDb: (cb) => {
		// MongoClient.connect("mongodb://localhost:27017/bookstore")
		MongoClient.connect(
			"mongodb+srv://fakeGuy2:Batman53@highlander.6ex1x15.mongodb.net/?retryWrites=true&w=majority"
		)
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

//how to get nodemon to pass the debug flag to node
//then use launch.json to tell vscode how to connect to the node process
