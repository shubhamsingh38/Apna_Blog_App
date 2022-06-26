//to create router so we need express framework as:-
//yha user model ka auth krenge so import user model as;-

const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt"); //password ko decrypt krne k liye ye package responsible hai.

//ye post methode hoga bcz if you create something it should be post method so yha sara post method hi hoga as:-

//REGISTER

router.post("/register", async (req, res) => {
  try {
    // decrypt pass jo body se milega as:-
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    //yha ek user create krenge and uske properties me wo sara values daal denge jo /register page se aayega yha pe as:-
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    const user = await newUser.save(); //save user in mongoDB
    res.status(200).json(user); //and i will send user
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    //jo v login page me username enter krega use hum DB me saerach krenge agar user nhi hoga to Wrong credentials! send kr denge.
    const user = await User.findOne({ username: req.body.username });
    //The code changes here for the if statement .. mine didnt worked with the code shown in the video

    if (!user) {
      return res.status(400).json("wrong credentials");
    }
    //agar user hoga to wo jo login page me pass enter kiya hai use hum user(ye user hum return hoke milega bcz ye user DB me hai so usi k pass k sath compare krenge.) ka password  se match krenge .agar match ni krega to agian Wrong credentials! send kr denge.
    const validated = await bcrypt.compare(req.body.password, user.password); //req.body.password mane enter pass and user.password mane jo user ko find kiye h Db me uska pass.
    if (!validated) {
      return res.status(400).json("wrong credentials");
    }

    const { password, ...others } = user._doc; //mai user ko pass ni bhejna chahta so others bhejenge .jisse pass k alawa sara chiz bhej denge user ko .
    res.status(200).json(others); //sab sahi hoga to user ko send kr denge.
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
