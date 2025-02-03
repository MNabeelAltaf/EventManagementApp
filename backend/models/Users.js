const mongoose = require("./Config"); 

const UsersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  joinEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Events", default: [] }],  
  image: { type: String, required: false },
});

const Users = mongoose.model("Users", UsersSchema);
module.exports = Users;
