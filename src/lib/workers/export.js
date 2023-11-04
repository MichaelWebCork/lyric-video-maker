import { Application, Text, TextStyle, Assets } from "@pixi/webworker";
import gsap from "gsap";
// import * as WebMMuxer from 'webm-muxer';
import * as WebMMuxer from 'mp4-muxer';

const renderVideo = async (data) => {

  Assets.addBundle('fonts', {
    'Varela Round': '../fonts/VarelaRound-Regular.ttf',
  });


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
    removeLastAnimationTimestamps.push(Math.floor(line.end * fps));
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

  const text = new Text('Made with LyricVideoBuilder.com', new TextStyle({ fontFamily: 'Varela Round', fontSize: 32 }));
  text.anchor.set(1);
  text.x = width - 80;
  text.y = height - 50;
  app.stage.addChild(text);

  // Set up muxer
  // const { Muxer, StreamTarget } = WebMMuxer;
  // const muxer = new Muxer({
  //   firstTimestampBehavior: 'offset',
  //   target: new StreamTarget(
  //     (data, position) => { 
  //       self.postMessage({
  //         data,
  //         position
  //       });
  //     },
  //     () => { console.log('Finished Muxing') }
  //   ),
  //   video: {
  //     codec: 'V_VP9',
  //     width,
  //     height,
  //     frameRate: fps
  //   },
  //   audio: {
	// 		codec: 'A_OPUS',
	// 		sampleRate: data.audioInfo.sampleRate,
	// 		numberOfChannels: 2
  //   }
  // });

  // MP4
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
      codec: 'avc',
      width,
      height,
      frameRate: fps
  },
    audio: {
			codec: 'opus',
			sampleRate: data.audioInfo.sampleRate,
			numberOfChannels: 2
    },
    fastStart: 'in-memory'
  });
1

  // Set up video encoder
  let videoEncoder = new VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta, currentTimeStamp),
    error: (e) => console.error(e)
  });

  // videoEncoder.configure({
  //   codec: 'vp09.00.10.08',
  //   width,
  //   height,
  //   bitrate: 1e6,
  //   bitrateMode: 'constant'
  // });

  videoEncoder.configure({
    codec: 'avc1.640029',
    width,
    height,
    bitrate: 1e6,
    bitrateMode: 'constant'
  });


  // return;
  let audioData = new AudioData({
    format: 'f32-planar',
    sampleRate: data.audioInfo.sampleRate,
    numberOfChannels: data.audioInfo.numberOfChannels,
    numberOfFrames: data.audioInfo.numberOfFrames,
    timestamp: 0,
    data: data.audio
  });
  
  const audioEncoder = new AudioEncoder({
    output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
    error: (e) => console.log(e)
  });
  audioEncoder.configure({
    codec: 'opus',
    numberOfChannels: 2,
    sampleRate: data.audioInfo.sampleRate
  });

  audioEncoder.encode(audioData);
  
  // return;
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
    currentTimeStamp = (currentFrameNumber / fps) * 1000000;
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