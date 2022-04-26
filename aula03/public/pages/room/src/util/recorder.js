class Recorder {
  constructor(userName, stream) {
    this.userName = userName;
    this.stream = stream;

    this.filename = `id:${userName}-when:${Date.now()}`;
    this.videoType = 'video/webm';

    this.mediaRecorder = {};
    this.recorderBlobs = [];
    this.completeRecordings = [];
    this.recordingActive = false;
  }

  _setup() {
    const commonCodecs = ['codecs=vp9,opus', 'codecs=vp8,opus', ''];

    const options = commonCodecs
      .map((codec) => ({
        mimeTypes: `${this.videoType}:${codec}`,
      }))
      .find((options) => MediaRecorder.isTypeSupported(options));

    if (!options) {
      throw new Error(
        `none of the codecs: ${commonCodecs.join(',')} are supported`,
      );
    }

    return options;
  }

  startRecording() {
    const options = this._setup();
    //  se não estiver recebendo mais video, já ignora!
    if (!this.stream.active) return;
    this.mediaRecorder = new MediaRecorder(this.stream, options);
    console.log(
      `Created MediaRecorder ${this.mediaRecorder} with options ${options}`,
    );

    this.mediaRecorder.onstop = (event) => {
      console.log('Recorded Blobs', this.recorderBlobs);
    };

    this.mediaRecorder.ondataavailable = (event) => {
      if (!event.data || !event.data.sizes) return;

      this.recorderBlobs.push(event.data);
    };

    this.mediaRecorder.start();
    console.log(`Media Recorded started`, this.mediaRecorder);
    this.recordingActive = true;
  }

  async stopRecording() {
    if (!this.recordingActive) return;
    if (this.mediaRecorder.state === 'inactive') return;

    console.log(`media recorded stopped!`, this.userName);
    this.mediaRecorder.sstop();

    this.recordingActive = false;
    await Util.sleep(200);
    this.completeRecordings.push([...this.recorderBlobs]);
    this.recorderBlobs = [];
  }
}
