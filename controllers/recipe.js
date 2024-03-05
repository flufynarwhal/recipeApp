const cloudinary = require("../middleware/cloudinary");
const Recipe = require("../models/recipe");
const Favourite = require("../models/favourite");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const recipes = await Recipe.find({ user: req.user.id });
      res.render("profile.ejs", { recipes: recipes, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const recipes = await Recipe.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { recipes: recipes });
    } catch (err) {
      console.log(err);
    }
  },

  getFavourites: async (req, res) => {
    try {
      const recipes = await favourites.find({ user: req.user.id });
      
      populate('recipe')
      console.log(recipes)

      res.render("favourites.ejs", { recipes: recipes, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  

  getRecipe: async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      const comments = await Comment.find({post: req.params.id}).sort({ createdAt: "desc" }).lean();
      res.render("recipe.ejs", { recipe: recipe, user: req.user, comments: comments });
    } catch (err) {
      console.log(err);
    }
  },
  createRecipe: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Recipe.create({
        name: req.body.name,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        ingredients: req.body.ingredients,
        directions: req.body.directions,
        likes: 0,
        user: req.user.id,
      });
      console.log("Recipe has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },

  favouriteRecipe: async (req, res) => {
    try {
      
        await Favourite.create({
        user: req.user.id,
        recipe: req.params.id
      });
      console.log("Favourite Recipe has been added!");
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },


  likeRecipe: async (req, res) => {
    try {
      await Recipe.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteRecipe: async (req, res) => {
    try {
      // Find post by id
      let post = await Recipe.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(recipe.cloudinaryId);
      // Delete post from db
      await Recipe.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
