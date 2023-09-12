import { Application, Text } from "@pixi/webworker";
import gsap from "gsap";
import * as WebMMuxer from 'webm-muxer';

const renderVideo = async (data) => {
  const fps = 24;
  console.log('test')
  console.log(new Date().getTime())
  let currentTimeStamp = 0;
  let currentFrameNumber = 0;

  // Set up canvas the canvas
  const width = data.width;
  const height = data.height;
  const centerCordinates = {
    x: width / 2,
    y: height / 2,
  }
  const canvasElement = new OffscreenCanvas(width, height);

  // Create a new PIXI app
  const app = new Application({
    view: canvasElement,
    background: '#1099bb',
    width,
    height,
  });

  // sync pixi and gsap
  app.ticker.stop();
  gsap.ticker.fps(fps);
  gsap.ticker.add(() => {
    app.ticker.update();
  });

  // Create a gsap timeline
  const tl = gsap.timeline();
  tl.pause();
  tl.seek(0);

  // Generate gsap animations for each line
  const lyricAninmations = data.lyrics.map(({ id, start, end, text }) => {
    const pixiText = new Text(text);
    pixiText.anchor.set(0.5);
    return {
      id,
      start,
      end,
      text: pixiText,
    }
  });

  
  // Add each animation to the stage
  const removeLastAnimationTimestamps = [];
  // app.stage.removeChild(currentLine)
  lyricAninmations.forEach((line) => {
    removeLastAnimationTimestamps.push(Math.floor(line.end) * fps);
    const currentLine = line.text;
    currentLine.x = centerCordinates.x;
    currentLine.y = centerCordinates.y + 100;
    currentLine.alpha = 0;
    app.stage.addChild(currentLine);
    tl.to(currentLine, {
      x: currentLine.x,
      y: centerCordinates.y,
      duration: 0.5,
      alpha: 1,
      onUpdateParams: [currentLine],
      onComplete: () => { 
      },
    }, line.start);
  });


  // Set up muxer
  const { Muxer, StreamTarget } = WebMMuxer;
  const muxer = new Muxer({
    firstTimestampBehavior: 'offset',
    target: new StreamTarget(
      (data, position) => { 
        self.postMessage({
          data,
          position
        });
      },
      () => { console.log('Finished Muxing') }
    ),
    video: {
      codec: 'V_VP9',
      width,
      height,
      frameRate: fps
    }
  });


  // Set up video encoder
  let videoEncoder = new VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta, currentTimeStamp),
    error: (e) => console.error(e)
  });

  videoEncoder.configure({
    codec: 'vp09.00.10.08',
    width,
    height,
    bitrate: 1e6,
    bitrateMode: 'constant'
  });

  const encodeFrame = async (videoFrame) => {
    const keyFrame = currentTimeStamp % 60 === 0;
    videoEncoder.encode(videoFrame, { keyFrame });
  };

  const finishEncoding = async () => {
    await videoEncoder.flush();
    muxer.finalize();
    self.postMessage({
      shouldCloseStream: true,
    });
  };

  // Loop through animation, capture image and encode frame
  // const totalFrameNumber = fps * tl.duration();
  const stepBy = 1 / (fps * tl.duration());
  for (let t = 0; t <= 1; t += stepBy) {
    currentTimeStamp = (currentFrameNumber / 30) * 1000000;
    tl.progress(t);

    const lastAnimationEndFrame = removeLastAnimationTimestamps[0];
    if (currentFrameNumber === lastAnimationEndFrame) {
      removeLastAnimationTimestamps.shift();
      const lastAnimation = lyricAninmations.shift();
      app.stage.removeChild(lastAnimation.text);
    }

    // ====================================== 
    // Try moving this to a worker
    // ====================================== 
    // 51 seconds to export 30 seconds
    // const webGlPixesl = new Uint8ClampedArray(app.renderer.extract.pixels());
    // const imageData = new ImageData(webGlPixesl, width, height)
    // const imageBitmap = await createImageBitmap(imageData)
    // const frame = new VideoFrame(imageBitmap, { timestamp: currentTimeStamp });

    // 73 seconds to export 30 seconds
    const frame = new VideoFrame(app.renderer.extract.canvas(), { timestamp: currentTimeStamp });
    await encodeFrame(frame);
    frame.close();

    await new Promise(resolve => requestAnimationFrame(resolve));
    currentFrameNumber++;
  }

  finishEncoding();
}



self.onmessage = async ({ data }) => {
  renderVideo(data);
};