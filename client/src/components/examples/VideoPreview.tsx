import VideoPreview from '../VideoPreview';

export default function VideoPreviewExample() {
  return (
    <div className="h-[600px]">
      <VideoPreview onDownload={() => console.log('Download triggered')} />
    </div>
  );
}
