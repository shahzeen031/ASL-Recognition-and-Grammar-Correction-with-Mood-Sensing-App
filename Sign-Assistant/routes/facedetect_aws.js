const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
let multer = require('multer');

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });
//AWS access details
AWS.config.update({
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-west-2'
});

const rekognition = new AWS.Rekognition();

async function detectAndRecognizeFaces(imageBuffer) {
    const params = {

        Image: {
            Bytes: imageBuffer
        },
        Attributes: [
            "ALL"
        ]
    };

    try {

        const response = await rekognition.detectFaces(params).promise();

        // console.log(response.FaceDetails)
        const emotionsdetect= await emotions(response.FaceDetails)

        return emotionsdetect;
    } catch (error) {
        console.error('Error recognizing faces:', error);
        throw error;
    }
}
async function addFaces(buffer, personName) {

    try {
        const response = await rekognition.indexFaces({
            "CollectionId": "Face_Detect",
            "DetectionAttributes": ["ALL"],
            "ExternalImageId": personName,
            "Image": {
                "Bytes": buffer
            }
        }).promise();

        return response.FaceRecords;
    } catch (error) {
        console.error('Error recognizing faces:', error);
        throw error;
    }


}

async function emotions(faceDetails){
    console.log(faceDetails.Emotions)
    const emotions = faceDetails[0].Emotions; // Assuming there's only one face in the array

if (emotions.length > 0) {
    let highestConfidence = emotions[0].Confidence;
    let dominantEmotion = emotions[0].Type;

    for (let i = 1; i < emotions.length; i++) {
        if (emotions[i].Confidence > highestConfidence) {
            highestConfidence = emotions[i].Confidence;
            dominantEmotion = emotions[i].Type;
        }
    }

    console.log(`Dominant Emotion: ${dominantEmotion} with Confidence: ${highestConfidence}`);
    return dominantEmotion
} else {
    console.log("No emotions detected.");
    return null
}
}

//@route Post api/Facelandmark
//desc post route
//@access Public
router.post('/', upload.single('image'), async (req, res) => {
    try {

       // console.log("input",req.file)
        // const image = req.file;
        // const str = image.toString('base64');
        // const buffer = Buffer.from(str,'base64');

        const { buffer } = req.file;

        let output = await detectAndRecognizeFaces(buffer)



        console.log('hello: ', output);
        res.json(output)



    } catch (error) {
        console.log(error)
        console.error('Error indexing face:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});




module.exports = router;