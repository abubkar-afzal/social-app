import { PlayIcon, PauseIcon } from '../../icons';

const demoMedia = [
  { id: 1, type: 'video', src: 'https://example.com/video1.mp4', title: 'Amazing Nature' },
  { id: 2, type: 'photo', src: 'https://example.com/photo1.jpg', title: 'City Lights' },
  { id: 3, type: 'audio', src: 'https://example.com/audio1.mp3', title: 'Chill Beats' },
  { id: 4, type: 'photo', src: 'https://example.com/photo2.jpg', title: 'Mountain View' },
  { id: 5, type: 'video', src: 'https://example.com/video2.mp4', title: 'Cooking Tutorial' },
  { id: 6, type: 'photo', src: 'https://example.com/photo3.jpg', title: 'Abstract Art' },
];

export default function Hero() {
  return (
    <section className="bg-background py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-text mb-4">
            Discover, Share & Inspire
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
            Explore a world of videos, photos, and audio curated by people like you.
          </p>
        </div>

        {/* Masonry grid (simple responsive columns) */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {demoMedia.map((media) => (
            <div
              key={media.id}
              className="break-inside-avoid rounded-lg overflow-hidden shadow-md bg-surface hover:shadow-lg transition-shadow duration-300"
            >
              {media.type === 'video' ? (
                <div className="relative aspect-video bg-black">
                  <video
                    src={media.src}
                    className="w-full h-full object-cover"
                    controls
                    poster=""
                  />
                </div>
              ) : media.type === 'audio' ? (
                <div className="aspect-square bg-gradient-to-br from-primary-light to-primary-dark flex items-center justify-center">
                  <div className="text-white text-center p-4">
                    <span className="block text-sm font-medium mb-2">🎵 Audio</span>
                    <button className="rounded-full bg-white/20 p-3 hover:bg-white/30">
                      <PlayIcon className="h-8 w-8" />
                    </button>
                  </div>
                </div>
              ) : (
                <img src={media.src} alt={media.title} className="w-full object-cover" />
              )}
              <div className="p-3">
                <h3 className="text-sm font-medium text-text truncate">{media.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}