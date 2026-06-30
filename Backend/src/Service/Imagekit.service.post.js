

// or

const ImageKit = require("imagekit");

var imagekit = new ImageKit({
    publicKey : process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey : process.env.IMAGE_KIT_SECREAT_KEY,
    urlEndpoint : "https://ik.imagekit.io/pdlpuxs98"
});



async function uploadFile(file,filename){ 
    const response=await imagekit.upload({
        file:file,
        fileName:filename,
        folder:"AKhand-ai-social"
    })


    return response
}

module.exports=uploadFile