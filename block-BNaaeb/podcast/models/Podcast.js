var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var podcastSchema = new Schema(
  {
    name: { type: String, required: true },
    artist: { type: String },
    title: { type: String, required: true },
    image: { type: String },
    audio: { type: String },
    isVarified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

let Podcast = mongoose.model('Podcast', podcastSchema);

module.exports = Podcast;