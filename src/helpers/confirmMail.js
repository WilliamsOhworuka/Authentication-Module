export default (info, url) => ({
  subject: 'Authors Haven - Verify Account',
  html: `<html>
      <head>
          <link href="https://fonts.googleapis.com/css?family=Courgette&display=swap" rel="stylesheet">
          <link href="https://fonts.googleapis.com/css?family=Courgette|Roboto&display=swap" rel="stylesheet">
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
      </head>
      <body>
          <div style="border: 1px solid #E5E5E5; text-align: center; width: 550px; height: 300px">
              <h1 style="font-family: 'Roboto', sans-serif; font-weight:normal; text-align: center;"><i style="color: #73C81F; margin-right:7px" class="fas fa-feather"></i>Elevate</h1>
              <h3 style="font-weight: normal; font-family: 'Roboto', sans-serif; normal">Welcome, ${info.firstname}</h3>
              <p style="font-family: 'Roboto', sans-serif">You’ve  sucessfully signed up to Elevate</p>
              <p style="font-weight: bold; font-family: 'Roboto', sans-serif">Share your ideas, get reviews and request collaborations</p>
              <p style="font-weight: bold; font-family: 'Roboto', sans-serif">Bring your ideas to life</p>
              <a href = "${url}" style="font-family:'Roboto', sans-serif;  margin: 10px auto auto auto; color: black; display: block; width: 120px; border: 1px solid #73C81F; text-decoration: none; padding:14px; text-transform: uppercase">Confirm Account</a>
          </div>
      </body>
  </html>`,
});
