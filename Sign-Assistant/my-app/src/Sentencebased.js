import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { useRecordWebcam } from 'react-record-webcam'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

function Sentensebased() {
  const [showbuttons, setsshowbuttons] = useState(true);
  const [showupload, setsshowupload] = useState(false);
  const [Querysend, setsQuerysend] = useState(false);
  const [Query, setsQuery] = useState('');
  const [Querryresponse, setsQuerryresponse] = useState('');
  const [gifs, setgifs] = useState([]);
  const [Upload, setupload] = useState();
  const [image, setimage] = useState();
  const [mood, setmood] = useState('');
  const synth = window.speechSynthesis; // Web Speech API
  const speakText = (text) => {
    console.log("hear me 1",synth,text)
    if (synth && text) {
     
      const utterance = new SpeechSynthesisUtterance(text);
      synth.speak(utterance);
      console.log("hear me",utterance)
      
    }
  };
  const OPTIONS = {
    filename: "test-filename",
    fileType: "mp4",
    width: 640,
    height: 640
  };
  const recordWebcam = useRecordWebcam(OPTIONS);

  const onFileChange = (e) => {
    setupload(e.target.files[0]);
  };

  const open2 = (e) => {
    setsshowupload(true)
    setsshowbuttons(false)
  }

  const Predict = async (formData) => {
    axios.post('http://localhost:5000/predict', formData).then((res) => {
      if (Query) {
        setsQuery(Query + " " + res.data);
      }
      else {
        setsQuery(res.data);
      }

    }).catch(err => console.log(err));

    // fetch(`/predict`, requestOptions)
    //     .then(response => console.log(response.json()))
    //     .then(data => {
    //       console.log(data)
    //       // this.setState({
    //       // isLoading: true
    //       // })})
    //     });

  }

  const Assistant = async () => {
    // await captureImage()

    await setsQuerysend(true)
    await setsshowbuttons(true)

    await ChatgptAPI()
    await faceAPI()
    //await speakText()
  }

  const saveFile = async () => {
    const blob = await recordWebcam.getRecording(OPTIONS);
    //  console.log(blob)
    //recordWebcam.download()
    console.log({ blob });

    setsQuerysend(true)
    setsshowbuttons(true)

    var file = new File([blob], "nametest", { type: "video/mp4", })
    var formData = new FormData();
    await formData.append('video', file, file.name);
    console.log(file)
    Predict(formData)



  };

  const Nextword = async () => {
    const blob = await recordWebcam.getRecording(OPTIONS);
    //  console.log(blob)
    //recordWebcam.download()
    console.log({ blob });

    setsQuerysend(true)
    //setsshowbuttons(true)
    recordWebcam.retake()
    var file = new File([blob], "nametest", { type: "video/mp4", })
    setupload(file)
    var formData = new FormData();
    await formData.append('video', file, file.name);

    Predict(formData)

  };

  const Nextword2 = async () => {

    setsQuerysend(true)

    var formData = new FormData();
    await formData.append('video', Upload, Upload.name);

    Predict(formData)

  };

  const open = async (e) => {
    setsshowbuttons(false)

    console.log('helllooo')
    const blob = await recordWebcam.getRecording();
    recordWebcam.open()


  };

  const start = async (e) => {

    console.log('helllooo')
    recordWebcam.start()


  };

  const stop = async (e) => {

    console.log('helllooo')
    recordWebcam.stop()

  };

  const retake = async (e) => {

    console.log('helllooo')
    recordWebcam.retake()

  };

  function text_play(txt) {
    const dic = ['hey', 'mate', 'where', 'hi', 'there', 'help', 'can', 'how', 'islamabad', 'pakistan', 'is', 'congratulations', 'capital', 'birthday', 'thank you',
      'friend', 'goodbye', 'good bye', 'bye', 'of', 'america', 'alter', 'act', 'acer', 'accomplish', 'able'];

    const alphabets = [
      "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    ];

    var text = txt

    var ar_b = text.split(" ");
    console.log(ar_b)
    const ar = ar_b.map((element) => {
      return element.toLowerCase();
    });



    for (let i = 0; i < ar.length; i++) {
      if (dic.includes(ar[i])) {
        let path = `./PSL_Gifs/${ar[i]}.gif`;

        setgifs(gifs => [...gifs, path]);
      } else {
        var c = ar[i].split("");

        const chars = c.map((element) => {
          return element.toLowerCase();
        });

        for (let j = 0; j < chars.length; j++) {
          if (alphabets.includes(chars[j])) {
            let path2 = `./letters/${chars[j]}.png`;
            setgifs(gifs => [...gifs, path2]);

            // console.log('Path: ',path2)

            // imgArray[k].src = "letters\\" + chars[j] + ".png";
            // k++;
          }
        }
      }
    }


  }

  // function myLoop() {
  //   console.log(document.getElementById('logo'))
  //   console.log(gifs.length)
  // for (let i = 0; i < gifs.length; i++) {

  //   setInterval(function () {


  //       document.getElementById("gifs2").src = require(`${gifs[i]}`); //  your code here


  //   }, 180);

  //   if( i<gifs.length)
  //       {
  //         myLoop()
  //       }
  //       else{
  //       break
  //       }

  // }
  // }

  const generateVideoThumbnail = () => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const video = document.createElement("video");

      video.autoplay = true;
      video.muted = true;

      // Set the video source from the provided Blob object or URL
      video.src = URL.createObjectURL(Upload);
      //console.log(video.src);
      video.style.display = "block";

      video.onloadeddata = () => {
        let ctx = canvas.getContext("2d");

        // Set canvas dimensions to match the video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the video frame onto the canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        video.pause();

        // Resolve with the generated thumbnail
        resolve(canvas.toDataURL("image/png"));
      };

      // Handle video load errors
      video.onerror = (error) => {
        reject(error);
      };
    });
  };

  function resizeImage(imageSrc, maxWidth, maxHeight) {

  }

  // Function to convert data URI to Blob
  function dataURItoBlob(dataURI, filename) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString, name: filename });
  }

  function blobToBytes(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  }

  const faceAPI = async () => {

    const thumbnail = await captureImage();
    const thumbnailBlob = await dataURItoBlob(thumbnail, 'image.jpg');
    let formData = new FormData();
    await formData.append('image', thumbnailBlob);

    if (formData) {
      const response = await axios.post('http://localhost:5001/api/facedetectAPI', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setmood(response.data)
      //console.log(response);
    }

  }

  const ChatgptAPI = async () => {

    axios.get(`http://localhost:5001/api/chatgptAPI/${Query}`)
      .then((res) => {
        setsQuerryresponse(res.data)
        speakText(res.data)
      }).catch(err => console.log(err));

  }

  const captureImage = async () => {

    const thumbnail = await generateVideoThumbnail();
    await setimage(thumbnail);
   // console.log('thumbnail: ', thumbnail);
    return thumbnail;

  };

  return (
    <div>
      {showbuttons ? (<video
        id="video"
        ref={recordWebcam.previewRef}
        style={{
          width: '315.98px',
          height: '165.98px',

        }}

        autoPlay
        muted
        loop
      />) : (<video id="video" ref={recordWebcam.webcamRef} autoPlay muted></video>)}


      <div className="split-left">

        <div className="centered">

          <h1 id="text" className="intro-steps">Hi, Your Sign Translator here! </h1>
          {!Querysend ? (<div><h4><span className="subtext"></span></h4>
            </div>) : (<div>
              <h1 id="text" className="intro-steps">Query: {Query}</h1>

            </div>)}
          <div id="training-list">
            <div id="example-list">


            </div>
            <div id="add">



              {showbuttons ? (<Fragment>
                <button className="button-59" onClick={(e) => open()}>Start Saying</button>
                <button className="button-59" onClick={(e) => open2(e)}>Upload</button>
              </Fragment>

              ) : (<Fragment>
                {showupload ? (<Fragment>
                  <form >



                    <div className='custom-file'>
                      <input
                        type='file'
                        className='custom-file-input'
                        id='customFile'
                        onChange={(e) => onFileChange(e)}
                      />
                      <label className='custom-file-label' htmlFor='customFile'>
                        Choose file
                      </label>
                    </div>



                  </form>





                  <button  onClick={(e) => Nextword2()}>Next</button>
                  <button className="button-59" onClick={(e) => Assistant()}>Submit</button></Fragment>) : (
                  <Fragment>
                    <button className="button-59" onClick={(e) => start()}>Start</button>
                    <button className="button-59" onClick={(e) => stop()}>Stop</button>
                    <button className="button-59" onClick={(e) => retake()}>Retake</button>
                    <button  onClick={(e) => Nextword()}>Next</button>
                    <button className="button-59" onClick={(e) => Assistant()}>Submit</button></Fragment>)}</Fragment>)}


              <p><b>Perform each word for 3 sec </b> </p>
              <p>e.g If you intend to Say "What's <b><em>the weather</em></b>?" & "What's <b><em>the time</em></b>?" then <b><em>perfom </em></b> each  <b><em>word</em></b> for 30 sec in your webcam screen <b><em>then click</em></b> Send to get response</p>

            </div>
            <p id="count"></p>
            <div id="action-btn"></div>
          </div>

        </div>
      </div>
      <div className="split-right">
        <div className="centered">
          <div id="loader"></div>
          {mood?(<h2>Mood: {mood}</h2>):('')}
          <h2>
            <span id="answerText">
              English Sentence: 
              {Querryresponse}
            </span>
          </h2>
        </div>
      </div>

    </div>
  );
}

export default Sentensebased;
