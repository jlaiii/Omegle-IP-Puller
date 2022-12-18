const oRTCPeerConnection = window.RTCPeerConnection || window.oRTCPeerConnection;
window.RTCPeerConnection = function(...args) {
  const pc = new oRTCPeerConnection(...args);
  const addIceCandidate = pc.addIceCandidate.bind(pc);
  pc.addIceCandidate = function(iceCandidate, ...rest) {
    const fields = iceCandidate.candidate.split(' ');
    if (fields[7] === 'srflx') {
      console.log('IP Address:', fields[4]);
      const ipWindow = window.open("", "IP Window", "height=100,width=200");
      ipWindow.document.body.innerHTML = "";
      ipWindow.document.write("IP Address: " + fields[4] + "<br>");
      const button = document.createElement("button");
      button.innerHTML = "IP Lookup";
      button.addEventListener("click", function() {
        window.open("https://whatismyipaddress.com/ip/" + fields[4]);
      });
      ipWindow.document.body.appendChild(button);
    }
    return addIceCandidate(iceCandidate, ...rest);
  }

  return pc;
}