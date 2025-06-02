import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  image: {
    data: Buffer, // image binary data
    contentType: String, // e.g., 'image/jpeg'
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
