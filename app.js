const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
//SET UP APP
const app = express()
//set app to use ejs
app.set("view engine", "ejs")
// set app to use bodyParser
app.use(bodyParser.urlencoded({
  extended: true
}))
//set app to store statuc html and css files
app.use(express.static("public"))

//SET UP mongoose : connect to db
mongoose.connect("mongodb://localhost:27017/WikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
//create schema
const articleSchema = {
  title: String,
  content: String
}
//create collection
const Article = mongoose.model("Article", articleSchema)




//creating data

// const data1 = new Article(
//     { title : "first title", content: "first content" }
// )
//
// const data2 = new Article(
//     { title : "second title", content: "second content" }
// )
//
// const data3 = new Article(
//     { title : "third title", content: "third content" }
// )
// const defaultData = [data1, data2, data3]
// Article.insertMany(defaultData,function (err){
//     if(!err){
//         console.log("items inserted sucessfully");
//     }
// })

//building rest api
////////////////////////////////////Request targetting all articles ////////////////////////////////////////////////////
app.route("/articles")
  //chnained methods
  .get(function(req, res) {
    Article.find(function(err, result) {
      //no conditon , finds all data
      res.send(result);
    })
  })

  .post(function(req, res) {
    let newData = new Article({
      title: req.body.title,
      content: req.body.content
    })
    newData.save(function(err) {
      if (err) {
        console.log(err, "tHERE WAS AN ERROR")
        res.send(err)

      } else {
        res.send("posted sucesfully")
      }

    })
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err, result) {
      //no erros
      if (!err) {
        res.send("Sucessfully deleted all articles")
      } else {
        res.send(err)
      }
    })
  });

////////////////////////////////////Request targetting all articles ////////////////////////////////////////////////////

app.route("/articles/:articleTitle")
  .get(function(req, res) {

    Article.findOne({
      title: req.params.articleTitle
    }, function(err, article) {
      if (!err) {
        if (article) {
          res.send(article)
        } else {
          res.send("THere was no found articles.")
        }

      } else {
        res.send(err)
      }

    })

  })

  .put(function(req, res) {
    Article.update({
        title: req.params.articleTitle
      }, {
        title: req.body.title,
        content: req.body.content
      }, {
        overwrite: true
      },
      function(err) {
        if (!err) {
          res.send("Sucessfully updated article")
        } else {
          res.send("Did not update article", err)
        }

      }
    )
  })

  .patch(function(req, res) {
      Article.update(
        {title: req.body.articleTitle},
        {$set : req.body},
        function (err){
          if (!err) {
            res.send("Siucessfully patched article")
          }else{
            res.send("Faluire patching")
          }
        }
      )
  })

  .delete(function (req,res){
    Article.deleteOne({title: req.body.title} ,
       function (err) {
        if (!err) {
          res.send("Deleted Sucessfully")
        }else{
          res.send("Cound not delete sucessfully")
        }
      })
  })


app.listen(3000, function() {
  console.log("Listening on port 3000")
})
