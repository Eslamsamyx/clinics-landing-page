import { motion } from "framer-motion";
import { Play, Video } from "lucide-react";
import { api } from "~/utils/api";
import { useState } from "react";

// Helper function to get video thumbnail
const getVideoThumbnail = (videoUrl: string): string => {
  // For local videos, derive thumbnail path
  if (videoUrl.startsWith('/videos/')) {
    const videoName = videoUrl.split('/').pop()?.replace('.mp4', '');
    return `/videos/thumbnails/${videoName}.jpg`;
  }

  // For YouTube videos, extract ID and get thumbnail
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = videoUrl.match(youtubeRegex);
  if (match?.[1]) {
    return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
  }

  return "/video-placeholder.jpg";
};

export default function VideoReviews() {
  const { data: reviews, isLoading } = api.videoReview.getAll.useQuery();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-accent-light">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-accent-light relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-20 h-96 w-96 rounded-full bg-primary blur-3xl"></div>
        <div className="absolute bottom-10 left-20 h-96 w-96 rounded-full bg-accent blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="mb-4 flex justify-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)' }}
            >
              <Video className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="gradient-text mb-4 text-4xl font-bold md:text-5xl">
            شهادات مرضانا بالفيديو
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            استمع لتجارب حقيقية من مرضى استفادوا من خدماتنا العلاجية
          </p>
        </motion.div>

        {/* Video Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => {
            const isYoutube = review.videoUrl.includes('youtube.com') || review.videoUrl.includes('youtu.be');
            const youtubeMatch = review.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
            const embedUrl = youtubeMatch?.[1]
              ? `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`
              : review.videoUrl;

            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                {/* Video Container */}
                {selectedVideo === review.id ? (
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-black">
                    {isYoutube ? (
                      <iframe
                        src={embedUrl}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <video
                        src={review.videoUrl}
                        className="absolute inset-0 w-full h-full"
                        controls
                        autoPlay
                      />
                    )}
                  </div>
                ) : (
                  <div
                    className="relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer aspect-video group"
                    onClick={() => setSelectedVideo(review.id)}
                  >
                    {/* Thumbnail */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                      style={{
                        backgroundImage: `url(${getVideoThumbnail(review.videoUrl)})`,
                      }}
                    >
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                    </div>

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.15 }}
                        className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-2xl group-hover:bg-white transition-colors duration-300"
                      >
                        <Play className="h-10 w-10 ml-1" style={{ color: '#0a1931' }} fill="currentColor" />
                      </motion.div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-600 mb-6">
            كن واحداً من مرضانا السعداء
          </p>
          <motion.a
            href="/booking"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block rounded-lg px-8 py-4 text-white font-bold text-lg transition-all duration-300 hover:shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)'
            }}
          >
            احجز موعدك الآن
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
