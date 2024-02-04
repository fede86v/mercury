import React from 'react'

const useAfip = () => {

    const soap = () => {
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.open('POST', 'https://somesoapurl.com/', true);

        // build SOAP request
        var sr = '<? xml version = "1.0" encoding = "utf-8" ?>' +
            '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
            '<soap:Body>' +
            '<FECAESolicitar xmlns="http://ar.gov.afip.dif.FEV1/">' +
            '<Auth>' +
            '<Token>' + + '</Token>' +
            '<Sign>' + + '</Sign>' +
            '<Cuit>' + + '</Cuit>' +
            '</Auth>' +
            '<FeCAEReq>' +
            '<FeCabReq />' +
            '<FeDetReq>' +
            '<FECAEDetRequest />' +
            '<FECAEDetRequest />' +
            '</FeDetReq>' +
            '</FeCAEReq>' +
            '</FECAESolicitar>' +
            '</soap:Body>' +
            '</soap:Envelope>';


        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    alert(xmlhttp.responseText);
                    // alert('done. use firebug/console to see network response');
                }
            }
        }
        // Send the POST request
        xmlhttp.setRequestHeader('Content-Type', 'text/xml');
        xmlhttp.send(sr);
        // send request
        // ...
    }

}

export default useAfip;