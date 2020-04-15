const mediaRecorder = new mediaRecorder(stream)

let chunks = [];

mediaRecorder.ondataavailable = function(e) {
  chunks.push(e.data);
}
