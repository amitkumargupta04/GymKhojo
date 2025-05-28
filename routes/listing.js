const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLogedIn, isOwner, validateListing } = require("../middleware.js");
// const multer  = require('multer')
// const {storage} = require("../cloudconfig.js")
// const upload = multer({ dest: storage })

const listingControlers = require("../controlers/listing.js");

//Index route and create route
router
  .route("/")
  .get(wrapAsync(listingControlers.indexListing))
  .post(validateListing, wrapAsync(listingControlers.createListing));

  // .post(upload.single('listing[image]'), (req, res) => {
  //   res.send(req.file);
  // })
//new route creating
router.get("/new", isLogedIn, (req, res) => {
  res.render("listings/new.ejs");
});

//Search code
router.get("/search", listingControlers.searchListings);

// contact the gym owner
router.post("/:id/contact", listingControlers.contactGym);

// show route through specific id update and delete route same route pe rqst aa rhi h
router
  .route("/:id")
  .get(wrapAsync(listingControlers.showListing))
  .put(wrapAsync(listingControlers.updateListing))
  .delete(isLogedIn, isOwner, wrapAsync(listingControlers.destroyListing));
//Edite route
router.get(
  "/:id/edit",
  isLogedIn,
  isOwner,
  validateListing,
  wrapAsync(listingControlers.editListing)
);

module.exports = router;
