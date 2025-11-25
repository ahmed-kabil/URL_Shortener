setTimeout(()=>{

const gen_counter = document.querySelector("#shortened");
const red_counter = document.getElementById("redirects");

const gen_count_fun  = async () => {

    setInterval( async () =>{
        await fetch(`http://${window._backhost_.host}:7000/gencount`)
        .then(res => res.json())
        .then((data) => {
            
            let gen_count = data.count;
            gen_counter.innerText = gen_count
        })    
},1000)
}

gen_count_fun();


const red_count_fun  = async () => {

    setInterval( async () =>{
        await fetch(`http://${window._backhost_.host}:7000/redcount`)
        .then(res => res.json())
        .then((data) => {
            
            let red_count = data.count;
            red_counter.innerText = red_count
        }) 
},1000)
}

red_count_fun();
  
},500)

    // ✅ دالة لإظهار رسالة Toast
    function showToast(message, color = "#4caf50") {
      const toast = document.getElementById("toast");
      toast.textContent = message;
      toast.style.background = color;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2000);
    }


     function isValidUrl(string) {
        try {
          new URL(string); // Will throw if string is not a valid URL
          return true;
        } catch (err) {
          return false;
        }
      }

    // ✅ دالة لتقصير الرابط (محاكاة)
    function shortenUrl() {
      const input = document.getElementById("longUrl");
      const loading = document.getElementById("loading");
      const shortUrl = document.getElementById("shortUrl");
      const shortLink = document.getElementById("shortLink");
      const result_div = document.getElementById("result_div");
      const copy_btn =document.getElementById("copy_btn");
    //   const shorten_btn = document.getElementById("shorten_btn")
    //   console.log(input.value);

     if(!isValidUrl(input.value.trim())){
              showToast("⚠️ Please enter a valid URL", "#e53935");
        return;
     }


      let req = {
        "url": input.value
      }
      fetch(`http://${window._backhost_.host}:7000/shorten`, {
       method: "POST",
       headers: {
      "Content-Type": "application/json", // tell server it's JSON
    },
    body: JSON.stringify(req), // convert object -> JSON string
  })
  .then(res => res.json())  // get response as JSON
  .then(data => {
    console.log("Server response:", data.data.url.short_url);

 

///

     result_div.style.display = "flex";
     copy_btn.style.display = "block";
      loading.style.display = "block";
      shortUrl.style.display = "none";

      // محاكاة عملية تقصير الرابط
      setTimeout(() => {
        loading.style.display = "none";
        shortUrl.style.display = "block";
        shortLink.textContent = data.data.url.short_url;
        showToast("✅ URL shortened successfully!");

      }, 500);
    }

////

  )
  .catch(err => {
    console.error("Error:", err);
  });

}



    // ✅ دالة للصق من الحافظة
async function pasteUrl() {
   try {
     const text = await navigator.clipboard.readText();
      document.getElementById("longUrl").value = text;
     }
      catch (err) {
         showToast("❌ Clipboard access denied.", "#e53935");
         } }
          // ✅ دالة لنسخ الرابط المختصر 
function copyUrl() {
      const shortLink = document.getElementById("shortLink").textContent;
       navigator.clipboard.writeText(shortLink)
        .then(() => showToast("✅ Short link copied to clipboard!"))
        .catch(() => showToast("❌ Failed to copy link.", "#e53935")); 

      }
