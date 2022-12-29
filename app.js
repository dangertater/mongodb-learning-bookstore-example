import express from "express"
import { heck } from "./db.js"
import { ObjectId } from "mongodb"
const app = express()
let db = null
heck.connectToDb((err) => {
	if (!err) {
		app.listen(3000, () => {
			console.log("app listening port 3000")
		})
		db = heck.getDb()
	}
})

app.get("/books", (req, res) => {
	let books = []
	db.collection("books")
		.find()
		.sort({ author: 1 })
		.forEach((book) => {
			books.push(book)
		})
		.then(() => {
			res.status(200).json(books)
		})
		.catch(() => {
			res.status(500).json({ error: "can not fetch docs" })
		})
})

app.get("/books/:id", (req, res) => {
	if (ObjectId.isValid(req.params.id)) {
		db.collection("books")
			.findOne({ _id: ObjectId(req.params.id) })
			.then((doc) => {
				res.status(200).json(doc)
			})
			.catch((err) => {
				res.status(500).json({ error: "could not fetch the document" })
			})
	} else {
		res.status(500).json({ error: "not a valid doc" })
	}
})
