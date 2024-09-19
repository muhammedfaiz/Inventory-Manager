 const {verifyToken}=require("../utils/utils");

const protect = async (req,res,next)=>{
    let token;
    if(req.headers.authorization){
        try {
            token = req.headers.authorization.split(" ")[1];
            const decode = verifyToken(token);
            req.user = {id:decode.id,email:decode.email};
            next();
        } catch (error) {
            return res.status(401).json({message:"Not authorized, token failed"});
        }
    }
}

module.exports = protect;