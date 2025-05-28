const Listing = require("../models/listing");

module.exports.indexListing = async (req, res) => {
  let allListing = await Listing.find();
  res.render("listings/index.ejs", { allListing });
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews", populate: {
          path: "author",
        },
      })
      .populate("owner"); // reviews ko bhej rahe h
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
}
module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Updated listing");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Deleted listing");
  res.redirect("/listings");
}

//Search bar
module.exports.searchListings = async (req, res) => {
  const searchQuery = req.query.query || "";

  try {
    const listings = await Listing.find({
      title: { $regex: searchQuery, $options: "i" }, // case-insensitive match
    });

    res.render("listings/searchResult", { listings, query: searchQuery });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).send("Internal Server Error");
  }
};

//contact the gym owner
module.exports.contactGym = async (req, res) => {
    const { id } = req.params;
    const { name, email, message } = req.body;

    const listing = await Listing.findById(id).populate("owner");

    if (!listing) {
        req.flash("error", "Gym not found.");
        return res.redirect("/listings");
    }

    // Log the message or store it in DB (future feature)
    // console.log("📩 Contact Request:", {
    //     from: { name, email },
    //     message,
    //     toOwner: listing.owner.username,
    // });

    req.flash("success", "Your message has been sent to the gym owner!");
    res.redirect(`/listings/${id}`);
};