import React, { Component } from "react";

class CldCustUploadLgRestApi extends Component {
  processFile = async (e: any) => {
    const file = e.target.files[0];

    // Set your cloud name and unsigned upload preset here:
    const YOUR_CLOUD_NAME = "YOUR_CLOUD_NAME";
    const YOUR_UNSIGNED_UPLOAD_PRESET = "YOUR_UNSIGNED_UPLOAD_PRESET";

    const POST_URL =
      "https://api.cloudinary.com/v1_1/" + YOUR_CLOUD_NAME + "/auto/upload";

    const XUniqueUploadId = +new Date();

    processFile(e);

    function processFile(e: any) {
      const size = file.size;
      const sliceSize = 20000000;
      let start = 0;

      setTimeout(loop, 3);

      function loop() {
        let end = start + sliceSize;

        if (end > size) {
          end = size;
        }
        const s = slice(file, start, end);
        send(s, start, end - 1, size);
        if (end < size) {
          start += sliceSize;
          setTimeout(loop, 3);
        }
      }
    }

    function send(piece: any, start: any, end: any, size: any) {
      console.log("start ", start);
      console.log("end", end);

      const formdata = new FormData();
      console.log(XUniqueUploadId);

      formdata.append("file", piece);
      formdata.append("cloud_name", YOUR_CLOUD_NAME);
      formdata.append("upload_preset", YOUR_UNSIGNED_UPLOAD_PRESET);
      formdata.append("public_id", "myChunkedFile2");

      const xhr = new XMLHttpRequest();
      xhr.open("POST", POST_URL, false);
      xhr.setRequestHeader("X-Unique-Upload-Id", XUniqueUploadId.toString());
      xhr.setRequestHeader(
        "Content-Range",
        "bytes " + start + "-" + end + "/" + size
      );

      xhr.onload = function () {
        // do something to response
        console.log(this.responseText);
      };

      xhr.send(formdata);
    }

    function slice(file: any, start: any, end: any) {
      const slice = file.mozSlice
        ? file.mozSlice
        : file.webkitSlice
        ? file.webkitSlice
        : file.slice
        ? file.slice
        : noop;

      return slice.bind(file)(start, end);
    }

    function noop() {}
  };

  render() {
    return (
      <div>
        <h5>Test image/video upload</h5>
        <input type="file" onChange={this.processFile} />
      </div>
    );
  }
}

export default CldCustUploadLgRestApi;
