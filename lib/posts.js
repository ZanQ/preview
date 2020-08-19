//import { ANON_POST_DETAILS } from '../url/baseUrl'
import axios from 'axios'
import fetch from 'node-fetch'

const ipurl = "https://api.ipify.org";
const ANON_POST_DETAILS ='http://localhost/ZanQ/index.php/Api/Post/PostDetailWithIP';

export default function getPostDetails(id) {

  let data = '';

  sendID(id)
    .then((data) => {

        //Success
        if (data['code'] === 1) {
               data = data['data']

               return (
                 data
               )
        }  
        else {
              var error2 = new Error(data['message']);
              throw error2;
        }  
    })
    .catch(error => console.log(error))

}

async function sendID (id) {

  let ipresponse = await axios.get(ipurl)
            .catch(errors => console.log(errors));
  let ip = await ipresponse.data;

  console.log("ID - : " + id);
  console.log("IP - : " + ip);

  //Data Object to Pass Through
  const DetailRequest = {
        postId: id,
        ip: await ip,
  }

  let response = await fetch(ANON_POST_DETAILS, { 
    method: 'POST',
    headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: "params=" + JSON.stringify(DetailRequest) + "&developer=1",
    credentials: 'same-origin'
    })
    .then(response => {
            if (response.ok) {
                    return response;
            }
            else {
                    var error = new Error('Error ' + response.status + ': ' + response.statusText);
                    error.response = response;
                    throw error;
            }
    },
    error => {
            var errorMessage = new Error(error.errorMessage);
            throw errorMessage;
    }) 

  let data = await response.json();
  
  return (
      data
  )
}

/*
//Retrieve data from Server
async function sendID (id) {
  
  let ipresponse = await axios.get(ipurl)
            .catch(errors => console.log(errors));
  let ip = await ipresponse.data;

  console.log("ID - : " + id);
  console.log("IP - : " + ip);

  //Set the Form Data to Upload
  var formData = new FormData();

  //Data Object to Pass Through
  const DetailRequest = {
        postId: id,
        ip: await ip,
  }

  console.log("Request 1 : " + DetailRequest);

  const jsonBody = JSON.stringify(DetailRequest);

  console.log("Request : " + DetailRequest);

  formData.append("params", jsonBody);
  formData.append("developer", "1");

  console.log("Form : " + formData);

  //Upload
  const config = {
      Headers: "Content-Type: application/x-www-form-urlencoded"
  }

  let response = await axios.post(ANON_POST_DETAILS, formData, config)
      .catch(errors => console.log(errors));
        
  let data = response.data;

  return data;
}*/

