const mongoose = require('mongoose');
const dbModel = require('./index');

const Schema = mongoose.Schema;

const articleSchema = new Schema({
    name: { type: String, required: [true, "Please enter a valid name"] },
    description: { type: String, required: [true, "Please enter a valid description name"]},
    profileId: { type: mongoose.Types.ObjectId, required: [true, "Please enter a valid profileid"] },

}, { timestamps: true })

const Article = mongoose.model(dbModel.Article, articleSchema);

module.exports = Article;