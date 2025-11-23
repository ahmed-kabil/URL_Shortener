const { Url, GenCount, RedCount } = require("./model");
const { nanoid } = require("nanoid");
const {shortenedUrlsCounter,redirectCounter,notFoundCounter,totalErrorCounter,httpRequestDuration,register} = require('./metrics')




const shortenLink = async (req, res) => {
  const end = httpRequestDuration.startTimer();
   try{
       const shortCode = nanoid(6); // generates a 6-character random string
    const entry = {
        "long_url": req.body.url,
        "shorten_text": shortCode,   // i will make this value random
        "short_url": `${process.env.HOST}:${process.env.PORT}/${shortCode}`
        
    };

      let new_shortening = new Url(entry);
      // console.log(new_shortening)
     await new_shortening.save()
     await GenCount.updateOne({}, { $inc: { count: 1 } }, { upsert: true });
     res.status(201).json({status: "success",data: {url: new_shortening}});
     end({ method: "POST", route: "/shorten", code: 201 });

    shortenedUrlsCounter.inc()

      }catch(err){
         res.status(404).json({
         status: "error",
         message: err.message      
   })
   end({ method: "POST", route: "/shorten", code: 404 });
   totalErrorCounter.inc() ;

  }

}



const redirectLink = async (req, res) => {
  const end = httpRequestDuration.startTimer();

   try{
      const url_entry = await Url.findOne({ shorten_text: req.params.text });
    //   console.log(url_entry)
      if(!url_entry){
        notFoundCounter.inc()
         res.status(404).json({status: "fail",data: null})
      }
    //   console.log("hit")
      res.redirect(url_entry.long_url);
      end({ method: "GET", route: "/redirect", code: 200 });
      redirectCounter.inc()
      await RedCount.updateOne({}, { $inc: { count: 1 } }, { upsert: true });
   }catch(err){
      res.status(404).json({
         status: "error",
         message: err.message
      })
      totalErrorCounter.inc() ;
      end({ method: "GET", route: "/redirect", code: 404 });

   }
}


const getgencount = async (req, res) => {
  try {
    const gencount = await GenCount.findOne({});

    // if not found, return 0 or handle it
    if (!gencount) {
      return res.json({ count: 0 });
    }

    res.json({ count: gencount.count });
  } catch (err) {
    res.status(500).json({ error: err.message });
   totalErrorCounter.inc() ;

  }
};


const getredcount = async (req, res) => {

  try {
    const redcount = await RedCount.findOne({});

    // if not found, return 0 or handle it
    if (!redcount) {
      return res.json({ count: 0 });
    }

    res.json({ count: redcount.count });
  } catch (err) {
    res.status(500).json({ error: err.message });
   totalErrorCounter.inc() ;
  }
};

const getAllMetrics = async (req, res) =>{
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err.message);
  }
}

module.exports = {
shortenLink,
redirectLink,
getgencount,
getredcount,
getAllMetrics
}