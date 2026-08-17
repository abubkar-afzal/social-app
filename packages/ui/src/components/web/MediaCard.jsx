import { PlayIcon, PauseIcon, BookmarkIcon, PlusIcon } from '../../icons';

export default function MediaCard({ media }) {
  return (
    <div className="group relative rounded-lg overflow-hidden bg-surface shadow-sm hover:shadow-md transition-shadow">
      {/* Media preview */}
      <div className="aspect-square w-full overflow-hidden">
        {media.type === 'video' ? (
          <video src={media.src} className="w-full h-full object-cover" muted loop />
        ) : media.type === 'audio' ? (
          <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <PlayIcon className="h-12 w-12 text-white" />
          </div>
        ) : (
          <img src={media.src} alt={media.title} className="w-full h-full object-cover" />
        )}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
        <div className="flex justify-end">
          <button className="rounded-full bg-white/90 p-2 text-text hover:bg-white">
            <BookmarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white text-sm font-medium truncate">{media.title}</span>
          <button className="rounded-full bg-primary p-2 text-white hover:bg-primary-dark">
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}