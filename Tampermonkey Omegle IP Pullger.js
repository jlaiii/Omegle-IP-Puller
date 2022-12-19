// ==UserScript==
// @name         Omegle IP Display and Lookup
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Display and lookup Omegle user's IP addresses in a separate window
// @author       Your Name
// @match        https://www.omegle.com*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
  'use strict';

  const ipWindow = window.open("", "IP Window", "height=100,width=200");
  ipWindow.document.body.innerHTML = "<br>Omegle IP Puller";
  const loggedIps = new Set();

  const oRTCPeerConnection = window.RTCPeerConnection || window.oRTCPeerConnection;
  window.RTCPeerConnection = function(...args) {
    const pc = new oRTCPeerConnection(...args);
    const addIceCandidate = pc.addIceCandidate.bind(pc);
    pc.addIceCandidate = function(iceCandidate, ...rest) {
      const fields = iceCandidate.candidate.split(' ');
      if (fields[7] === 'srflx' && !loggedIps.has(fields[4])) {
        console.log('IP Address:', fields[4]);
        loggedIps.add(fields[4]);
        const ipAddress = document.createElement("p");
        ipAddress.innerHTML = "IP Address: " + fields[4];
        const button = document.createElement("button");
        button.innerHTML = "IP Lookup";
        button.addEventListener("click", function() {
          window.open("https://whatismyipaddress.com/ip/" + fields[4]);
        });

        // Insert the new IP address and button at the top of the window
        ipWindow.document.body.insertBefore(button, ipWindow.document.body.firstChild);
        ipWindow.document.body.insertBefore(ipAddress, ipWindow.document.body.firstChild);
      }

      return addIceCandidate(iceCandidate, ...rest);
    }

    return pc;
  }
})();