import express from "express"
import { heck } from "./db.js"
import { ObjectId } from "mongodb"
const app = express()
app.use(express.json())
let db = null
heck.connectToDb((err) => {
	if (!err) {
		app.listen(3000, () => {
			console.log("app listening port 3000")
		})
		db = heck.getDb()
	}
})
//useful for looking at api info
let id = 0
app.use((req, res, next) => {
	let thisId = id++
	const now = Date.now()
	console.log(thisId, req.path, req.method)
	req.reqID = thisId
	res.on("finish", () => {
		console.log(
			thisId,
			res.statusCode,
			req.path,
			req.method,
			"Took: ",
			Date.now() - now,
			"ms"
		)
	})
	next()
})

app.get("/books", (req, res) => {
	let books = []
	console.log("working on books for id", req.reqID)
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
			res.status(500).json({ err: "can not fetch docs" })
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

//below is code to 'make a post request' through postman
app.post("/books", (req, res) => {
	let book = req.body
	console.log("book", book)
	db.collection("books")
		.insertOne(book)
		.then((result) => {
			res.status(201).json(result)
		})
		.catch((err) => {
			res.status(500).json({ err: "could not create a new document" })
		})
})

//delete item from db
app.delete("/books/:id", (req, res) => {
	if (ObjectId.isValid(req.params.id)) {
		db.collection("books")
			.deleteOne({ _id: ObjectId(req.params.id) })
			.then((result) => {
				res.status(200).json(result)
			})
			.catch((err) => {
				res.status(500).json({ error: "could not delete the document" })
			})
	} else {
		res.status(500).json({ error: "not a valid doc" })
	}
})

//patch request to update book whatever
app.patch("/books/:id", (req, res) => {
	let updates = req.body
	if (ObjectId.isValid(req.params.id)) {
		console.log("req.params", req.params, "req.body", req.body)
		db.collection("books")
			.updateOne({ _id: ObjectId(req.params.id) }, { $set: updates })
			.then((result) => {
				res.status(200).json(result)
			})
			.catch((err) => {
				res.status(500).json({ error: "could not update the document" })
			})
	} else {
		res.status(500).json({ error: "not a valid doc" })
	}
})
