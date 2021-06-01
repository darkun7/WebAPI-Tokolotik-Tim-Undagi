const { spawn } = require("child_process");

function prepareData(url, token, successCallback, errorCallback) {
  
  const dataPreparation = spawn("python3", [
    "public/model/model-transaction/dataset_preparation.py",
    url,
    token,
  ]);

  dataPreparation.stdout.on("data", (auth_status) => {
    successCallback(`${auth_status}`);
  });

  dataPreparation.stderr.on("data", (data) => {
    errorCallback(data);
  });

  dataPreparation.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

function modelPredict(id, url, token,request, response) {
  return new Promise((resolve, reject) => {
    prepareData(
      url,
      token,
      (auth_status) => {
        resolve(auth_status);
        if (auth_status == 200) {
          const modelData = spawn("python3", ["public/model/model-transaction/model_predict.py", id]);
          modelData.stdout.on("data", (data) => {
            console.log(`${data}`)
            return;
          });

          modelData.stderr.on("data", (data) => {
            return
          });

          modelData.on("close", (code) => {
            console.log(`child process exited with code ${code}`);
            response.status(200).send({
              compositions       : process.env.APP_URL+`/result/productId_${id}/compositions_pred.json`,
              next_6_months      : process.env.APP_URL+`/result/productId_${id}/next_6_months.png`,
              start_next_6_months: process.env.APP_URL+`/result/productId_${id}/start_next_6_months.png`,
            });
          });
        } else {
          console.log("Authentication failed");
        }
      },
      (err) => {
        reject(err);
      }
    );
  });
}

exports.predict = async (request, response) => {
  const productId = request.params.id;
  const token     = request.header('auth-token');
  const URL       = process.env.APP_URL+`/api/users/stores/products/${productId}/transactions/`;
  modelPredict(productId, URL, token,request, response);
}