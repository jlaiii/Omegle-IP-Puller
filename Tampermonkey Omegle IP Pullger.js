// ==UserScript==
// @name         Omegle IP Display and Lookup
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Display and lookup Omegle user's IP addresses
// @author       Your Name
// @match        https://www.omegle.com*
// @grant        none
// @run-at       document-end
// ==/UserScript==
(function() {
  'use strict';

  // Create the floating box element
  const ipBox = document.createElement("div");
  ipBox.style.position = "fixed";
  ipBox.style.bottom = "10px";
  ipBox.style.right = "10px";
  ipBox.style.backgroundColor = "white";
  ipBox.style.border = "1px solid black";
  ipBox.style.padding = "10px";
  ipBox.innerHTML = "<h3>Omegle IPs</h3>";

  // Set the z-index of the floating box to a high value
  ipBox.style.zIndex = "9999";

  // Append the floating box to the document body
  document.body.appendChild(ipBox);

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

        // Append the new IP address and button to the floating box
        ipBox.appendChild(ipAddress);
        ipBox.appendChild(button);
      }

      return addIceCandidate(iceCandidate, ...rest);
    }

    return pc;
  }
})();
