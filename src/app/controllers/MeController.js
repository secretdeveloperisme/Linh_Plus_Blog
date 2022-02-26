class MeController{
  uploadAvatar(req, res){
    if(req.file){
      res.status(200).json({status: "success", filename: `/images/avatars/${req.file.filename}`});
    }
    else{
      res.status(500).json({status: "failed", "message": "upload image unsuccessfully"});
    }
  }
}
module.exports = new MeController();