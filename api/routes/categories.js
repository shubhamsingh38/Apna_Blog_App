const router = require("express").Router();
const Category = require("../models/Category");

//sara post ko hum DB me as a category v save krenge uske liye ye hai.
//ye post method hoga
router.post("/", async (req, res) => {
  const newCat = new Category(req.body); //ne cat bnaya jo v body me tha us info se.
  try {
    const savedCat = await newCat.save(); //new cat ko save kra DB me
    res.status(200).json(savedCat); //and saved cat ko as a responce return kr denge.
  } catch (err) {
    //if some error occur then throw it.

    res.status(500).json(err);
  }
});

//for fetching categories of post
//ye get method hoga
router.get("/", async (req, res) => {
  try {
    const cats = await Category.find(); //category model Db se sara category fetch kr cats me daal diya.
    res.status(200).json(cats); //cats ko as a responce return kr denge.
  } catch (err) {
    //if some error occur then throw it.
    res.status(500).json(err);
  }
});

module.exports = router;
