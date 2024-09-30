const Listing = require("../models/listing");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken});

module.exports.index = async (req, res)=>{
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings})  ;   //whenever we have to send ejs tamplets use res.render
};

module.exports.renderNewForm =  (req, res)=>{
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({ 
        path:"reviews",
    populate:{
        path: "author",
     },
})
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing you Requested is does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs", {listing});
};

module.exports.createListing = async(req,res)=>{
    let response = await geocodingClient
    .forwardGeocode({
     query: req.body.listing.location,
     limit: 1,
    })
    .send();
   
     let url = req.file.path;
     let filename = req.file.filename;
     const newlisting = new Listing(req.body.listing);
     newlisting.owner=req.user._id;
     newlisting.image = {url, filename};
     newlisting.geometry = response.body.features[0].geometry
     let savelisting= await newlisting.save();
     console.log(savelisting);
     req.flash("success","New Listing Created!");
     res.redirect("/listings");
  };



module.exports.renderEditForm = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you Requested is does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl});
};

module.exports.updateListing = async (req,res)=>{
    let {id} =req.params;
    let listings=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if( typeof req.file !=="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listings.image={url,filename};
    await listings.save();
    }
     req.flash("success","Listing updated!");
     res.redirect(`/listings/${id}`);
  }; 



module.exports.deleteListing = async (req, res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", " Listing Deleted!");
    res.redirect("/listings");
};

module.exports.filter = async(req,res,next)=>{
    // let {q} = req.query;
    let {id} = req.params;
    let allListings = await Listing.find({category: id});
    // console.log(allListing)
    if(allListings.length != 0){
        res.render("listings/index.ejs", { allListings });
    }else{
        req.flash("error","Listings is not here")
        res.redirect("/listings")
    }
}

module.exports.search = async (req, res) => {
    let { title } = req.query;
  
    const allListings = await Listing.find({ title });
    res.render("./listings/index.ejs", { allListings });
};