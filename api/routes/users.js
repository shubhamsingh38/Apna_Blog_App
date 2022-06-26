//yha user model ka kaam krenge like upadte ,delete,and get user so import user model as;-

const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

//UPDATE:-if update something then we use put method.
router.put("/:id", async (req, res) => {
  //ye url/endpoint me jo id paas krenge use yha access krenge.mane ye id wala user update krna chah rha hai.
  if (req.body.userId === req.params.id) {
    //jo body me userid(req.body.userId) hoga use and ye endpoint/url wala user id(req.params.id) agar dono same hai mane url wala user apana hi acc update kr rha hai.
    if (req.body.password) {
      //agar body me koi pass hai to use incrypt kr lenge as:-
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      //so url wala user ko DB me find kr use apna body se update kr denge jo v body me hoga.
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true } //ye taki updated user ko send kre.
      );
      res.status(200).json(updatedUser); //sare sahi hone k bad hum updated user ko send kr denge.
    } catch (err) {
      //otherwise koi error hoga to use throw kr deenge.
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("You can update only your account!"); //otherwise ye url wala user dusra ka acc update krne ka try kr rha so ye allow ni krenge.
  }
});

// DELETE:-if deleted something then we use delete method.
//ye url wala userid wala user apna acc delte krna chah rha hai.
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    //agar url wala uerid and body wala userid same hoga mane ye url wala id sahi hai so iska acc delte krna hai.
    try {
      //url wala userid find kr apna user model k  DB me agar wo present hoga to use delte kr dnge nahi to not found ka msg de denge.agar uska prevoius all post delte na krna chaho to ye line mat likhna.
      const user = await User.findById(req.params.id);
      try {
        //ye user ko delte krne se pahle iska sara post delete kr denge.
        await Post.deleteMany({ username: user.username }); //post model Db se sara post delete kr as
        //after delteing its all post .es user ko v delete kr denge.
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted..."); //finally delteed user ka msg de denge.
      } catch (err) {
        //if some error occur then throw it.

        res.status(500).json(err);
      }
    } catch (err) {
      //if some error occur then throw it.
      res.status(404).json("User not found!"); //user mila hi nahi user model Db me
    }
  } else {
    res.status(401).json("You can delete only your account!"); //mane ye url wala user dusra ka acc delete krna cha rha so ye allow ni krenge.
  }
});

// //GET USER:-if get something then we use get method.
// ye url wala user pana cha rhe
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id); //apana user model Db me ye url wala id serach kra.and uska info user ko return kr dega.
    const { password, ...others } = user._doc; //hum user ka pass ni send krenge uske liye ye likhenge.
    res.status(200).json(others); //then user ko send kra as yha user ka sara info send kra accept pass.
  } catch (err) {
    //if some error occur then throw it.
    res.status(500).json(err);
  }
});

module.exports = router;
