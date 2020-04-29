const express = require ('express');
const router = express.Router();
const request = require('request-promise-native');

router.get('/everything/:access_token', getEverything);

async function getEverything(req, res, next) {
    let access_token = req.params.access_token;

    let options = {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + access_token
        }
    }

    let patient_metadata = await request('https://api.1up.health/fhir/dstu2/Patient', options).then(data => {
        return JSON.parse(data);
    }).catch(err => {
        console.log("Error: " + err)
        return err;
    });

    let patient_id = patient_metadata.entry[0].resource.id;

    let patient_data = await request('https://api.1up.health/fhir/dstu2/Patient/' + patient_id + '/$everything', options).then(data => {
        return JSON.parse(data);
    }).catch(err => {
        console.log("Error: " + err)
        return err;
    });

    res.send(patient_data);
}

module.exports = router;