const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

//CREATE POST:-yha post create krenge.
//ye post method hoga
router.post("/", async (req, res) => {
  const newPost = new Post(req.body); //body se sara chiz leke post bna liya.
  try {
    const savedPost = await newPost.save(); //newpost ko DS me save kr liya
    res.status(200).json(savedPost); //sab sahi se chalne k bad savedpost ko return kr denge.
  } catch (err) {
    //if some error occur then throw it
    res.status(500).json(err);
  }
});

//UPDATE POST:-user apan post update krna chahe uske liye.
//ye put method hoga
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); //url k userid se post ko find kra apna post model DB se.
    if (post.username === req.body.username) {
      //agar find kra post ka username and body me send kra username same hai mane ye url wala user apna hi post update kr rha so allow krenge.otherwise nahi krenge and ye msg de denge "You can update only your post!".
      try {
        //so url userid se post find kr post model DB se and usko update kr denge jo v body me hoga new info usse.
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true } //update post return kremge isliye ye likhenge nahi to prevoius older post hi return hoga.
        );
        res.status(200).json(updatedPost); //sab sahi hone k bad new updated post ko return kr denge.
      } catch (err) {
        //if some error occur then throw it
        res.status(500).json(err);
      }
    } else {
      //mane url wala userid dusra ka post update krne ka try kr rha.so ye allow ni krenge and ye msg de denge.
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    //if some error occur then throw it
    res.status(500).json(err);
  }
});

// //DELETE POST:-
//ye delete method hoga
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); //url wala userid se post find kr liya apan post model DB se
    if (post.username === req.body.username) {
      //agar finded post ka username and body ka username same hai mane url wala userid apana hi post delte kr rha so ye allow krenge .otherwise ni krenge and ye masg de denge "You can delete only your post!".
      try {
        //if some error occur then throw it
        await post.delete(); //post delete kra apana DB se
        res.status(200).json("Post has been deleted..."); //msg de diya post deleted ka
      } catch (err) {
        //if some error occur then throw it
        res.status(500).json(err);
      }
    } else {
      //mane url wala userid dusra ka post delete kr rha so ye allow ni krenge .and ye msg de denge.
      res.status(401).json("You can delete only your post!");
    }
  } catch (err) {
    //if some error occur then throw it
    res.status(500).json(err);
  }
});

// //GET POST:- yha apana post find kr sakte h
//ye get method hoga.
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); //url user id se post find kra from post model DB se
    res.status(200).json(post); //and post return kr denge
  } catch (err) {
    //if some error occur then throw it
    res.status(500).json(err);
  }
});

// //GET ALL POSTS:-ise sara post user pa sakta hai apna
//yha hum 2 type se sara post fech krenge first username  se mane ye username se jitna v post hai sabko fetch krenge like shubham hai to shubham username ka sara post fetch krenge.
//second category se like music hai to sare music releted post ko fetch krenge.
router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    //ye post array bna rhe isi me sara post fetch kr return krenge.
    let posts;
    if (username) {
      //agar username hai to post model db se wo username ka jitna v post hai sabko posts array me daal denge.
      posts = await Post.find({ username }); //here username means username:username
    } else if (catName) {
      //agar category name  hai to post model db se wo es cat  ka jitna v post hai sabko posts array me daal denge.

      posts = await Post.find({
        categories: {
          $in: [catName], //here catName means catName:catName
        },
      });
    } else {
      //agar na username hai na cat name tp fir sara post hi fetch kr posts array me daal denge.
      posts = await Post.find();
    }
    res.status(200).json(posts); //finally sara post find krne k bad posts array ko return kr denge as a responce.
  } catch (err) {
    //if some error occur then throw it
    res.status(500).json(err);
  }
});

module.exports = router;
