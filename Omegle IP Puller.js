const oRTCPeerConnection = window.RTCPeerConnection || window.oRTCPeerConnection;

window.RTCPeerConnection = function(...args) {
  const pc = new oRTCPeerConnection(...args);

  const addIceCandidate = pc.addIceCandidate.bind(pc);
  pc.addIceCandidate = function(iceCandidate, ...rest) {
    const fields = iceCandidate.candidate.split(' ');
    if (fields[7] === 'srflx') {
      console.log('IP Address:', fields[4]);
      // Create a new window
      const ipWindow = window.open("", "IP Window", "height=100,width=200");
      // Clear the inner HTML of the window
      ipWindow.document.body.innerHTML = "";
      // Write the IP address to the new window
      ipWindow.document.write("IP Address: " + fields[4]);
    }
    return addIceCandidate(iceCandidate, ...rest);
  }

  return pc;
}